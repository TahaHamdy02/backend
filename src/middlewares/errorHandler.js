const logEvents = require("./logger");
const { v4: uuidv4 } = require("uuid");
const { Logger } = require("winston");
const errorHandler = (err, req, res, next) => {
    const { method, originalUrl, hostname } = req;
    const date = new Date().toISOString().split("T")[0];
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    const requestId = uuidv4();
    const logMessage = `${date} ${time} ${requestId} ${err} ${method} ${originalUrl} ${hostname}\n`;
    logEvents("errorLogs.log", logMessage);
    res.status(500).json({ error: 'Internal Server Error' })
};

module.exports = errorHandler;
