const axios = require("axios");
require("dotenv").config();
const Log = require("../logging_middleware/logger");

const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1
};

const getTopNotifications = async (limit = 10) => {
  try {
    const response = await axios.get(
      "http://20.207.122.201/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );

    const notifications = response.data.notifications;

    await Log("backend", "info", "service", "Fetched notifications");

    notifications.sort((a, b) => {
      if (priorityMap[b.Type] !== priorityMap[a.Type]) {
        return priorityMap[b.Type] - priorityMap[a.Type];
      }
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    const result = notifications.slice(0, limit);

    await Log("backend", "debug", "service", "Sorted notifications");

    return result;
  } catch (err) {
    await Log("backend", "error", "service", err.message);
  }
};
console.log("TOKEN:", process.env.ACCESS_TOKEN);
module.exports = getTopNotifications;