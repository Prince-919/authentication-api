const dotenv = require("dotenv");
dotenv.config();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGODB_CONNECTION_STRING,
};

const config = {
  get(key) {
    const value = _config[key];
    if (!value) {
      console.log(
        `The ${key} varibale not found. Make sure to pass to environment variables.`
      );
      process.exit(1);
    }
    return value;
  },
};
module.exports = config;
