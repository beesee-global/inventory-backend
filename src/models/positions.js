const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require("uuid");

class PositionsModel extends BaseModel {
  constructor(fastify) {
    super(
      fastify,
      "positions", // table name
      "id", // primary key
      []
    );
  }

  async insert(body) {
    try {
      await this.requireFields(body, [
        "name",
        "description",
        "is_protected",
      ]);

      // check if name exists
      const exists = await this.checkIfExists({ name: body.name }, "positions");

      if (exists?.is_deleted === 0) {
        throw new ApiError("Position name already exists", 400);
      }

      const { permissions,  user_id: actorUserId, ...position } = body;

      const positionData = {
        ...position,
        pid: uuidv4(),
        created_at: new Date(),
      };

      const positionResult = await this.create(positionData, "positions");

      // loop permissions
      for (const permission of permissions) {
        const permissionData = {
          position_id: positionResult.insertId,
          parent_id: permission.parent_id,
          children_id: permission.children_id,
          module_name: permission.module_name,
          module_url: permission.module_url,
          created_at: new Date(),
        };

        const positionsPermission = await this.create(
          permissionData,
          "positions_permissions"
        );

        // loop actions
        for (const action of permission.actions) {
          await this.create(
            {
              position_permission_id: positionsPermission.insertId,
              action,
              created_at: new Date(),
            },
            "positions_permission_actions"
          );
        }
      }

      const logs = {
        created_at: new Date(),
        user_id: actorUserId,
        action: "Create",
        entity: "Position",
        details: `Position created: ${position.name}.`,
        status_message: "Position created successfully."
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs);

      return {
       data: {
        success: true,
        message: "Position created successfully.",
       }
      };
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: body?.user_id || null,
        action: "Create Position Failed",
        entity: "Position",
        details: "Failed to create position.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

async getAll() {
  try {
    const sql = `
       SELECT 
          p.*,
          pp.id AS permission_id,
          pp.parent_id,
          pp.children_id,
          pp.module_name,
          pp.module_url,
          ppa.action
      FROM positions p
      LEFT JOIN positions_permissions pp 
      ON pp.position_id = p.id
      LEFT JOIN positions_permission_actions ppa
      ON ppa.position_permission_id = pp.id
      WHERE p.is_protected = 0
      AND p.is_deleted = 0
      ORDER BY p.created_at DESC; 
    `;

    const rows = await this.mysql("query", null, sql, []);

    // format result
    const positionsMap = {};

    for (const row of rows) {
      if (!positionsMap[row.id]) {
        positionsMap[row.id] = {
          id: row.id,
          pid: row.pid,
          name: row.name,
          description: row.description,
          is_protected: row.is_protected,
          created_at: row.created_at,
          permissions: []
        };
      }

      if (row.permission_id) {
        let permission = positionsMap[row.id].permissions.find(
          p => p.id === row.permission_id
        );

        if (!permission) {
          permission = {
            id: row.permission_id,
            parent_id: row.parent_id,
            children_id: row.children_id,
            module_name: row.module_name,
            module_url: row.module_url,
            actions: []
          };
          positionsMap[row.id].permissions.push(permission);
        }

        if (row.action) {
          permission.actions.push(row.action);
        }
      }
    }

    return {
      data: {
        success: true,
        message: "Retrieved successfully",
        data: Object.values(positionsMap)
      }
    };
  } catch (error) {
    throw await ApiError.logAndCreate(error, 400, this.fastify, {
      user_id: null,
      action: "Get Positions Failed",
      entity: "Position",
      details: "Failed to retrieve positions.",
      status_message: `Error: ${ApiError.getMessage(error)}`
    });
  }
}


async getByPid(pid) {
  try {
    const sql = `
      SELECT 
        p.*,
        pp.id AS permission_id,
        pp.parent_id,
        pp.children_id,
        pp.module_name,
        pp.module_url,
        ppa.action
      FROM positions p
      LEFT JOIN positions_permissions pp 
        ON pp.position_id = p.id
      LEFT JOIN positions_permission_actions ppa
        ON ppa.position_permission_id = pp.id
      WHERE p.pid = ?
      AND p.is_deleted = 0
    `;

    const rows = await this.mysql("query", null, sql, [pid]);

    if (!rows.length) {
      return {
        data: {
          success: false,
          message: "Position not found",
          data: null
        }
      };
    }

    const position = {
      id: rows[0].id,
      pid: rows[0].pid,
      name: rows[0].name,
      description: rows[0].description,
      is_protected: rows[0].is_protected,
      created_at: rows[0].created_at,
      permissions: []
    };

    for (const row of rows) {
      if (row.permission_id) {
        let permission = position.permissions.find(
          p => p.id === row.permission_id
        );

        if (!permission) {
          permission = {
            id: row.permission_id,
            parent_id: row.parent_id,
            children_id: row.children_id,
            module_name: row.module_name,
            module_url: row.module_url,
            actions: []
          };
          position.permissions.push(permission);
        }

        if (row.action) {
          permission.actions.push(row.action);
        }
      }
    }

    return {
      data: {
        success: true,
        message: "Retrieved successfully",
        data: position
      }
    };
  } catch (error) {
    throw await ApiError.logAndCreate(error, 400, this.fastify, {
      user_id: null,
      action: "Get Position Failed",
      entity: "Position",
      details: "Failed to retrieve position.",
      status_message: `Error: ${ApiError.getMessage(error)}`
    });
  }
}

  async updateByPid(pid, body) {
    try {
      await this.requireFields(body, [
        "name",
        "description",
        "is_protected",
      ]);


      const { permissions, user_id: actorUserId, ...position } = body;

      // 1️⃣ get real ID first
      const [existing] = await this.mysql(
        "query",
        null,
        "SELECT id FROM positions WHERE id = ?",
        [pid]
      );

      if (!existing) {
        throw new ApiError("Position not found", 404);
      }

      const positionId = existing.id;

      // 2️⃣ update position
      await this.mysql(
        "query",
        null,
        `
          UPDATE positions
          SET name = ?, description = ?, is_protected = ?, updated_at = ?
          WHERE id = ?
          `,
        [
          position.name,
          position.description,
          position.is_protected,
          new Date(),
          positionId,
        ]
      );

      // 3️⃣ delete old permissions
      const oldPermissions = await this.mysql(
        "query",
        null,
        "SELECT id FROM positions_permissions WHERE position_id = ?",
        [positionId]
      );

      for (const perm of oldPermissions) {
        await this.mysql(
          "query",
          null,
          "DELETE FROM positions_permission_actions WHERE position_permission_id = ?",
          [perm.id]
        );
      }

      await this.mysql(
        "query",
        null,
        "DELETE FROM positions_permissions WHERE position_id = ?",
        [positionId]
      );

      // 4️⃣ insert new permissions
      for (const permission of permissions) {
        const permResult = await this.create(
          {
            position_id: positionId,
            parent_id: permission.parent_id,
            children_id: permission.children_id,
            module_name: permission.module_name,
            module_url: permission.module_url,
            created_at: new Date(),
          },
          "positions_permissions"
        );

        for (const action of permission.actions) {
          await this.create(
            {
              position_permission_id: permResult.insertId,
              action,
              created_at: new Date(),
            },
            "positions_permission_actions"
          );
        }
      }

      const logs = {
        created_at: new Date(),
        user_id: actorUserId,
        action: "Update",
        entity: "Position",
        details: `Position updated: ${position.name}.`,
        status_message: "Position updated successfully."
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs);

      return {
        data: {
          success: true,
          message: "Position updated successfully",
        },
      };
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: body?.user_id || null,
        action: "Update Position Failed",
        entity: "Position",
        details: "Failed to update position.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  async delete(parts) {
    let auditUserId = null;
    try {
      const response = await this.processFile(parts);
      const { props = {} } = response; 
      auditUserId = props.user_id || null;

      // Accept ids as array, JSON string (e.g. "[1,2]"), CSV string ("1,2"), or single value.
      let ids = props.ids;
      if (typeof ids === "string") {
          const trimmed = ids.trim();
          if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
              try {
                  ids = JSON.parse(trimmed);
              } catch (_error) {
                  ids = [];
              }
          } else if (trimmed.includes(",")) {
              ids = trimmed.split(",").map((id) => id.trim()).filter(Boolean);
          } else if (trimmed.length > 0) {
              ids = [trimmed];
          }
      }

      if (!Array.isArray(ids)) {
          ids = [];
      }

      ids = ids
          .map((id) => Number(id))
          .filter((id) => Number.isInteger(id) && id > 0);

      if (ids.length === 0) {
          throw new ApiError("No IDs provided for deletion.", 400);
      } 

      // Prepare SQL query to fetch user details for the given positions
      const placeholders = ids.map(() => "?").join(","); // "?, ?, ?"
      const sqlUserDetails = `
        SELECT users_id
        FROM users_details
        WHERE positions_id IN (${placeholders})
      `;
      
      // Execute the query to get users' IDs for the provided positions
      const usersDetails = await this.mysql("query", null, sqlUserDetails, ids);

      // If linked users exist, block deletion only when at least one linked user is still active.
      if (usersDetails.length > 0) {
        const userIds = [...new Set(usersDetails.map((userDetail) => userDetail.users_id))];
        const sqlUserInfo = `
          SELECT id, is_deleted
          FROM users
          WHERE id IN (${userIds.map(() => "?").join(",")})
        `;
        const users = await this.mysql("query", null, sqlUserInfo, userIds);

        for (const user of users) {
          if (user.is_deleted === 0) {
            throw new ApiError("Cannot delete position because it is assigned to an active user.", 400);
          }
        }
      }

      // Proceed with deleting the positions if all checks pass
      const deletePositionsSql = `
        UPDATE positions SET is_deleted = 1
        WHERE id IN (${placeholders})
      `;
      await this.mysql("query", null, deletePositionsSql, ids); 
  
      const logs = {
        created_at: new Date(),
        user_id: props.user_id, // extra
        action: "Delete",
        entity: "Position",
        details: "Position records deleted.",
        status_message: "Position(s) deleted successfully."
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs); 

      return {
        data: {
          success: true,
          message: "Successfully deleted positions.",
        },
      };

    } catch (error) {
       throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: auditUserId,
        action: "Delete Position Failed",
        entity: "Position",
        details: "Failed to delete position.",
        status_message: `Error: ${ApiError.getMessage(error)}`
       });
    }
  }
}

module.exports = PositionsModel;
