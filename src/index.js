const express = require("express");

const app = express();

const serverStart = async () => {
  try {
    app.listen(8000, () => {
      console.log(`Server is running at http://localhost:${8000}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

serverStart();
