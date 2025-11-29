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

module.exports = router;
