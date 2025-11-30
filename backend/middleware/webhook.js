const crypto = require("crypto");

function verifyAirtableWebhook(req, res, next) {
  const signature = req.headers['x-airtable-signature']; 
  const payload = JSON.stringify(req.body);

  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.AIRTABLE_WEBHOOK_SECRET)
    .update(payload)
    .digest('base64');


  if (signature !== expectedSignature) {
    return res.status(401).send('Invalid signature');
  }

  
  next();
}

module.exports = verifyAirtableWebhook;
