const mongoose = require("mongoose");
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database!!!!!");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
};

module.exports = dbConnection;
