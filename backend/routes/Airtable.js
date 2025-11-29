const express = require("express");
const router = express.Router();
const User = require("../models/User");
const axios = require("axios");

// Middleware to verify user is logged in and set req.userId
const authMiddleware = require("../middleware/auth");
router.use(authMiddleware);

// GET /api/v1/airtable/bases
router.get("/bases", async (req, res) => {
  try {
    console.log("=== /bases route hit ===");
    console.log("req.userId:", req.userId);

    const user = await User.findById(req.userId);
    console.log("User from DB:", user);

    if (!user?.accessToken) {
      console.warn("No Airtable access token found for user");
      return res.status(401).json({ error: "No Airtable token" });
    }

    try {
      const response = await axios.get("https://api.airtable.com/v0/meta/bases", {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      console.log("Airtable response data:", response.data);
      res.json(response.data.bases);
    } catch (airtableErr) {
      console.error("Airtable API error:", airtableErr.response?.data || airtableErr.message);
      return res.status(500).json({ error: "Failed to fetch bases", detail: airtableErr.response?.data || airtableErr.message });
    }

  } catch (err) {
    console.error("Route /bases error:", err);
    res.status(500).json({ error: "Internal server error", detail: err.message });
  }
});

// GET /api/v1/airtable/tables?baseId=...
router.get("/tables", async (req, res) => {
  const { baseId } = req.query;
  if (!baseId) return res.status(400).json({ error: "baseId is required" });

  try {
    console.log("=== /tables route hit ===");
    console.log("req.userId:", req.userId);
    console.log("Requested baseId:", baseId);

    const user = await User.findById(req.userId);
    console.log("User from DB:", user);

    if (!user?.accessToken) {
      console.warn("No Airtable access token found for user");
      return res.status(401).json({ error: "No Airtable token" });
    }

    try {
      const response = await axios.get(
        `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      console.log("Airtable response data:", response.data);
      res.json(response.data.tables);
    } catch (airtableErr) {
      console.error("Airtable API error:", airtableErr.response?.data || airtableErr.message);
      return res.status(500).json({ error: "Failed to fetch tables", detail: airtableErr.response?.data || airtableErr.message });
    }

  } catch (err) {
    console.error("Route /tables error:", err);
    res.status(500).json({ error: "Internal server error", detail: err.message });
  }
});

module.exports = router;


