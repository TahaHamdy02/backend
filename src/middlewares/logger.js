const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const logEvents = (filename, message) => {
  const logDir = path.join(__dirname, "../logs");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  const logFilePath = path.join(logDir, filename);
  const logMessage = `${message}\n`;
  fs.appendFileSync(logFilePath, logMessage);
};

module.exports = logEvents;
