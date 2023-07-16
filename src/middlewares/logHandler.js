const logEvents = require("./logger");
const { v4: uuidv4 } = require("uuid");
const logHandler = (req, res, next) => {
  const { method, originalUrl, hostname } = req;
  const date = new Date().toISOString().split("T")[0];
  const time = new Date().toLocaleTimeString("en-US", { hour12: false });
  const requestId = uuidv4();
  const logMessage = `${date} ${time} ${requestId} ${method} ${hostname} ${originalUrl}\n`;
  logEvents("requestLogs.log", logMessage);
  next();
}
module.exports = logHandler
