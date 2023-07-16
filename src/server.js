require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const dbConnection = require("./config/dbConnection");
const logHandler = require("./middlewares/logHandler");
const errorHandler = require("./middlewares/errorHandler");
const { corsOptions } = require("./config/cors")
const app = express();

// EJS configurations
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Main middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);

// Static files
app.use(express.static("public"));

// Log handler
app.use(logHandler);

// Routes
app.use("/api", require("./routes/Routes"));

// Error handler
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  dbConnection();
  console.log(`Server is running on port ${port}`);
});
