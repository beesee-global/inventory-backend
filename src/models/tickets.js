const BaseModel = require("../base.js");
const ApiError = require("../apiError.js")
const { v4: uuidv4 } = require('uuid') 
const { sendEmailWithTemplate } = require('../helper/postmarkClient.js'); 
const fs = require('fs').promises;

class TicketsModel extends BaseModel {
  constructor(fastify) {
    super(
      fastify,
      "tickets", //table name
      "id", //primary key
      []
    );
  }

  //insert query
  async insert(body) {
    try {
        await this.requireFields(body, [
      "full_name",
      "company",
      "city",
      "email", 
      "phone",
    ]); //check required fields

    await this.requireFields(body.tickets_details, [ 
      "questions"
    ]);

    const { tickets_details, ...customersFields } = body
    
    // prepare customer data
    const customerData = {
      ...customersFields,
      pid: uuidv4(),
      created_at: new Date()
    }

    // insert customer
    const customerResult = await this.create(customerData, "customers")

    // Generate 5-character alphanumeric ID (no dashes)
    const ticketId = `TK-${Math.floor(10000 + Math.random() * 90000)}`;

    const ticketsDetails = {
      ...tickets_details,
      issues_id: tickets_details.issues_id || null,
      products_id: tickets_details.products_id || null,
      categories_id: tickets_details.categories_id || null,
      reference_number: ticketId,
      is_read: false,
      customers_id: customerResult.insertId,
      created_at: new Date()
    }
      
    const ticketResult = await this.create(ticketsDetails, "tickets")

    // Fetch all technicians email and employment status is active
    const technicians = await this.mysql(
      "query",
      null,
      `
      SELECT ud.*, u.first_name, u.last_name, u.email
      FROM users_details ud
      INNER JOIN users u ON u.id = ud.users_id
      WHERE ud.positions_id = 4
        AND ud.employment_status = 'active'
      `
    );

    // Send email notification to all technicians
    for (const tech of technicians) {
      try {
        // Prepare Postmark template
        const templateModel = {
          name: `${tech.first_name} ${tech.last_name}`,
          current_year: new Date().getFullYear(),
        };

        // Send email with Postmark
        await sendEmailWithTemplate({
          to: tech.email,
          templateModel,
          templateId: 43014413,
          replyTo: "no-reply@beesee.ph",
          // attachments,
        });
      } catch (err) {
        if (this.fastify && this.fastify.log && this.fastify.log.error) {
          this.fastify.log.error(`Failed to send email to technician ${tech.email}:`, err);
        }
      }
    }

    // Send email to customer
    try {
      const templateModel = {
        name: body.full_name,
       /*  action_url: `${process.env.VITE_API_URL_FRONTEND}/c/conversation/${customerData.pid}`, */
        ticket_id: `${ticketId}`,
        current_year: new Date().getFullYear(),
      };

      await sendEmailWithTemplate({
        to: body.email,
        templateModel,
        templateId: 42942107,
        replyTo: "no-reply@beesee.ph", 
        // attachments
      });
    } catch (err) {
      if (this.fastify && this.fastify.log && this.fastify.log.error) {
        this.fastify.log.error(`Failed to send email to customer ${body.email}:`, err);
      }
    }

    // Send email to support
    try {
      const templateModel = {
        name: "Support Team", 
        current_year: new Date().getFullYear(),
      };

      await sendEmailWithTemplate({
        to: "support@beesee.ph",
        templateModel,
        templateId: 43014413,
        replyTo: "no-reply@beesee.ph", 
        // attachments
      });
    } catch (err) {
      if (this.fastify && this.fastify.log && this.fastify.log.error) {
        this.fastify.log.error(err, err);
      }
    }
 
    if (this.fastify.io) {
      this.fastify.io.emit("ticket-updated", {
        message: "New ticket created",
        inquiries_id: ticketResult.insertId,
      })
    }

    // inserting
    const  tickets_conversations = {
      tickets_id: ticketId,
      user_role: "Customer",
      sender_email: body.email,
      sender_name: body.full_name,
      message_body: ticketsDetails.questions,
      is_inbound: true,
      created_at: new Date()
    }

    await this.create(tickets_conversations, "tickets_conversations");

    return {
      data: {
        success: true, 
        data: {
          ticket_id: ticketResult.insertId
        }
      }
    }
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: null,
        action: "Create Ticket Failed",
        entity: "Ticket",
        details: "Failed to create a new ticket.",
        status_message: `Error: ${ApiError.getMessage(error)}` 
      });
    }
  } 

  // display all tickets
  async getAll(status) {
   try {
     const statuses = status
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const includesClosed = statuses.includes("closed");
    const nonClosedStatuses = statuses.filter((s) => s !== "closed");

    let whereClause = "";
    let values = [];

    if (!includesClosed && nonClosedStatuses.length === 0) {
      whereClause = "1 = 0";
    }

    else if (includesClosed) {
      whereClause = `t.is_closed = 1`;
    } else {
      const placeholders = nonClosedStatuses.map(() => "?").join(",");
      whereClause = `t.status IN (${placeholders}) AND t.is_closed = 0`;
      values = nonClosedStatuses;
    }

    const sql = `
      SELECT 
        t.id AS ticket_id,
        c.pid,
        t.reference_number,
        t.questions,
        t.is_read,
        t.status, 
        t.is_closed,
        c.full_name,
        c.email,
        c.phone,
        c.company,  
        c.city,
        c.location,
        COALESCE(p.name, t.item_name) AS issue_type,
        COALESCE(cd.name, 'N/A') AS device_type,
        COALESCE(i.name, 'N/A') AS issue_name, 
        CASE
          WHEN t.is_closed = 1 THEN t.updated_at
          WHEN t.status IN ('open', 'ongoing') THEN t.created_at
          WHEN t.status = 'resolved' THEN t.updated_at
          ELSE t.updated_at
        END AS status_date
      FROM tickets t
      JOIN customers c ON c.id = t.customers_id
      LEFT JOIN products p ON t.products_id = p.id
      LEFT JOIN issues i ON t.issues_id = i.id
      LEFT JOIN categories cd ON t.categories_id = cd.id  
      WHERE ${whereClause}
      AND t.is_deleted = 0
      ORDER BY COALESCE(status_date, t.date_closed) DESC 
    `;

    const result = await this.mysql("query", null, sql, values);

    return {
      data: {
        success: true,
        message: "Successfully retrieved tickets",
        data: result
      }
    };
   } catch (error) {
    throw await ApiError.logAndCreate(error, 400, this.fastify, {
      user_id: null,
      action: "Get Tickets Failed",
      entity: "Ticket",
      details: "Failed to retrieve tickets.",
      status_message: `Error: ${ApiError.getMessage(error)}`
    });
   }
  }

  async deleteMessageId(id) {
    try {
      let sql = `
        DELETE FROM tickets_conversations
        WHERE id = ?
      `

      let value = [id]

      await this.mysql("query", null, sql, value);

      return {
        data: {
          success: true,
          message: "Delete"
        }
      }
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: null,
        action: "Delete Ticket Message Failed",
        entity: "Ticket Conversation",
        details: "Failed to delete a ticket message.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  //get row by id
  async getByPid(pid, connection = null) {
    try {
      let sql = `
        SELECT 
          t.id,
          t.reference_number AS ticket_id,
          c.city,
          c.pid,
          t.questions,
          t.status, 
          t.remarks,
          t.serial_number,
          t.customers_id,
          t.created_at, 
          t.updated_at,
          t.is_closed,
          c.full_name,
          c.email,
          c.phone, 
          c.company,  
          c.location,
          tjo.attachment_url AS job_order_url,
          tjof.attachment_url AS job_order_url_finish,
          t.categories_id AS device_type,
          t.products_id AS issue_type,
          t.issues_id AS issue_id,
          t.item_name,
          i.name AS issue_name,
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', ti.id,
                'image', ti.image_url
              )
            )
            FROM tickets_images ti
            WHERE ti.tickets_id = t.id
          ) AS images,
          (
            SELECT COALESCE(
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', tad.id,
                  'ticket_id', tad.ref_id,
                  'status', tad.status,
                  'image_url', tad.attachment_url
                )
              ),
              JSON_ARRAY()
            )
            FROM tickets_attachment_detailed tad
            WHERE tad.ref_id = t.reference_number
            AND tad.status = 'before'
          ) AS before_image,
          (
            SELECT COALESCE(
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', tad.id,
                  'ticket_id', tad.ref_id,
                  'status', tad.status,
                  'image_url', tad.attachment_url
                )
              ),
              JSON_ARRAY()
            )
            FROM tickets_attachment_detailed tad
            WHERE tad.ref_id = t.reference_number
            AND tad.status = 'after' 
          ) as after_image
        FROM tickets t
        JOIN customers c ON c.id = t.customers_id
        LEFT JOIN products p ON t.products_id = p.id
        LEFT JOIN issues i on t.issues_id = i.id 
        LEFT JOIN categories cd ON t.categories_id = cd.id 
        LEFT JOIN tickets_job_orders tjo ON t.id = tjo.tickets_id
        LEFT JOIN tickets_job_order_finish tjof ON t.id = tjof.tickets_id
        WHERE c.pid = ?
        AND t.is_deleted = 0
      `;
    const values = [pid];
    const result = await this.mysql("query", connection, sql, values);

    const customer = result[0];

    // update will be read
    if (customer) {
      let sql = `
        update tickets
        SET is_read = true
        WHERE reference_number = ?
      `

      const value = [customer.ticket_id]

      await this.mysql("query", connection, sql, value);
    }
    return {
      data: {
        success: true,
        message: "Successfully retrieved ticket",
        data: result[0]
      }
    }
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: null,
        action: "Get Ticket By PID Failed",
        entity: "Ticket",
        details: "Failed to retrieve ticket by PID.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

    //get row by id
  async getByPidPublic(pid, connection = null) {  
    try {
          let sql = `
      SELECT 
        t.id,
        t.status,
        t.reference_number AS ticket_id, 
        t.questions,  
        t.serial_number,
        t.created_at,  
        t.updated_at,
        t.is_closed,
        COALESCE(p.name, t.item_name) AS issue_type,
        cd.name AS device_type,
        c.full_name,
        c.email,
        c.location,
        i.name AS issue_name,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', ti.id,
              'image', ti.image_url
            )
          )
          FROM tickets_images ti
          WHERE ti.tickets_id = t.id
        ) AS images,
        (
          SELECT COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', tad.id,
                'ticket_id', tad.ref_id,
                'status', tad.status,
                'image_url', tad.attachment_url
              )
            ),
            JSON_ARRAY()
          )
          FROM tickets_attachment_detailed tad
          WHERE tad.ref_id = t.reference_number
          AND tad.status = 'before'
        ) AS before_image,
        (
          SELECT COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', tad.id,
                'ticket_id', tad.ref_id,
                'status', tad.status,
                'image_url', tad.attachment_url
              )
            ),
            JSON_ARRAY()
          )
        FROM tickets_attachment_detailed tad
          WHERE tad.ref_id = t.reference_number
          AND tad.status = 'after' 
        ) as after_image
      FROM tickets t
      JOIN customers c ON c.id = t.customers_id
      LEFT JOIN products p ON t.products_id = p.id
      LEFT JOIN issues i on t.issues_id = i.id 
      LEFT JOIN categories cd ON t.categories_id = cd.id 
      WHERE c.pid = ?
      AND t.is_deleted = 0
    `;
    const values = [pid];
    const result = await this.mysql("query", connection, sql, values);
    const customer = result[0];

    if (!customer) {
      throw new ApiError ("Ticket does not exist or has been removed", 404)
    }

    /* if (customer && customer.status === 'expired') {
      throw new ApiError ("Your link is now expired. Please submit another ticket.", 403)
    }  */
 
    return {
      data: {
        success: true,
        message: "Successfully retrieved ticket",
        data: result[0]
      }
    }
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: null,
        action: "Get Ticket By PID Public Failed",
        entity: "Ticket",
        details: "Failed to retrieve ticket by PID for public.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  //update row by id
  // async updateById(body) {
  //   if (!body) throw new ApiError("body missing in request", 400); //check if data is empty
  //   await this.requireFields(body, [
  //     "type",
  //     "company",
  //     "first_name",
  //     "last_name",
  //     "category",
  //     "device",
  //     "email",
  //     "concern",
  //   ]); //check required fields
  //   const result = await this.update(body);
  //   return result;
  // }

  //image uploading
  async images(id, fileParts) {
    try {
      const response = await this.processFile(fileParts);
      const { files, props } = response;

      if (files.length > 0) {
        for(const file of files) {
          file.filename = `tickets/${file.filename}`;
          const imageUrl = await this.uploadToR2(file);
          
          await this.create(
            {
                tickets_id: id,
                image_url: imageUrl,
                created_at: new Date()
            },
            "tickets_images"
          )
        }
        return {
            data: {
              status: 201,
              message: "Tickets created successfully."
            }
        }
      }
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: null,
        action: "Upload Ticket Image Failed",
        entity: "Ticket",
        details: `Failed to upload ticket image for ticket ID ${id}.`,
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }

    // const exists = await this.checkIfExists({id: props.id}, "ticket_images"); //check record if exists using id
    // //delete all records if it exists
    // initial approach would be deleting existing images then upload the new images.
    // if (exists) {
    // 	const sql = `DELETE FROM ticket_images WHERE ticket_id = ?`;
    // 	const values = [props.id];
    // 	return await this.mysql("execute", connection, sql, values);
    // }

    /* for (const image of imageData) {
      await this.create(image, "ticket_images");
    } */
  }

  async delete (parts) {
    let auditUserId = null;
    try { 

      const response = await this.processFile(parts);
      const { files = [] , props = {} } = response;
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
 
      const logs = {
        created_at: new Date(),
        user_id: props.user_id, // extra
        action: "Delete",
        entity: "Ticket",
        details: "Ticket records deleted.",
        status_message: `Deleted ticket Successfully`
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs);

      // Prepare SQL query
      const placeholders = ids.map(() => '?').join(','); // "?, ?, ?"
      const sql = `
        UPDATE tickets 
        SET is_deleted = 1
        WHERE id IN (${placeholders})
      `;
      await this.mysql("query", null, sql, ids);

      return {
        data: {
          success: true,
          message: "Successfully deleted."
        }
      };
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: auditUserId,
        action: "Delete Ticket Failed",
        entity: "Ticket",
        details: "Failed to delete ticket records.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  async getAllCompany() {
    // Fetch all companies
    let sql = `
      SELECT company
      FROM customers
    `;
    const values = [];
    const result = await this.mysql("query", null, sql, values);

    // Remove duplicates (case-insensitive & trimmed)
    const seen = new Set();
    const uniqueCompanies = result.filter((item) => {
      const normalized = item.company.trim().toLowerCase();
      if (seen.has(normalized)) {
        return false;
      } else {
        seen.add(normalized);
        return true;
      }
    });

    return {
      data: {
        success: true,
        data: uniqueCompanies
      }
    };
  }

  /*=======================================TICKET MESSAGES================================================================== */
  // Insert message in ticket and send email using Postmark template back office
  // Back office
  async insertTicketMessage(parts) {
    let auditUserId = null;
    let ticketRef = null;
    let senderEmail = null;
    try {
      const response = await this.processFile(parts);
    const { files = [], props } = response; 
    auditUserId = props.user_id || null;
    ticketRef = props.tickets_id || null;
    senderEmail = props.sender_email || null;

    const conversationBackOffice = {
      sender_email: props.sender_email,
      sender_name: props.sender_name,
      tickets_id: props.tickets_id,
      user_role: props.user_role,
      message_body: props.message_body,
      is_inbound: props.is_inbound, 
      user_role: props.user_role, 
      created_at: new Date() // Set timestamp
    }
      
    // Find ticket by reference_number
    const ticket = await this.findOne({ reference_number: props.tickets_id });
    if (!ticket) {
      throw new ApiError("Ticket not found", 400);
    }

    // Query customers table directly
    let customerSql = `
      SELECT
        *
      FROM customers
      WHERE id = ?
    `;
    const customerResult = await this.mysql("query", null, customerSql, [ticket.customers_id]);
    const customer = customerResult[0];
    
    if (!customer) {
      throw new ApiError('Customer not found', 400)
    }

    let conversationSql = `SELECT * FROM tickets_conversations WHERE tickets_id = ?`
    const conversationResult = await this.mysql("query", null, conversationSql, [ticket.reference_number]);
    const conversation = conversationResult[0]; 
    
    // Prepare the template model for Postmark
    const templateModel = {
      name: customer.full_name || "Customer",
      action_url: `${process.env.VITE_API_URL_FRONTEND}/c/conversation/${customer.pid}`, 
      url_ticket: `${process.env.VITE_API_URL_FRONTEND}/customer-support`,
      sender_name: process.env.POSTMARK_FROM_NAME || "BEESEE Support",
      current_year: new Date().getFullYear()
    };

    const templateId = conversation ? 42487052 : 42486908
    // Send email via Postmark template
    try {
      await sendEmailWithTemplate({
        to: props.sender_email,
        templateId,  
        templateModel,
        replyTo: "no-reply@beesee.ph"
      });
    } catch (error) {
      throw new ApiError(`Failed to send email: ${error.message}`, 500);
    }

    // Update ticket status
    await this.update({
      id: ticket.id, 
      updated_at: new Date()
    }, "tickets"); 

    // Save message in tickets_conversations
    const result = await this.create(conversationBackOffice, "tickets_conversations");
    const ticket_id_conversation =  result.insertId
    
    if (files.length > 0) {
     await this.insertTicketAttachment(files, ticket_id_conversation)
    }

    // Emit event to all connected clients
    if (this.fastify.io) {
      this.fastify.io.emit("new_ticket_message", {
        ticket_id: props.tickets_id,
        sender_name: props.sender_name,
        user_role: props.user_role,
        message_body: props.message_body,
        is_inbound: props.is_inbound,
        created_at: conversationBackOffice.created_at
      });

      this.fastify.io.emit ("ticket-updated", {
        ticket_id: props.tickets_id, 
      })
    }

    let sql = `
      UPDATE tickets
        SET status = "ongoing", 
        updated_at = NOW(), is_read = false
      WHERE reference_number = ?
    `
    const value = [props.tickets_id];

    await this.mysql("execute", null, sql, value);

    const logs = {
      created_at: new Date(),
      user_id: props.user_id, // extra
      action: "Reply",
      entity: "Ticket",
      details: "Replied to a ticket.",
      status_message: "Successfully replied to a ticket."
    }

    // Insert audit log
    const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
    await auditLogsModel.insert(logs);

    return {
      data: {
        success: true,
        data: {
          ticket_ids: result.insertId, 
        }
      }
    };
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: auditUserId,
        action: "Reply Ticket Failed",
        entity: "Ticket",
        details: "Failed to reply to a ticket.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  // user
  async replyMessage(parts) {
    let ticketRef = null;
    try { 
      const response = await this.processFile(parts);
      const { files = [], props } = response; 
      ticketRef = props.tickets_id || null;

      const conversationUser = {
        sender_email: props.sender_email,
        sender_name: props.sender_name,
        tickets_id: props.tickets_id,
        message_body: props.message_body,
        is_inbound: props.is_inbound, 
        user_role: props.user_role, 
        created_at: new Date() // Set timestamp
      } 

      const result = await this.create(conversationUser, "tickets_conversations");
      const ticket_id_conversation = result.insertId

      if (files.length > 0) {
        await this.insertTicketAttachment(files, ticket_id_conversation)
      }

      if (this.fastify.io) {
        this.fastify.io
          .to(`ticket_${props.tickets_id}`)
          .emit("new_ticket_message", {
            ticket_id: props.tickets_id,
            sender_name: props.sender_name,
            message_body: props.message_body,
            is_inbound: props.is_inbound,
            user_role: props.user_role, 
            created_at: conversationUser.created_at
          });

        this.fastify.io
          // .to(`ticket_${props.tickets_id}`)
          .emit("ticket-updated", {
            ticket_id: props.tickets_id,
          });
      }

      let sql = `
        UPDATE tickets
          SET status = "ongoing", 
          updated_at = NOW(), is_read = false
        WHERE reference_number = ?
      `
      const value = [props.tickets_id];

      await this.mysql("execute", null, sql, value);

      const logs = {
        created_at: new Date(),
        user_id: null, // extra
        action: "Reply",
        entity: "Ticket",
        details: "Replied to a ticket.",
        status_message: "Successfully replied to a ticket."
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs);

      return {
        data: {
          success: true,
          data: {
            ticket_ids: props.tickets_id,   
          }
        }
      }
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: null,
        action: "Customer Reply Failed",
        entity: "Ticket",
        details: 'Failed to reply to a ticket by customer.',
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  // async insertTicketInbound(body) {
  //   await this.requireFields(body, [
  //     "sender_email",  
  //     "tickets_id",
  //     "message_body",
  //     "is_inbound"
  //   ]); //check required fields

  //   const ticket = await this.findOne({ reference_number: body.tickets_id} );
  //   if (!ticket) {
  //     throw new ApiError("Reference number not found", 400)
  //   }

  //   // Query customers table directly
  //   let customerSql = `SELECT * FROM customers WHERE id = ?`;
  //   const customerResult = await this.mysql("query", null, customerSql, [ticket.customers_id]);
  //   const customer = customerResult[0];
    
  //   if (!customer) {
  //     throw new ApiError("customer id not found", 400)
  //   }
  //   // Extract sender name from customer full_name
  //   body.sender_name = customer.full_name;
  //     // Clean the message body
  //   body.message_body = cleanInboundMessage(body.message_body);
    
  //   body.created_at = new Date(); //set created timestamp
    
  //   await this.create(body, "tickets_conversations");

  //   // Update ticket status to 'open' when inbound message is received
  //   let sql = `
  //     UPDATE tickets
  //     SET status = ?
  //     WHERE reference_number = ?
  //   `
  //   const values = [body.is_inbound ? "open" : "resolved", body.tickets_id]

  //   await this.mysql("execute", null, sql, values);

  //   return {
  //     data: {
  //       success: true, 
  //     }
  //   };
  // }

  async insertTicketAttachment(files, ticket_id_conversation) {
    try {  
      if (files.length > 0) {
        for (const file of files) {
          file.filename = `ticket_attachment/${file.filename}`;
          const imageUrl = await this.uploadToR2(file)

          const payload = {
            ticket_conversation_id: ticket_id_conversation,
            attachment_url: imageUrl,
            file_name: file.original_name,
            file_size: file.file_size,
            file_type: file.mimetype,
            created_at: new Date(),
          }

          await this.create(
            payload,
            "tickets_conversation_attachment"
          )
        }

        return 
      }
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: null,
        action: "Upload Ticket Attachment Failed",
        entity: "Ticket Attachment",
        details: "Failed to upload ticket attachment.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  //get messages using ticket id
  async getMessagesByTicketId(id, connection = null) {
    if (!id) throw new ApiError(`id missing in request`, 400);

    const sql = `
      SELECT 
        tc.id,
        tc.tickets_id,
        tc.sender_email,
        tc.sender_name,
        tc.message_body,
        tc.is_inbound,
        tc.user_role AS message_type, 
        tc.created_at,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', tca.id,
              'attachment_url', tca.attachment_url,
              'size', tca.file_size,
              'type', tca.file_type,
              'name', tca.file_name
            )
          )
          FROM tickets_conversation_attachment tca
          WHERE tca.ticket_conversation_id = tc.id
        ) AS attachments, 
        tc.is_updated
      FROM tickets_conversations tc 
      WHERE tc.tickets_id = ?
      ORDER BY tc.created_at ASC
    `;

    const result = await this.mysql("query", connection, sql, [id]);

    const activitySql = `
      SELECT
        tal.id,
        tal.ticket_conversation_id,
        tal.user_name,
        tal.categories_id_old,
        tal.categories_id_new,
        tal.products_id_old,
        tal.products_id_new,
        tal.issues_id_old,
        tal.issues_id_new,
        tal.item_name_old,
        tal.item_name_new,
        tal.serial_number_old,
        tal.serial_number_new,
        tal.created_at,
        c_old.name AS categories_old_name,
        c_new.name AS categories_new_name,
        p_old.name AS products_old_name,
        p_new.name AS products_new_name,
        i_old.name AS issues_old_name,
        i_new.name AS issues_new_name
      FROM ticket_activity_logs tal
      INNER JOIN tickets_conversations tc ON tc.id = tal.ticket_conversation_id
      LEFT JOIN categories c_old ON c_old.id = tal.categories_id_old
      LEFT JOIN categories c_new ON c_new.id = tal.categories_id_new
      LEFT JOIN products p_old ON p_old.id = tal.products_id_old
      LEFT JOIN products p_new ON p_new.id = tal.products_id_new
      LEFT JOIN issues i_old ON i_old.id = tal.issues_id_old
      LEFT JOIN issues i_new ON i_new.id = tal.issues_id_new
      WHERE tc.tickets_id = ?
      ORDER BY tal.created_at ASC
    `;

    // Load all activity-log rows linked to this ticket reference number.
    const activityRows = await this.mysql("query", connection, activitySql, [id]);
    // Group log entries by conversation id so each conversation can include its own logs.
    const activityMap = new Map();
    // Normalize any empty/null value so comparisons and UI output are consistent.
    const normalizeValue = (value) => {
      // If missing value, show placeholder.
      if (value === null || value === undefined) return "-";
      // Convert to string and remove extra spaces.
      const text = String(value).trim();
      // If empty after trim, keep placeholder; otherwise return cleaned text.
      return text === "" ? "-" : text;
    };

    for (const row of activityRows) {
      // Resolve user display name; fallback to generic label if blank.
      const userName = normalizeValue(row.user_name) === "-" ? "User" : normalizeValue(row.user_name);

      // Raw old/new values coming directly from joined query fields.
      const rawDeviceOld = row.categories_old_name;
      const rawDeviceNew = row.categories_new_name;
      const rawModelOld = row.products_old_name || row.item_name_old;
      const rawModelNew = row.products_new_name || row.item_name_new;
      const rawIssueOld = row.issues_old_name;
      const rawIssueNew = row.issues_new_name;
      const rawSerialOld = row.serial_number_old;
      const rawSerialNew = row.serial_number_new;
      const rawItemOld = row.item_name_old;
      const rawItemNew = row.item_name_new;

      // Normalized values used for comparison and final message text.
      const deviceOld = normalizeValue(rawDeviceOld);
      const deviceNew = normalizeValue(rawDeviceNew);
      const modelOld = normalizeValue(rawModelOld);
      const modelNew = normalizeValue(rawModelNew);
      const issueOld = normalizeValue(rawIssueOld);
      const issueNew = normalizeValue(rawIssueNew);
      const serialOld = normalizeValue(rawSerialOld);
      const serialNew = normalizeValue(rawSerialNew);
      const itemOld = normalizeValue(rawItemOld);
      const itemNew = normalizeValue(rawItemNew);

      // Explicit per-field change flags for easy debugging.
      const deviceChanged = deviceOld !== deviceNew;
      const modelChanged = modelOld !== modelNew;
      const issueChanged = issueOld !== issueNew;
      const serialChanged = serialOld !== serialNew;
      const itemChanged = itemOld !== itemNew;

      // Collect only lines for fields that actually changed.
      const lines = [];

      if (deviceChanged) {
        // Human-readable message for device type changes.
        const text = `${userName} updated Device type from ${deviceOld} to ${deviceNew}`;
        lines.push(text);
      }

      if (modelChanged) {
        // Human-readable message for model changes (product name or item-name fallback).
        const text = `${userName} updated Model type from ${modelOld} to ${modelNew}`;
        lines.push(text);
      }

      if (issueChanged) {
        // Human-readable message for issue type changes.
        const text = `${userName} updated Issue type from ${issueOld} to ${issueNew}`;
        lines.push(text);
      }

      if (serialChanged) {
        // Human-readable message for serial-number changes.
        const text = `${userName} updated serial number from ${serialOld} to ${serialNew}`;
        lines.push(text);
      }

      if (itemChanged) {
        // Human-readable message for item-name changes.
        const text = `${userName} updated Item name from ${itemOld} to ${itemNew}`;
        lines.push(text);
      }

      // Skip log rows with no actual field changes.
      if (lines.length === 0) {
        continue;
      }

      // Payload returned to the client for this single activity record.
      const entry = {
        id: row.id,
        ticket_conversation_id: row.ticket_conversation_id,
        user_name: row.user_name,
        created_at: row.created_at,
        lines,
        // Parenthesized multiline format requested by UI.
        message: `(\n${lines.join("\n")}\n)`
      };

      // Initialize list for this conversation id if not present.
      if (!activityMap.has(row.ticket_conversation_id)) {
        activityMap.set(row.ticket_conversation_id, []);
      }
      // Append this activity record to its conversation group.
      activityMap.get(row.ticket_conversation_id).push(entry);
    }

    // Attach grouped activity logs to each conversation row in the response.
    for (const conversation of result) {
      conversation.activity_logs = activityMap.get(conversation.id) || [];
    }

    return {
      data: {
        success: true,
        data: result
      }
    }
  }

    //get messages using ticket id
  async getMessagesByTicketIdPublic(id, connection = null) {
    if (!id) throw new ApiError(`id missing in request`, 400);

    const sql = `
      SELECT 
        tc.id,
        tc.tickets_id,
        tc.sender_email,
        tc.sender_name,
        tc.message_body,
        tc.is_inbound,
        tc.user_role AS message_type, 
        tc.created_at,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', tca.id,
              'attachment_url', tca.attachment_url,
              'size', tca.file_size,
              'type', tca.file_type,
              'name', tca.file_name
            )
          )
          FROM tickets_conversation_attachment tca
          WHERE tca.ticket_conversation_id = tc.id
        ) AS attachments, 
        tc.is_updated
      FROM tickets_conversations tc 
      WHERE tc.tickets_id = ?
      ORDER BY tc.created_at ASC
    `;

    const result = await this.mysql("query", connection, sql, [id]);

    const activitySql = `
      SELECT
        tal.id,
        tal.ticket_conversation_id,
        tal.user_name,
        tal.categories_id_old,
        tal.categories_id_new,
        tal.products_id_old,
        tal.products_id_new,
        tal.issues_id_old,
        tal.issues_id_new,
        tal.item_name_old,
        tal.item_name_new,
        tal.serial_number_old,
        tal.serial_number_new,
        tal.created_at,
        c_old.name AS categories_old_name,
        c_new.name AS categories_new_name,
        p_old.name AS products_old_name,
        p_new.name AS products_new_name,
        i_old.name AS issues_old_name,
        i_new.name AS issues_new_name
      FROM ticket_activity_logs tal
      INNER JOIN tickets_conversations tc ON tc.id = tal.ticket_conversation_id
      LEFT JOIN categories c_old ON c_old.id = tal.categories_id_old
      LEFT JOIN categories c_new ON c_new.id = tal.categories_id_new
      LEFT JOIN products p_old ON p_old.id = tal.products_id_old
      LEFT JOIN products p_new ON p_new.id = tal.products_id_new
      LEFT JOIN issues i_old ON i_old.id = tal.issues_id_old
      LEFT JOIN issues i_new ON i_new.id = tal.issues_id_new
      WHERE tc.tickets_id = ?
      ORDER BY tal.created_at ASC
    `;

    // Load all activity-log rows linked to this ticket reference number.
    const activityRows = await this.mysql("query", connection, activitySql, [id]);
    // Group log entries by conversation id so each conversation can include its own logs.
    const activityMap = new Map();
    // Normalize any empty/null value so comparisons and UI output are consistent.
    const normalizeValue = (value) => {
      // If missing value, show placeholder.
      if (value === null || value === undefined) return "-";
      // Convert to string and remove extra spaces.
      const text = String(value).trim();
      // If empty after trim, keep placeholder; otherwise return cleaned text.
      return text === "" ? "-" : text;
    };

    for (const row of activityRows) {
      // Resolve user display name; fallback to generic label if blank.
      const userName = normalizeValue(row.user_name) === "-" ? "User" : normalizeValue(row.user_name);

      // Raw old/new values coming directly from joined query fields.
      const rawDeviceOld = row.categories_old_name;
      const rawDeviceNew = row.categories_new_name;
      const rawModelOld = row.products_old_name || row.item_name_old;
      const rawModelNew = row.products_new_name || row.item_name_new;
      const rawIssueOld = row.issues_old_name;
      const rawIssueNew = row.issues_new_name;
      const rawSerialOld = row.serial_number_old;
      const rawSerialNew = row.serial_number_new;
      const rawItemOld = row.item_name_old;
      const rawItemNew = row.item_name_new;

      // Normalized values used for comparison and final message text.
      const deviceOld = normalizeValue(rawDeviceOld);
      const deviceNew = normalizeValue(rawDeviceNew);
      const modelOld = normalizeValue(rawModelOld);
      const modelNew = normalizeValue(rawModelNew);
      const issueOld = normalizeValue(rawIssueOld);
      const issueNew = normalizeValue(rawIssueNew);
      const serialOld = normalizeValue(rawSerialOld);
      const serialNew = normalizeValue(rawSerialNew);
      const itemOld = normalizeValue(rawItemOld);
      const itemNew = normalizeValue(rawItemNew);

      // Explicit per-field change flags for easy debugging.
      const deviceChanged = deviceOld !== deviceNew;
      const modelChanged = modelOld !== modelNew;
      const issueChanged = issueOld !== issueNew;
      const serialChanged = serialOld !== serialNew;
      const itemChanged = itemOld !== itemNew;

      // Collect only lines for fields that actually changed.
      const lines = [];

      if (deviceChanged) {
        // Human-readable message for device type changes.
        const text = `Support team updated Device type from ${deviceOld} to ${deviceNew}`;
        lines.push(text);
      }

      if (modelChanged) {
        // Human-readable message for model changes (product name or item-name fallback).
        const text = `Support team updated Model type from ${modelOld} to ${modelNew}`;
        lines.push(text);
      }

      if (issueChanged) {
        // Human-readable message for issue type changes.
        const text = `Support team updated Issue type from ${issueOld} to ${issueNew}`;
        lines.push(text);
      }

      if (serialChanged) {
        // Human-readable message for serial-number changes.
        const text = `Support team updated serial number from ${serialOld} to ${serialNew}`;
        lines.push(text);
      }

      if (itemChanged) {
        // Human-readable message for item-name changes.
        const text = `Support team updated Item name from ${itemOld} to ${itemNew}`;
        lines.push(text);
      }

      // Skip log rows with no actual field changes.
      if (lines.length === 0) {
        continue;
      }

      // Payload returned to the client for this single activity record.
      const entry = {
        id: row.id,
        ticket_conversation_id: row.ticket_conversation_id,
        user_name: row.user_name,
        created_at: row.created_at,
        lines,
        // Parenthesized multiline format requested by UI.
        message: `(\n${lines.join("\n")}\n)`
      };

      // Initialize list for this conversation id if not present.
      if (!activityMap.has(row.ticket_conversation_id)) {
        activityMap.set(row.ticket_conversation_id, []);
      }
      // Append this activity record to its conversation group.
      activityMap.get(row.ticket_conversation_id).push(entry);
    }

    // Attach grouped activity logs to each conversation row in the response.
    for (const conversation of result) {
      conversation.activity_logs = activityMap.get(conversation.id) || [];
    }

    return {
      data: {
        success: true,
        data: result
      }
    }
  }

  async updateStatus (id, body) {
    try {
      await this.requireFields(body, [
        "status"
      ]);

      // Find ticket by reference_number (id parameter)
      const ticket = await this.findOne({ reference_number: id });
      if (!ticket) {
        throw new ApiError("Ticket not found", 400);
      }

      // Prepare update data with actual database id
      const updateData = {
        id: ticket.id,
        status: body.status,
        updated_at: new Date()
      };

      await this.update(updateData, "tickets");

      // update last logout
      const logs = {
        created_at: new Date(),
        user_id: body.user_id, // extra
        action: "Update",
        entity: "Ticket Status",
        details: `Ticket status updated to ${body.status}.`,
        status_message: "Successfully updated ticket status."
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs);

      return {
        data: {
          success: true,
          message: "Ticket status updated successfully.",
        }
      };
    } catch (err) {
      throw await ApiError.logAndCreate(err, 400, this.fastify, {
        user_id: body?.user_id || null,
        action: "Update Ticket Status Failed",
        entity: "Ticket Status",
        details: "Failed to update ticket status.",
        status_message: `Error: ${ApiError.getMessage(err)}`
      });
    }
  }

  async sentJobOrder (id, parts) {
    let auditUserId = null;
    try {
      const response = await this.processFile(parts);
      const { files = [], props = {} } = response; 
      auditUserId = props.user_id || null;

      // Find ticket by reference_number (id parameter)
      const ticketRows = await this.mysql(
        "query",
        null,
        `SELECT * FROM tickets WHERE reference_number = ?`,
        [id]
      );

      const existTicket = ticketRows[0] || null;
      if (!existTicket) {
        throw new ApiError("Ticket number is not existing on db", 404);
      }

      const attachments = [];
      let ticketConversationId = null;

      if (files.length > 0) {

        // save conversation
        const tickets_conversations = {
          tickets_id: id,
          user_role: props.user_role,
          sender_name: props.sender_name,
          sender_email: props.sender_email,
          message_body: null,
          is_inbound: 0,
          is_updated: 1,
          created_at: new Date()
        } 

        const result = await this.create(tickets_conversations, "tickets_conversations");
        ticketConversationId = result.insertId;

        await this.insertTicketAttachment(files, ticketConversationId)

        for (const file of files) {
          const dummyRef = Math.floor(Math.random() * 1000000)
          file.filename = `ticket/job-order/JobOrder-${existTicket.reference_number}-${dummyRef}`;
          const jobOrder = await this.uploadToR2(file);

          attachments.push({
            Name: file.original_name,
            Content: file.file.toString("base64"),
            ContentType: file.mimetype,
          });

          const existingJobAttachment = await this.mysql(
            "query",
            null,
            `SELECT * FROM tickets_job_orders WHERE tickets_id = ?`,
            [existTicket.id]
          );
          const latestJobAttachment = existingJobAttachment[0] || null;

          if (!latestJobAttachment) {
            const payload = {
              tickets_id: existTicket.id,
              attachment_url: jobOrder,
              file_name: file.original_name,
              file_size: file.file_size,
              file_type: file.mimetype,
              created_at: new Date(),
            }

            await this.create(
              payload,
              "tickets_job_orders"
            );
          } else {
            const jobOrderUpdate = {
              id: latestJobAttachment.id,
              tickets_id: existTicket.id,
              attachment_url: jobOrder,
              file_name: file.original_name,
              file_size: file.file_size,
              file_type: file.mimetype,
              updated_at: new Date()
            };

            await this.update(jobOrderUpdate, "tickets_job_orders");
          } 
        } 
      }

      const existingCustomer = await this.mysql(
        "query",
        null,
        `SELECT * FROM customers WHERE id = ? ORDER BY id DESC LIMIT 1`,
        [existTicket.customers_id]
      );

      const customer = existingCustomer[0] || null;
      if (!customer) {
        throw new ApiError("Customers not found", 404);
      }

      const templateModel = {
        name: customer.full_name,
        current_year: new Date().getFullYear(),
      };

      // sent email
      await sendEmailWithTemplate({ 
        to: customer.email,
        templateModel,
        templateId: 43536085,
        replyTo: "no-reply@beesee.ph",
        attachments,
      }); 

      // existTicket

      // logs before update ticket
      if (ticketConversationId) {
        const ticketLogs = {
          tickets_id: id,
          ticket_conversation_id: ticketConversationId,
          user_name: props.sender_name,
          products_id_old: existTicket.products_id || null,
          products_id_new: props.products_id || null,
          categories_id_old: existTicket.categories_id || null,
          categories_id_new: props.categories_id || null,
          issues_id_old: existTicket.issues_id || null,
          issues_id_new: props.issues_id || null,
          item_name_old: existTicket.item_name || null,
          item_name_new: props.item_name || null,
          serial_number_old: existTicket.serial_number || null,
          serial_number_new: props.serial_number || null,
          location_old: customer.location || null,
          location_new: props.location || null,
          created_at: new Date()
        };

        await this.create(ticketLogs, "ticket_activity_logs");
      }

      // update ticket
      const ticketUpdate = {
        id: existTicket.id,
        products_id: props.products_id || null,
        categories_id: props.categories_id || null,
        issues_id: props.issues_id || null,
        item_name: props.item_name || null,
        serial_number: props.serial_number || null, 
        updated_at: new Date()
      };

      await this.update(ticketUpdate, "tickets");

      const locationUpdate = {
        id: existTicket.customers_id,
        location: props.location || null, 
      }

      await this.update(locationUpdate, "customers");
      
      // update  
      const logs = {
        created_at: new Date(),
        user_id: props.user_id,
        action: "Send Job Order",
        entity: "Ticket",
        details: "Job order sent.",
        status_message: "Successfully sent job order."
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs);

      return {
        data: {
          success: true
        }
      }
    } catch (error) {
      throw await ApiError.logAndCreate(error, error.statusCode || 400, this.fastify, {
        user_id: auditUserId,
        action: "Send Job Order Failed",
        entity: "Ticket",
        details: "Failed to send job order.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  async uploadJobOrder(id, parts) {
    let auditUserId = null;
    try {
      const response = await this.processFile(parts);
      const { files = [] , props = {}} = response;
      auditUserId = props.user_id || null;

      const existingRows = await this.mysql(
        "query",
        null,
        `SELECT * FROM tickets_job_order_finish WHERE tickets_id = ? ORDER BY id DESC LIMIT 1`,
        [id]
      );
      const latest = existingRows[0] || null;

      for (const file of files) {
        const dummyRef = Math.floor(Math.random() * 1000000)
        file.filename = `ticket/job-order/JobOrderFinish-${props.ticket_id}-${dummyRef}`;
        const jobOrderFinish = await this.uploadToR2(file);

        if (!latest) {
          await this.create(
            {
              tickets_id: id,
              attachment_url: jobOrderFinish,
              file_name: file.original_name,
              file_size: file.file_size,
              file_type: file.mimetype,
              created_at: new Date(),
            },
            "tickets_job_order_finish"
          );
        } else {
          await this.update(
            {
              id: latest.id,
              tickets_id: id,
              attachment_url: jobOrderFinish,
              file_name: file.original_name,
              file_size: file.file_size,
              file_type: file.mimetype,
              updated_at: new Date(),
            },
            "tickets_job_order_finish"
          );
        }
      }
 
      const logs = {
        created_at: new Date(),
        user_id: props.user_id,
        action: "Upload",
        entity: "Job Order",
        details: "Final job order uploaded.",
        status_message: "Successfully uploaded final job order."
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs);

      return { data: { success: true } };
    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: auditUserId,
        action: "Upload Final Job Order Failed",
        entity: "Job Order",
        details: "Failed to upload final job order.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  async updateSerialNumber (id, parts) {
    let auditUserId = null;
    try {

      const response = await this.processFile(parts)
      const { files = [], props = {} } = response
      auditUserId = props.user_id || null;
      await this.requireFields(props, [
        "serial_number"
      ]);

      const ticket = await this.findOne({ reference_number: id });
      if (!ticket) {
        throw new ApiError("Ticket not found", 404);
      }

      await this.update(
        {
          id: ticket.id,
          serial_number: props.serial_number, 
          updated_at: new Date(),
        },
        "tickets"
      );

      await this.update(
        {
          id: ticket.customers_id,
          location: props.location || null, 
        },
        "customers"
      )

      if (files.length > 0) {
        for (const file of files) {
          const dummyRef = Math.floor(Math.random() * 1000000)
          file.filename = `ticket/job-order/JobOrder-${id}-${dummyRef}`;
          const jobOrder = await this.uploadToR2(file);

          const existingJobAttachment = await this.mysql(
            "query",
            null,
            `SELECT * FROM tickets_job_orders WHERE tickets_id = ? ORDER BY id DESC LIMIT 1`,
            [ticket.id]
          );
          const latestJobAttachment = existingJobAttachment[0] || null;

          if (latestJobAttachment) {
            const jobOrderUpdate = {
              id: latestJobAttachment.id,
              tickets_id: ticket.id,
              attachment_url: jobOrder,
              file_name: file.original_name,
              file_size: file.file_size,
              file_type: file.mimetype,
              updated_at: new Date()
            };

            await this.update(jobOrderUpdate, "tickets_job_orders");
          } else {
            await this.create(
              {
                tickets_id: ticket.id,
                attachment_url: jobOrder,
                file_name: file.original_name,
                file_size: file.file_size,
                file_type: file.mimetype,
                created_at: new Date(),
              },
              "tickets_job_orders"
            );
          }
        }
      }

       // update last logout
      const logs = {
        created_at: new Date(),
        user_id: props.user_id,
        action: "Update",
        entity: "Ticket",
        details: "Serial number updated.",
        status_message: "Successfully updated serial number."
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs);

      return {
        data: {
          success: true,
          message: "Serial number updated successfully.",
        }
      };
    } catch (error) {
      throw await ApiError.logAndCreate(error, error.statusCode || 400, this.fastify, {
        user_id: auditUserId,
        action: "Update Serial Number Failed",
        entity: "Ticket",
        details: "Failed to update serial number.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  async getAllTicketByJobNo ( ) {
    try {
      let sql = `
      SELECT 
        reference_number,
        status,
        is_closed
      FROM tickets
      `

      const result = await this.mysql("query", null, sql, []);

      return {
        data: {
          success: true,
          data: result
        }
      }

    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: null,
        action: "Get Ticket Job Numbers Failed",
        entity: "Ticket",
        details: "Failed to retrieve ticket job numbers.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  async beforeAfterAttachment (parts) {
    let auditUserId = null;
    let ticketRef = null;
    try {
      const response = await this.processFile(parts)
      const { files = [], props = {}} = response;
      auditUserId = props.user_id || null;
      ticketRef = props.ticket_id || null;

      if (files.length > 0) {
        for (const file of files) { 
          file.filename = `tickets/before${file.filename}`;
          const attachment_url = await this.uploadToR2(file)
          await this.create({
            ref_id: props.ticket_id,
            attachment_url: attachment_url,
            file_name: file.original_name,
            status: props.status,
            file_size: file.file_size,
            file_type: file.mimetype,
            created_at: new Date()
          },
          "tickets_attachment_detailed"
          )
        }
      }
 
      const logs = {
        created_at: new Date(),
        user_id: props.user_id,
        action: "Upload",
        entity: "Ticket Attachment",
        details: `Attachment uploaded for ${props.status}.`,
        status_message: "Successfully uploaded attachment."
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs);

      return {
        data: {
          success: true,
          message: "successfully inserted"
        }
      }

    } catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: auditUserId,
        action: "Upload Ticket Attachment Failed",
        entity: "Ticket Attachment",
        details: "Failed to upload ticket attachment.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  async deleteBeforeAfterAttachment(body) {
    try {
      await this.requireFields(body, [
        "ticket_id",
        'status'
      ])
       
      const sql = `
        DELETE FROM tickets_attachment_detailed
        WHERE ref_id = ?
          AND status = ?
      `;
      const values = [body.ticket_id, body.status];

      const result = await this.mysql("execute", null, sql, values);
 
      const logs = {
        created_at: new Date(),
        user_id: body.user_id,
        action: "Delete",
        entity: "Ticket Attachment",
        details: `Attachment deleted for ${body.status}.`,
        status_message: "Successfully deleted attachment."
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs);

      return {
        data: {
          success: true,
          message:
            result.affectedRows > 0
              ? "Successfully deleted"
              : "No matching attachment found",
        },
      };
    } catch (error) {
      throw await ApiError.logAndCreate(error, error.statusCode || 400, this.fastify, {
        user_id: body?.user_id || null,
        action: "Delete Ticket Attachment Failed",
        entity: "Ticket Attachment",
        details: "Failed to delete ticket attachment.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }

  // mark ticket as closed
  async markAsClosed(body) {
    try {
      await this.requireFields(body, [
        "reference_number",
        "status",
        "is_closed",
        "user_id"
      ]);

      const ticket = await this.findOne({
        reference_number: body.reference_number
      });

      if (!ticket) {
        throw new ApiError("Ticket not found", 404);
      }

      let sql = `
        UPDATE tickets
        SET date_closed = ?, is_closed = ?
      `;
      const values = [new Date(), body.is_closed];

      // if (ticket.status !== "resolved") {
      //   sql += `, updated_at = ?`;
      //   values.push(new Date());
      // }

      sql += ` WHERE reference_number = ?`;
      values.push(body.reference_number);

      await this.mysql("execute", null, sql, values);

       const logs = {
        created_at: new Date(),
        user_id: body.user_id,
        action: "Update",
        entity: "Ticket",
        details: `Ticket marked as closed.`,
        status_message: "Successfully marked ticket as closed."
      }

      // Insert audit log
      const auditLogsModel = new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(logs);

      return {
        data: {
          success: true,
          message: "Ticket marked as closed successfully."
        }
      };
    } catch (error) {
        throw await ApiError.logAndCreate(error, error.statusCode || 400, this.fastify, {
          user_id: body?.user_id || null,
          action: "Close Ticket Failed",
          entity: "Ticket",
          details: "Failed to mark ticket as closed.",
          status_message: `Error: ${ApiError.getMessage(error)}`
        });
    }
  }

  async getAllStatus(status, orderBy, statusConditionClosed) {
    try {
      const orderByColumn = orderBy === "created_at" ? "t.created_at" : "t.updated_at";  
      const isClosed = statusConditionClosed === true || statusConditionClosed === "1" || statusConditionClosed === 1 ? 1 : 0;
      let sql = `
      SELECT  
        t.customers_id,
        t.reference_number,
        t.status,  
        c.pid
      FROM tickets as t
      LEFT JOIN customers c ON c.id = t.customers_id
      WHERE
      `;
      const values = [];

      if (status === "closed") {
        sql += ` t.is_closed = 1 `;
      } else {
        sql += ` t.status = ? AND t.is_closed = ? `;
        values.push(status, isClosed);
      }

      sql += `
      ORDER BY ${orderByColumn} DESC  
      `;
      const result = await this.mysql("query", null, sql, values);

      return {
        data: {
          success: true,
          data: result
        }
      }
    }  catch (error) {
      throw await ApiError.logAndCreate(error, 400, this.fastify, {
        user_id: null,
        action: "Get All Tickets by Status Failed",
        entity: "Ticket",
        details: "Failed to retrieve tickets by status.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });
    }
  }
 
  async updateRemarks(id, body) {
    try {

      await this.requireFields(body, [
        "remarks",
        "user_id"
      ]);

      const ticket = await this.findOne({ reference_number: id });
      if (!ticket) {
        throw new ApiError("Ticket not found", 404);
      }
      
      await this.update(
        {
          id: ticket.id,
          remarks: body.remarks,
          updated_at: new Date(),
        },
        "tickets"
      );

      const log = {
        created_at: new Date(),
        user_id: body.user_id,
        action: "Update",
        entity: "Ticket Remarks",
        details: "Ticket remarks updated.",
        status_message: "Successfully updated ticket remarks."
      }

      const auditLogsModel= new (require("./audit_logs.js"))(this.fastify);
      await auditLogsModel.insert(log);

      return {
        data: {
          success: true,
          message: "Ticket remarks updated successfully."
        }
      }
    } catch (error) {
      throw await ApiError.logAndCreate(error, error.statusCode || 400, this.fastify, {
        user_id: body?.user_id || null,
        action: "Update Ticket Remarks Failed",
        entity: "Ticket",
        details: "Failed to update ticket remarks.",
        status_message: `Error: ${ApiError.getMessage(error)}`
      });

    }
  }
}


module.exports = TicketsModel;

/* 
   
*/
