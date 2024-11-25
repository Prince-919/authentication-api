const express = require("express");
const config = require("./config/config");
const dbConnect = require("./config/db-config");

const app = express();

const serverStart = async () => {
  l;
  try {
    await dbConnect();
    const port = config.get("port") || 8000;
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}.`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

serverStart();
