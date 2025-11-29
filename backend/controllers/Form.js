const Form = require("../models/Form");

// ------------------------------------------------------
// CREATE NEW FORM
// ------------------------------------------------------
exports.createForm = async (req, res) => {
  try {
    const { airtableBaseId, airtableTableId, questions } = req.body;

    const form = await Form.create({
      owner: req.userId, // authenticated user
      airtableBaseId,
      airtableTableId,
      questions,
    });

    res.status(201).json({
      success: true,
      message: "Form created successfully",
      data: form,
    });
  } catch (err) {
    console.error("Create Form Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ------------------------------------------------------
// GET ALL FORMS OF LOGGED-IN USER
// ------------------------------------------------------
exports.getMyForms = async (req, res) => {
  try {
    const forms = await Form.find({ owner: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: forms.length,
      data: forms,
    });
  } catch (err) {
    console.error("Get Forms Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ------------------------------------------------------
// GET SINGLE FORM BY ID
// ------------------------------------------------------
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      data: form,
    });
  } catch (err) {
    console.error("Get Form Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ------------------------------------------------------
// UPDATE FORM
// ------------------------------------------------------
exports.updateForm = async (req, res) => {
  try {
    const updates = req.body;

    const form = await Form.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form updated successfully",
      data: form,
    });
  } catch (err) {
    console.error("Update Form Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ------------------------------------------------------
// HARD DELETE FORM
// ------------------------------------------------------
exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form deleted permanently",
    });
  } catch (err) {
    console.error("Delete Form Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
