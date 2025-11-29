const express = require("express");
const router = express.Router();

const Form = require("../controllers/Form");
const auth = require("../middleware/auth");

// --------------------------
// PROTECTED FORM ROUTES
// --------------------------
// All routes require the user to be logged in
router.use(auth);

// Create a new form
router.post("/", Form.createForm);

// Get all forms of logged-in user
router.get("/", Form.getMyForms);

// Get a single form by ID
router.get("/:id", Form.getFormById);

// Update a form by ID
router.put("/:id", Form.updateForm);

// Delete a form (hard delete)
router.delete("/:id", Form.deleteForm);

module.exports = router;
