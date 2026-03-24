// postmarkClient.js
const postmark = require('postmark');
const ApiError = require("../apiError")

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Send an email using Postmark.
 * Accepts an optional `from` to override the `POSTMARK_FROM_EMAIL` env var.
 */
async function sendEmailWithTemplate({ 
  to, 
  templateId, 
  templateModel, 
  subject, 
  body, 
  from, 
  replyTo,
  attachments = []
} = {}) {
  const fromEmail = from || process.env.POSTMARK_FROM_EMAIL;

  if (!fromEmail) throw new Error("POSTMARK_FROM_EMAIL is not set.");
  if (!isValidEmail(fromEmail)) throw new Error("Invalid POSTMARK_FROM_EMAIL format.");
  if (!to) throw new Error("Recipient (to) is required.");
  if (!isValidEmail(to)) throw new Error("Invalid recipient email format.");

  const result = await client.sendEmailWithTemplate({
    From: fromEmail,
    To: to,
    Subject: subject,
    TemplateId: templateId, // Postmark template ID
    TemplateModel: templateModel, // Dynamic data for placeholders
    TextBody: body,
    replyTo: replyTo,
    Attachments: attachments
  });
  return result;
} 

// Utility to clean inbound messages
function cleanInboundMessage(message) {
  if (!message) return "";

  const lines = message.split(/\r?\n/);

  const cleanedLines = lines.filter(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('>')) return false; // remove quoted lines
    if (/^On .* wrote:/.test(trimmed)) return false; // remove reply headers
    if (trimmed === "") return false; // remove empty lines
    return true;
  });

  return cleanedLines.join("\n").trim();
}

// Correct export
module.exports = {
  sendEmailWithTemplate,
  cleanInboundMessage, 
};
