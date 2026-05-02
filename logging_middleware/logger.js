const axios = require("axios");
require("dotenv").config();

const VALID_STACK = ["backend", "frontend"];
const VALID_LEVEL = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGE = [
  "handler",
  "repository",
  "route",
  "service",
  "controller",
  "db",
  "cache",
  "cron_job",
  "domain",
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",
  "config",
  "middleware",
  "utils"
];


const Log = async (stack, level, pkg, message) => {
  try {

    if (!VALID_STACK.includes(stack)) {
      throw new Error("Invalid stack value");
    }

    if (!VALID_LEVEL.includes(level)) {
      throw new Error("Invalid level value");
    }

    if (!VALID_PACKAGE.includes(pkg)) {
      throw new Error("Invalid package value");
    }

    if (typeof message !== "string") {
      throw new Error("Message must be a string");
    }

    const response = await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack: stack,
        level: level,
        package: pkg,
        message: message
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Log sent:", response.data);

    return response.data;
  } catch (error) {
    console.error(" Logging Error:", error.message);
  }
};

module.exports = Log;