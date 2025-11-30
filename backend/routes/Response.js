const express = require("express");
const router = express.Router();

const Response = require("../controllers/Response");
const auth = require("../middleware/auth");


router.use(auth);

// Create a new response
router.post("/", Response.createResponse);

// Get all responses for a specific form
router.get("/form/:formId", Response.getResponses);

// Get a single response by ID
router.get("/:id", Response.getResponse);

// Update a response by ID
router.put("/:id", Response.updateResponse);

// Delete a response by ID (hard delete)
router.delete("/:id", Response.deleteResponse);

module.exports = router;
