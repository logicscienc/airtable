const express = require("express");
const router = express.Router();

const Auth = require("../controllers/Auth");

router.get("/login", Auth.login);


router.get("/callback", Auth.callback);


router.post("/logout", (req, res) => {
  res.clearCookie("airtable_access_token");
  res.clearCookie("airtable_refresh_token");
  res.clearCookie("airtable_user_id");
  res.clearCookie("jwt"); 
  return res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
