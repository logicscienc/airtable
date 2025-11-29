const crypto = require("crypto");

function verifyAirtableWebhook(req, res, next) {
  const signature = req.headers['x-airtable-signature']; // Airtable sends this header
  const payload = JSON.stringify(req.body);

  // Compute HMAC using your secret
  const expectedSignature = crypto
    .createHmac('sha256', process.env.AIRTABLE_WEBHOOK_SECRET)
    .update(payload)
    .digest('base64');

  // Check if signature matches
  if (signature !== expectedSignature) {
    return res.status(401).send('Invalid signature');
  }

  // Signature valid → proceed
  next();
}

module.exports = verifyAirtableWebhook;
