const Form = require("../models/Form");


exports.createForm = async (req, res) => {
  try {
    const { airtableBaseId, airtableTableId, questions, title } = req.body;

    // Validate required fields
    if (!airtableBaseId || !airtableTableId) {
      return res.status(400).json({
        success: false,
        message: "Base ID and Table ID are required",
      });
    }

 
    const airtableToken = req.user?.airtableAccessToken;

    if (!airtableToken) {
      return res.status(401).json({
        success: false,
        message: "Airtable access token missing. Please re-login.",
      });
    }

    
    let airtableTableName = null;

    try {
      const metaRes = await axios.get(
        `https://api.airtable.com/v0/meta/bases/${airtableBaseId}/tables`,
        {
          headers: {
            Authorization: `Bearer ${airtableToken}`,
          },
        }
      );

      const foundTable = metaRes.data.tables.find((t) => t.id === airtableTableId);
      airtableTableName = foundTable ? foundTable.name : null;

    } catch (metaErr) {
      console.error("Airtable Metadata Fetch Failed:", metaErr.response?.data || metaErr);
      
    }

   
    const finalTitle = title || airtableTableName || "Untitled Form";

 
    const form = await Form.create({
      owner: req.userId,
      airtableBaseId,
      airtableTableId,
      title: finalTitle,
      questions,
    });

    return res.status(201).json({
      success: true,
      message: "Form created successfully",
      data: form,
    });

  } catch (err) {
    console.error("Create Form Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error creating the form",
    });
  }
};

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
