const ApiError = require("../apiError");
async function ticketsRoute(fastify, options) {
  const ticketsModel = fastify.models.TicketsModel;

  //insert route
  fastify.post(
    "/", 
    async (request, reply) => {
      const { body } = request;
      const result = await ticketsModel.insert(body);
      return result;
    }
  );

  fastify.post(
    "/:id/image", 
    async (request, reply) => {
      const { id } = request.params 
      const parts = request.parts();
      return await ticketsModel.images(id, parts);
  });

  fastify.get(
    "/status",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { 
        status, 
        orderBy, 
        statusConditionClosed 
      } = request.query; 
      return await ticketsModel.getAllStatus(status, orderBy, statusConditionClosed);
    }
  )

  // list all company
  fastify.get(
    "/listing-company",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      return await ticketsModel.getAllCompany();
    }
  )

  // Fastify route
  fastify.get(
    "/",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { status } = request.query;
      return await ticketsModel.getAll(status); 
    }
  );

  //get all route
  fastify.get(
    "/:pid",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { pid } = request.params;
      return await ticketsModel.getByPid(pid);
    }
  );

    //get all route
  fastify.get(
    "/:pid/public", 
    async (request, reply) => {
      const { pid } = request.params;
      return await ticketsModel.getByPidPublic(pid);
    }
  );

  // inserting attachment
  fastify.post(
    "/before-after",
    { preHandler: fastify.authenticate },
    async(req, reply) => {
      const parts = req.parts();
      return await ticketsModel.beforeAfterAttachment(parts);
    }
  )

  // //endpoint for UPDATE
  // fastify.put(
  //   "/",
  //   { preHandler: fastify.authenticate },
  //   async (request, reply) => {
  //     const { body } = request;
  //     return await ticketsModel.updateById(body);
  //   }
  // );

  //endpoint for ARCHIVE
  fastify.put(
    "/archive",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { body } = request;
      return await ticketsModel.archiveById(body);
    }
  );

  //get messages by ticket id route
  fastify.get(
    "/:id/conversations",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { id } = request.params;
      return await ticketsModel.getMessagesByTicketId(id);
    }
  );

  //get messages by ticket id route
  fastify.get(
    "/:id/conversations/public",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { id } = request.params;
      return await ticketsModel.getMessagesByTicketIdPublic(id);
    }
  );

  fastify.delete(
    "/:id/delete/message",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { id } = request.params;
      return await ticketsModel.deleteMessageId(id)
    }
  )

  fastify.delete(
    "/deleteBeforeAfterAttachment",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { body } = request;
      return await ticketsModel.deleteBeforeAfterAttachment(body)
    }
  )
   
  // delete specific products
  fastify.delete(
    "/",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
          const parts = request.parts();
        return await ticketsModel.delete(parts);
    }
  )

  // inserting message 
  fastify.post(
    "/conversations/reply",
    {
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      const parts = request.parts();
      return await ticketsModel.insertTicketMessage(parts);
    }
  );

  // sent Job order
  fastify.put(
    "/:id/sent-job-order",
    { preHandler: fastify.authenticate },
    async (req, reply) => {
      const parts = req.parts();
      const { id } = req.params;
      return await ticketsModel.sentJobOrder(id, parts)
    }
  );

  // update serial number 
  fastify.put(
    "/:id/update-serial-number",
    { preHandler: fastify.authenticate },
    async (req, reply) => {
      const { id } = req.params;
      const parts = req.parts()
      return await ticketsModel.updateSerialNumber(id, parts)
    }
  ) 

  fastify.get(
    '/search-bar',
    { preHandler: fastify.authenticate },
    async (request, reply) => { 
      return await ticketsModel.getAllTicketByJobNo()
    }
  )

  fastify.put(
    "/:id/remarks",
    { preHandler: fastify.authenticate },
    async (req, reply) => {
      const { id } = req.params;
      const { body } = req;
      return await ticketsModel.updateRemarks(id, body)
    } 
  )

  // upload
  fastify.put(
    "/:id/upload-job-order",
    { preHandler: fastify.authenticate },
    async (req, reply) => {
      const parts = req.parts();
      const { id } = req.params;
      return await ticketsModel.uploadJobOrder(id, parts)
    }
  )

   // inserting message 
  fastify.post(
    "/conversations/reply/public", 
    async (request, reply) => {
      const parts = request.parts();
      return await ticketsModel.replyMessage(parts);
    }
  );

  // inbound
  // fastify.post("/hook", async (request, reply) => {
  //   try {
  //     const emailData = request.body;

  //     // Extract ticket ID from Subject (assuming format: "Re: Ticket TK-0gpJyqKi5CR8")
  //     const ticketIdMatch = emailData.Subject.match(/TK-\w+/);
  //     if (!ticketIdMatch) {
  //       return reply.code(400).send({ success: false, message: "Ticket ID not found in subject" });
  //     }
      
  //     const ticketId = ticketIdMatch[0];

  //     // Insert the inbound message to DB
  //     const payload = {
  //       sender_email: emailData.From,
  //       // sender_name: emailData.From.split("@")[0], // simple example
  //       tickets_id: ticketId,
  //       message_body: emailData.TextBody,
  //       is_inbound: true, // mark as inbound
  //       user_role: "Customer", // or your convention
  //     };

  //     const result = await ticketsModel.insertTicketInbound(payload);

  //     return reply.code(200).send({
  //       success: true,
  //       message: "Inbound email saved",
  //       data: result.data,
  //     });

  //   } catch (error) {
  //     throw new ApiError(error)
  //   }
  // }) 

  // inserting message when have attachment
  // fastify.post(
  //     "/conversations/attachment/reply",
  //   {
  //     preHandler: fastify.authenticate,
  //   },
  //   async (request, reply) => { 
  //     const parts = request.parts();
  //     return await ticketsModel.insertTicketAttachment(parts);
  //   }
  // );

  // update status ticket 
  fastify.put(
    "/:id/status",
    { preHandler: fastify.authenticate },
    async(request, reply) => {
      const { id } = request.params;
      const { body } = request;
      return ticketsModel.updateStatus(id, body)
    }
  );

  fastify.put(
    "/mark-as-closed",
    { preHandler: fastify.authenticate },
    async(request, reply) => {
      const { body } = request;
      return ticketsModel.markAsClosed(body)
    }
  )
}

module.exports = ticketsRoute;
