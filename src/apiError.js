class ApiError extends Error {
  constructor(message, statusCode = 500, field = null, value = null) {
    // Normalize incoming error objects so thrown ApiError always has a readable message.
    super(ApiError.getMessage(message));
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.field = field;
    this.value = value;
    this.originalError = message instanceof Error ? message : null;
  }

  static getMessage(message) {
    if (message instanceof Error) return message.message;
    if (typeof message === "string") return message;
    if (message && typeof message === "object" && message.message) return message.message;
    return "Internal Server Error";
  }

  static async saveAuditLog(fastify, logData) {
    if (!fastify || !logData) return;

    try {
      const AuditLogsModel = require("./models/audit_logs.js");
      const auditLogsModel = new AuditLogsModel(fastify);
      await auditLogsModel.insert({
        created_at: new Date(),
        ...logData,
      });
    } catch (auditError) {
      // Audit logging must not hide the original application error.
      fastify.log.error({
        context: "ApiError.saveAuditLog",
        message: ApiError.getMessage(auditError),
        audit_log: logData,
      });
    }
  }

  static async logAndCreate(error, statusCode = 500, fastify = null, logData = null) {
    // Default status_message to the actual error text so audit logs show the exact failure reason.
    const payload = logData
      ? {
          ...logData,
          status_message: logData.status_message || ApiError.getMessage(error),
        }
      : null;

    // Save the auth failure first so debugging has a durable record of the rejected action.
    await ApiError.saveAuditLog(fastify, payload);
    return new ApiError(error, statusCode, error?.field, error?.value ?? null);
  }
}

module.exports = ApiError;
  
