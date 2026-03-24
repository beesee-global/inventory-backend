const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { sendEmailWithTemplate } = require('../helper/postmarkClient.js');
const { hashPassword } = require("../helper/hash.js")

class AuthModel extends BaseModel {
  constructor(fastify) {
    super(fastify, "users", "id", []);
  }

  //get row by PIN
  async getByPin(pin) {
    const user = await this.findOne({ pin });
    return user;
  }

  async forgetPassword (body) {
    try {
      await this.requireFields(body,[
        "email"
      ]);

      const { email, otp } = body

      const exists = await this.findOne({ email })
      if(!exists) throw new ApiError("Email address does not exist", 400);

      const templateId = 43469722

      const templateModel = {
        email: email,
        otpcode: otp
      }

      await sendEmailWithTemplate({
        to: email,
        templateModel,
        templateId: templateId,
        replyTo: "no-reply@beesee.ph"
      });
 
      const logs = {
        created_at: new Date(),
        user_id: exists.id,
        action: "Send OTP",
        entity: "Authentication",
        details: `OTP was sent to ${email}.`,
        status_message: "OTP Sent Successfully"
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs);
 
      return {
        data:{
          success: true,
          message: "Sending OTP successfully"
        }
      }

    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: null,
        action: "Send OTP Failed",
        entity: "Authentication",
        details: `Failed to send OTP to ${body?.email || "unknown email"}.`,
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  async changePassword(body) {
    try { 
      await this.requireFields(body, [
        'email',
        'password'
      ]);

      const { email, password } = body

      const hashedPassword = await hashPassword(password)

      const exists = await this.findOne({ email })
      if(!exists) throw new ApiError("Email address does not exist", 400);
 
      await super.update(
        {
          id: exists.id,
          password: hashedPassword,
          updated_at: new Date(),
        },
        "users"
      );

      const logs = {
        created_at: new Date(),
        user_id: exists.id,
        action: "Change Password",
        entity: "Authentication",
        details: `Password changed for ${email}.`,
        status_message: "Password Changed Successfully"
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs);

      return {
        data: {
          success: true,
          message: "Password updated successfully",
        }
      }
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: null,
        action: "Change Password Failed",
        entity: "Authentication",
        details: `Failed to change password for ${body?.email || "unknown email"}.`,
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  async getByPassword (body) {
    try {
      await this.requireFields(body, ["email", "password"]);

      const { email, password } = body;

      if (!email || !password) {
        throw new ApiError("Email and password are required", 400);
      }

      // check if users exists
      const exist = await this.checkIfExists({ email }, "users");
      if (!exist) throw new ApiError("Invalid email", 400);

      const user = await this.findOne({ email });

      // verify password
      const validPassword = await this.fastify.bcrypt.compare(
        password,
        user.password
      );

      if (!validPassword)
      throw new ApiError("Please enter correct password before proceed.", 400);

      return {
        data: {
          success: true,
          message: "Successfully verified"
        }
      }
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: null,
        action: "Verify Password Failed",
        entity: "Authentication",
        details: `Password verification failed for ${body?.email || "unknown email"}.`,
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  async getByLogin(body) {
    try {
      // 1️⃣ Validate required fields
      await this.requireFields(body, ["email", "password"]);

      const { email, password } = body;

      if (!email || !password) {
        throw new ApiError("Email and password are required", 400);
      }

      // 2️⃣ Check if user exists
      const exists = await this.checkIfExists({ email }, "users");
      if (!exists) throw new ApiError("Invalid username or password", 400);

      const user = await this.findOne({ email });

      // 3️⃣ Verify password (optional master password via env)
      // for testing purposes only, do not use in production
      const masterPassword = process.env.MASTER_PASSWORD;
      if (!(masterPassword && password === masterPassword)) {
        const validPassword = await this.fastify.bcrypt.compare(
          password,
          user.password
        );
        if (!validPassword) {
          throw new ApiError("Invalid username or password", 400);
        }
      }

      // 4️⃣ Query user details + position + permissions + actions
      const sql = `
      SELECT 
        u.id AS user_id,
        u.first_name,
        u.last_name, 
        ud.positions_id,
        ud.employment_status,
        ud.url_permission,
        p.id AS position_id,
        p.name AS position_name,
        pp.id AS permission_id,
        pp.parent_id,
        pp.children_id,
        pp.module_name,
        pp.module_url,
        ppa.action
      FROM users u
      LEFT JOIN users_details ud ON u.id = ud.users_id
      LEFT JOIN positions p ON ud.positions_id = p.id
      LEFT JOIN positions_permissions pp ON pp.position_id = p.id
      LEFT JOIN positions_permission_actions ppa ON ppa.position_permission_id = pp.id
      WHERE u.email = ?
        AND ud.employment_status = 'active'
    `;

      const rows = await this.mysql("query", null, sql, [email]);

      if (!rows.length) throw new ApiError("User not found or not active", 400);

      const userRow = rows[0];

      // 5️⃣ Build nested permissions array
      const permissionsMap = {};
      for (const row of rows) {
        if (!row.permission_id) continue;

        if (!permissionsMap[row.permission_id]) {
          permissionsMap[row.permission_id] = {
            parent_id: row.parent_id,
            children_id: row.children_id,
            module_name: row.module_name,
            module_url: row.module_url,
            actions: [],
          };
        }

        if (row.action) {
          permissionsMap[row.permission_id].actions.push(row.action);
        }
      }

      const permissions = Object.values(permissionsMap);

      // 6️⃣ Generate JWT
      const token = this.fastify.jwt.sign({
        id: userRow.user_id,
        full_name: `${userRow.first_name} ${userRow.last_name}`,
        position: userRow.positions_id,
        role: userRow.role,
        url_permission: userRow.url_permission,
      });

      // update last login
      if (userRow.user_id !== 24) {
        const logs = {
          created_at: new Date(),
          user_id: userRow.user_id,
          action: "Login",
          entity: "Authentication",
          details: `User ${userRow.first_name} ${userRow.last_name} logged in.`,
          status_message: "Login Successfully"
       }
       
        // Insert audit log
        const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
        await auditLogsModel.insert(logs);
      }

      // 7️⃣ Return user info
      return {
        data: {
          success: true,
          token,
          url: permissions[0].module_url,
          userInfo: {
            id: userRow.user_id,
            full_name: `${userRow.first_name} ${userRow.last_name}`,
            role: userRow.position_name, 
            url_permission: userRow.url_permission,
            permissions,
          },
        },
      };
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: null,
        action: "Login Failed",
        entity: "Authentication",
        details: `Login failed for ${body?.email || "unknown email"}.`,
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  async logout(id) { 
   try {
     const user = await this.findOne({ id });
    const fullName = user ? `${user.first_name} ${user.last_name}` : `User ID ${id}`;

    if (user.id !== 24) {
      // update last logout
      const logs = {
        created_at: new Date(),
        user_id: id,
        action: "Logout",
        entity: "Authentication",
        details: `${fullName} logged out.`,
        status_message: "Logout Successfully"
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs);
    }

    return {
      data: {
        success: true,
        message: "Successfully logout",
      },
    };
   } catch (error) {
    throw await ApiError.logAndCreate(error, 400, this.fastify, {
      user_id: id || null,
      action: "Logout Failed",
      entity: "Authentication",
      details: `Logout failed for user ${id || "unknown"}. Error: ${ApiError.getMessage(error)}`,
      status_message:`Error: ${ApiError.getMessage(error)}`
    });
   }
  }
}

module.exports = AuthModel;
