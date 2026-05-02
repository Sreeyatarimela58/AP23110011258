const express = require("express");
const runScheduler = require("./scheduler");

const app = express();

app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/vehicle-scheduling", async (req, res) => {
  console.log("Route hit");

  const result = await runScheduler();

  console.log("RESULT:", result);

  res.json(result);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});