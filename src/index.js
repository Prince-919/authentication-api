const express = require("express");
const config = require("./config/config");

const app = express();

const serverStart = async () => {
  try {
    const port = config.get("port") || 8000;
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

serverStart();
