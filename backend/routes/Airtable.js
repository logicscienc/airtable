const express = require("express");
const router = express.Router();
const User = require("../models/User");
const axios = require("axios");

// Middleware to verify user is logged in and set req.userId
const authMiddleware = require("../middleware/auth");
router.use(authMiddleware);

// --------------------------
// 1️⃣ GET /bases - fetch Airtable bases
// --------------------------
router.get("/bases", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user?.accessToken) return res.status(401).json({ error: "No Airtable token" });

    const response = await axios.get("https://api.airtable.com/v0/meta/bases", {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });

    res.json(response.data.bases);
  } catch (err) {
    console.error("Route /bases error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch bases", detail: err.response?.data || err.message });
  }
});

// --------------------------
// 2️⃣ GET /tables?baseId=... - fetch tables of a base
// --------------------------
router.get("/tables", async (req, res) => {
  const { baseId } = req.query;
  if (!baseId) return res.status(400).json({ error: "baseId is required" });

  try {
    const user = await User.findById(req.userId);
    if (!user?.accessToken) return res.status(401).json({ error: "No Airtable token" });

    const response = await axios.get(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );

    res.json(response.data.tables);
  } catch (err) {
    console.error("Route /tables error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch tables", detail: err.response?.data || err.message });
  }
});

// --------------------------
// 3️⃣ GET /fields/:baseId/:tableId - fetch fields of a table (only supported types)
// --------------------------
router.get("/fields/:baseId/:tableId", async (req, res) => {
  const { baseId, tableId } = req.params;
  if (!baseId || !tableId) return res.status(400).json({ error: "baseId and tableId are required" });

  try {
    const user = await User.findById(req.userId);
    if (!user?.accessToken) return res.status(401).json({ error: "No Airtable token" });

    const response = await axios.get(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );

    // Find the requested table
    const table = response.data.tables.find((t) => t.id === tableId);
    if (!table) return res.status(404).json({ error: "Table not found" });

    // Filter only supported types
    const supportedTypes = ["singleSelect", "multiSelect", "text", "longText", "attachment"];
    const fields = table.fields.filter((f) => supportedTypes.includes(f.type));

    res.json(fields);
  } catch (err) {
    console.error("Route /fields error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch fields", detail: err.response?.data || err.message });
  }
});

module.exports = router;



