const express = require("express");
const router = express.Router();

const Auth = require("../controllers/Auth");

// --------------------------
// AUTH ROUTES
// --------------------------

// Step 1: Redirect to Airtable OAuth
router.get("/login", Auth.login);

// Step 2: OAuth callback URL (Airtable redirects here)
router.get("/callback", Auth.callback);


router.post("/logout", (req, res) => {
  res.clearCookie("airtable_access_token");
  res.clearCookie("airtable_refresh_token");
  res.clearCookie("airtable_user_id");
  res.clearCookie("jwt"); // if you stored JWT in cookie
  return res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
