const express = require("express");
const router = express.Router();

// simple handler for now to avoid crash
router.post("/airtable", (req, res) => {
  console.log("Webhook received:", req.body);
  return res.status(200).json({ success: true });
});

module.exports = router;
