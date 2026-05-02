const axios = require("axios");
require("dotenv").config();
const Log = require("../logging_middleware/logger");

const knapsack = (tasks, maxHours) => {
  const n = tasks.length;

  const dp = Array.from({ length: n + 1 }, () =>
    Array(maxHours + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const { Duration, Impact } = tasks[i - 1];

    for (let w = 0; w <= maxHours; w++) {
      if (Duration <= w) {
        dp[i][w] = Math.max(
          Impact + dp[i - 1][w - Duration],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  let w = maxHours;
  const selectedTasks = [];

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedTasks.push(tasks[i - 1]);
      w -= tasks[i - 1].Duration;
    }
  }

  return {
    maxImpact: dp[n][maxHours],
    selectedTasks
  };
};

const runScheduler = async () => {
  try {
    console.log("TOKEN:", process.env.ACCESS_TOKEN);

    const depotRes = await axios.get(
      "http://20.207.122.201/evaluation-service/depots",
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );

    const vehicleRes = await axios.get(
      "http://20.207.122.201/evaluation-service/vehicles",
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );

    const depots = depotRes.data.depots || [];
    const tasks = vehicleRes.data.vehicles || [];

    console.log("Depots:", depots.length);
    console.log("Tasks:", tasks.length);

    const results = [];

    for (let depot of depots) {
      const { maxImpact, selectedTasks } = knapsack(
        tasks,
        depot.MechanicHours
      );

      results.push({
        depotID: depot.ID,
        totalImpact: maxImpact,
        selectedTasks
      });

      await Log("backend", "debug", "service", `Depot ${depot.ID} processed`);
    }

    return results;
  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
    await Log("backend", "error", "service", err.message);
    return [];
  }
};

module.exports = runScheduler;