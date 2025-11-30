const Response = require("../models/Response");
const Form = require("../models/Form");
const User = require("../models/User");
const {
  AIRTABLE_TOKEN_URL,
  CLIENT_ID,
  CLIENT_SECRET
} = require("../config/airtableOAuth");


async function refreshAccessToken(user) {
 
  if (Date.now() < user.tokenExpiresAt) {
    return user.accessToken;
  }

  const params = new URLSearchParams();
params.append("grant_type", "refresh_token");
params.append("refresh_token", user.refreshToken);
params.append("client_id", CLIENT_ID);
params.append("client_secret", CLIENT_SECRET);

const res = await fetch(AIRTABLE_TOKEN_URL, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: params,
});


  const data = await res.json();

  if (!data.access_token) {
    console.error("Failed to refresh access token:", data);
    throw new Error("Token refresh failed");
  }

  // update user tokens
  user.accessToken = data.access_token;
  user.tokenExpiresAt = Date.now() + data.expires_in * 1000;
  if (data.refresh_token) user.refreshToken = data.refresh_token;
  await user.save();

  return data.access_token;
}


exports.createResponse = async (req, res) => {
  try {
    const userId = req.userId; 
    const { formId, answers } = req.body;

    if (!formId || !answers) {
      return res.status(400).json({ message: "formId and answers are required." });
    }

    // Get form
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    // Get user to access tokens
    const user = await User.findById(userId);
    const accessToken = await refreshAccessToken(user);

    
    const airtableFields = {};

    form.questions.forEach((q) => {
      if (answers[q.questionKey] !== undefined) {
        airtableFields[q.airtableFieldId] = answers[q.questionKey];
      }
    });

    // Create Airtable record
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${form.airtableBaseId}/${form.airtableTableId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: airtableFields }),
      }
    );

    const airtableData = await airtableRes.json();

    if (!airtableData.id) {
      console.error("Airtable error:", airtableData);
      return res.status(500).json({ message: "Failed to create Airtable record" });
    }

    // Save MongoDB response
    const response = await Response.create({
      form: formId,
      answers,
      airtableRecordId: airtableData.id,
    });

    res.status(201).json(response);
  } catch (err) {
    console.error("Create response error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getResponses = async (req, res) => {
  try {
    const { formId } = req.params;

    const responses = await Response.find({ form: formId });

    res.json(responses);
  } catch (err) {
    console.error("Get responses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getResponse = async (req, res) => {
  try {
    const response = await Response.findById(req.params.id);

    if (!response) return res.status(404).json({ message: "Response not found" });

    res.json(response);
  } catch (err) {
    console.error("Get response error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateResponse = async (req, res) => {
  try {
    const userId = req.userId;
    const { answers } = req.body;

    const response = await Response.findById(req.params.id);
    if (!response) return res.status(404).json({ message: "Response not found" });

    const form = await Form.findById(response.form);
    const user = await User.findById(userId);

    const accessToken = await refreshAccessToken(user);

    // Build Airtable update fields
    const airtableFields = {};
    form.questions.forEach((q) => {
      if (answers[q.questionKey] !== undefined) {
        airtableFields[q.airtableFieldId] = answers[q.questionKey];
      }
    });

    // Update record in Airtable
    await fetch(
      `https://api.airtable.com/v0/${form.airtableBaseId}/${form.airtableTableId}/${response.airtableRecordId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: airtableFields }),
      }
    );

    // Update MongoDB
    response.answers = answers;
    await response.save();

    res.json(response);
  } catch (err) {
    console.error("Update response error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteResponse = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(" DELETE REQUEST for response:", req.params.id);
    console.log(" UserID:", userId);

    // 1. Find response
    const response = await Response.findById(req.params.id);
    if (!response) {
      console.log("Response not found");
      return res.status(404).json({ message: "Response not found" });
    }
    console.log(" Found response:", response);

    // 2. Find form
    const form = await Form.findById(response.form);
    console.log(" Found form:", form);

    // 3. Find user
    const user = await User.findById(userId);
    console.log(" Found user:", user);

    // 4. Refresh Airtable Access Token
    const accessToken = await refreshAccessToken(user);
    console.log(" Airtable token refreshed:", accessToken ? "YES" : "NO");

    // 5. Delete in Airtable if record exists
    if (response.airtableRecordId) {
      console.log(" Attempting Airtable delete...");

      const url = `https://api.airtable.com/v0/${form.airtableBaseId}/${form.airtableTableId}/${response.airtableRecordId}`;

      console.log("Airtable DELETE URL:", url);

      const airRes = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const airData = await airRes.text();
      console.log("Airtable delete response:", airData);
    }

    // 6. Delete from MongoDB
    console.log(" Deleting from MongoDB...");
    await Response.findByIdAndDelete(response._id);

    console.log(" Successfully deleted from DB");

    return res.json({ message: "Response deleted successfully" });

  } catch (err) {
    console.error(" Delete response error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};


