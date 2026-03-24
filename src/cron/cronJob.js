import cron from "node-cron";
import { sendEmailWithTemplate } from "../helper/postmarkClient.js";

export function setupDeletedApplicantCron(fastify) {
  // Run every day at 6:00 AM
  cron.schedule("0 6 * * *", async () => {
    console.log(`[CRON] [${new Date().toISOString()}] Running expired applicant cleanup...`);

    try {
      // Get a connection from pool
      const conn = await fastify.mysql["ticketing-system"].getConnection();

      // Select applicants to delete
      const selectSql = `
         SELECT id, full_name, email, position
        FROM applicants
        WHERE status = 'REJECTED'
          AND is_rejected = 0
          AND created_at < NOW() - INTERVAL 3 DAY
        LIMIT 1000;
      `;
      const [applicants] = await conn.query(selectSql);

      // Send email to each applicant before deletion
      for (const applicant of applicants) {
        const templateModel = {
          position_name: applicant.position,
          current_year: new Date().getFullYear()
        };
        const templateId = 43095726;

        try {
          await sendEmailWithTemplate({
            to: applicant.email,
            templateId,
            templateModel
          }); 

          let sqlUpdate = `
            UPDATE applicants
            SET is_rejected = 1
            WHERE id = ?
          ` 
          await conn.query(
            sqlUpdate,
            [applicant.id]
          );

          fastify.log.info(`[CRON] Email sent to ${applicant.email}`);
        } catch (emailError) {
          fastify.log.error(`[CRON] Failed to send email to ${applicant.email}:`, emailError);
        }
      }

      // Delete the applicants
      // const deleteSql = `
      //   DELETE FROM applicants
      //   WHERE is_deleted = 1
      //   AND created_at < NOW() - INTERVAL 3 DAY
      //   LIMIT 1000;
      // `;
      // const [result] = await conn.query(deleteSql);
      conn.release(); // release connection back to pool

      fastify.log.info(
         `[CRON] [${new Date().toISOString()}] Rejection emails sent and applicants updated successfully.`, 
      );
      
    } catch (error) {
      console.error(`[CRON ERROR] [${new Date().toISOString()}]`, error);
    }
  });
}

export function markAsClosedCron(fastify) {
  // Checking for close ticket
  // Run every 5 seconds
  cron.schedule("0 6 * * *", async () => {
    let conn;
    try {
      // Get a connection from pool
      conn = await fastify.mysql["ticketing-system"].getConnection();

      const sqlCloseStaleTickets = `
        UPDATE tickets t
        INNER JOIN (
          SELECT
            tickets_id,
            MAX(created_at) AS last_message_at
          FROM tickets_conversations
          GROUP BY tickets_id
        ) tc ON tc.tickets_id = t.reference_number
        SET
          t.is_closed = 1,
          t.remarks = "This job order was automatically closed by the system due to more than 30 days of inactivity."
        WHERE t.is_closed = 0
          AND tc.last_message_at < NOW() - INTERVAL 30 DAY
          AND t.status IN ('open', 'pending');
      `;

      const [result] = await conn.query(sqlCloseStaleTickets);

      fastify.log.info(
        `[CRON] [${new Date().toISOString()}] Closed stale tickets: ${result.affectedRows}`
      );
    } catch (error) {
      console.error(`[CRON ERROR] [${new Date().toISOString()}]`, error);
    } finally {
      if (conn) conn.release();
    }
  });
}

 
