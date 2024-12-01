const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const { dbConnect, config } = require("./config");
const { globalErrorHandler, notFound } = require("./utils");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Authentication API! 🚀🚀🚀",
  });
});

app.use("/auth", require("./routes/auth-route"));

app.use(notFound);
app.use(globalErrorHandler);

const serverStart = async () => {
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
