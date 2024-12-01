const { connection, connect } = require("mongoose");
const config = require("./config");

const dbConnect = async () => {
  try {
    connection.on("connected", () => {
      console.log("Connected to database successfully.");
    });
    connection.on("error", (err) => {
      console.log(`Error in connecting to database: ${err.message}`);
    });
    await connect(config.get("databaseUrl"));
  } catch (err) {
    console.log(`Failed to connect to database: ${err.message}`);
    process.exit(1);
  }
};
module.exports = dbConnect;
