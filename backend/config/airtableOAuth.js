const crypto = require("crypto");
require("dotenv").config();

const SCOPES = [
  "data.records:read",
  "data.records:write",
  "user.email:read"
];

const AIRTABLE_AUTH_URL = "https://airtable.com/oauth2/v1/authorize";
const AIRTABLE_TOKEN_URL = "https://airtable.com/oauth2/v1/token";
const AIRTABLE_USERINFO_URL = "https://api.airtable.com/v0/meta/whoami";

const CLIENT_ID = process.env.AIRTABLE_CLIENT_ID;
const CLIENT_SECRET = process.env.AIRTABLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.AIRTABLE_REDIRECT_URI;


function generateCodeVerifier() {
  return crypto.randomBytes(32).toString("hex");
}

function generateCodeChallenge(codeVerifier) {
  const hash = crypto.createHash("sha256").update(codeVerifier).digest();
  return hash.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}


function buildAuthUrl(state, codeChallenge) {
  if (!SCOPES || !CLIENT_ID || !REDIRECT_URI) {
    throw new Error("Missing SCOPES, CLIENT_ID, or REDIRECT_URI");
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES.join(" "),
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `${AIRTABLE_AUTH_URL}?${params.toString()}`;
}

module.exports = {
  AIRTABLE_AUTH_URL,
  AIRTABLE_TOKEN_URL,
  AIRTABLE_USERINFO_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  SCOPES,
  generateCodeVerifier,
  generateCodeChallenge,
  buildAuthUrl,
};






