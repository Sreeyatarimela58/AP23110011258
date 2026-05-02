const express = require("express");
const getTopNotifications = require("./notifications");

const app = express();

app.get("/notifications", async (req, res) => {
  try {
    const result = await getTopNotifications(10);
    res.status(200).json({
      message: "Top notifications",
      data: result
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Notification service running on port 3001");
});