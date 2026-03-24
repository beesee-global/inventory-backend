const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require("uuid");

class UserUserInfoModel extends BaseModel {
    constructor (fastify) {
        super(
            fastify,
            "users",
            "id",
            []
        );
    } 

    async insert (body) {
        try {
            await this.requireFields(body, [
                "first_name",
                "last_name",
                "middle_name",
                "last_name",
                "email",
                "password", 
                "nick_name",
                "contact_number",
                "region",
                "province" ,
                "city",
                "barangay",
                "street",
                "house_no",
                "sex",
                "marital_status",
                "citizen_ship",
                "religion",
                "place_of_birth",
                "birth_day",
                "age",
                'height',
                "weight",
            ])

            body.pid = uuidv4();
            body.created_at = new Date()
            await super.create(
                body,
                "users",
                null,
                "users-db"
            );

            return {
                success: true,
                message: "Created Successfully"
            };

        } catch (error) {
            throw new ApiError(error, 400)
        }
    }
}

module.exports = UserUserInfoModel