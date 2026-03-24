const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");

class EcomAuthModel extends BaseModel {
    constructor (fastify) {
        super(fastify, "users", "id", []);
    }

    async getByLogin(body) {
        try {
            // validate required fields
            await this.requireFields(body,
                [
                    "email", 
                    "password"
                ]
            );

            const { email, password } = body;

            if (!email || !password) {
                throw new ApiError("Email and password are required", 400);
            }

            // check if user exists
            const exists = await this.checkIfExists({ email }, "users", null, "ecommerce-db");
            if (!exists) throw new ApiError("Invalid username or password", 400);

            const user = await this.findOne({ email }, null, "ecommerce-db");

            // verify password
            const validPassword = await this.fastify.bcrypt.compare(
                password,
                user.password
            );

            if (!validPassword) throw new ApiError("Invalid username or password", 400);

            // query user details + position + permissions + actions
            const sql = `
               SELECT
                    u.id, 
                    u.first_name,
                    u.last_name,
                    u.email, 
                    ud.employment_status,
                    ud.url_permission,
                    ui.image_url AS profile_image
                FROM users u
                LEFT JOIN users_details ud ON u.id = ud.users_id
                LEFT JOIN users_images ui ON u.id = ui.users_id
                WHERE u.email = ?
                `;

                const rows = await this.mysql("query", null, sql, [email], "ecommerce-db")
                const userDetails = rows[0];

                // generate JWT token
                const token = this.fastify.jwt.sign({
                    id: userDetails.id,
                    full_name: `${userDetails.first_name} ${userDetails.last_name}`,
                    email: userDetails.email,
                    employment_status: userDetails.employment_status,
                    url_permission: userDetails.url_permission
                });

                return {
                    data: {
                        success: true,
                        token,
                        userInfo:{
                            id:  userDetails.id,
                            full_name: `${userDetails.first_name} ${userDetails.last_name}`,
                            email: userDetails.email,
                            image: userDetails.profile_image,
                            employment_status: userDetails.employment_status,
                            url_permission: userDetails.url_permission
                        }
                    }
                }
        } catch (error) {
            throw new ApiError(error.message, error.status)
        }
    }
}

module.exports = EcomAuthModel;