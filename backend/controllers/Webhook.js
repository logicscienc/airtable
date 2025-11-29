exports.handleAirtableWebhook = (req, res) => {
  console.log("Airtable webhook received:", req.body);
  // Update MongoDB here later
  res.status(200).send("Webhook received");
};
