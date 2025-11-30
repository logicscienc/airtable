const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  CLIENT_ID,
  CLIENT_SECRET, // it's fine to keep in config, but we will NOT use it for PKCE flow
  REDIRECT_URI,
  AIRTABLE_TOKEN_URL,
  AIRTABLE_USERINFO_URL,
} = require("../config/airtableOAuth");

require("dotenv").config();

// --------------------------
// Helper: Base64URL Encoding
// --------------------------
function base64UrlEncode(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// --------------------------
// 1️⃣ LOGIN — START OAUTH WITH PKCE
// --------------------------
exports.login = async (req, res) => {
  try {
    console.log("=== LOGIN HIT ===");

    // Generate state
    const state = crypto.randomBytes(16).toString("hex");

    // Generate PKCE verifier (43-128 chars)
    const codeVerifier = base64UrlEncode(crypto.randomBytes(32));

    // SHA256(code_verifier) -> code_challenge
    const hash = crypto.createHash("sha256").update(codeVerifier).digest();
    const codeChallenge = base64UrlEncode(hash);

    
    res.cookie("oauth_state", state, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 1000 * 60 * 5 });
    res.cookie("pkce_verifier", codeVerifier, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 1000 * 60 * 5 });

    // Build OAuth URL (include PKCE params)
   const scopes = [
  "data.records:read",
  "data.records:write",
  "schema.bases:read",
  "user.email:read"
];


const authUrl =
  `https://airtable.com/oauth2/v1/authorize` +
  `?client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${scopes.join(" ")}` +
  `&code_challenge=${codeChallenge}` +
  `&code_challenge_method=S256` +
  `&state=${state}`;


    console.log("Redirecting to:", authUrl);

    return res.redirect(authUrl);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------------
// 2️⃣ CALLBACK — EXCHANGE CODE FOR TOKENS (PKCE-only)
// --------------------------

exports.callback = async (req, res) => {
  try {
    console.log("=== CALLBACK HIT ===", req.query);

    const { code, state: stateReturned } = req.query;
    const stateStored = req.cookies.oauth_state;
    const codeVerifier = req.cookies.pkce_verifier;

    if (!stateReturned || stateReturned !== stateStored) {
      return res.status(400).json({ message: "Invalid state" });
    }
    if (!code) return res.status(400).json({ message: "Authorization code missing" });
    if (!codeVerifier) return res.status(400).json({ message: "Missing PKCE verifier" });

    /* -------------------------------------------------
       1️⃣ Exchange Authorization Code for Access Token
    -------------------------------------------------- */
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
    const authHeader = `Basic ${credentials}`;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("client_id", CLIENT_ID);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("code_verifier", codeVerifier);

    const tokenResponse = await fetch(AIRTABLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": authHeader,
      },
      body: params,
    });

    const tokenData = await tokenResponse.json();
    console.log("Token Response:", tokenData);

    if (!tokenData.access_token) {
      return res.status(500).json({
        message: "Failed to obtain token",
        detail: tokenData,
      });
    }

    const accessToken = tokenData.access_token;

    /* -------------------------------------------------
       2️⃣ Fetch Airtable User Profile
    -------------------------------------------------- */
    const userInfoResponse = await fetch(AIRTABLE_USERINFO_URL, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userInfo = await userInfoResponse.json();
    console.log("User Info:", userInfo);

    if (!userInfo || !userInfo.id) {
      return res.status(500).json({
        message: "Failed to fetch Airtable user info",
        detail: userInfo,
      });
    }

    /* -------------------------------------------------
       3️⃣ Store User in MongoDB
    -------------------------------------------------- */
    let user = await User.findOne({ airtableUserId: userInfo.id });

    if (!user) {
      user = await User.create({
        airtableUserId: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        accessToken,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      });
    } else {
      user.accessToken = accessToken;
      user.refreshToken = tokenData.refresh_token;
      user.tokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
      await user.save();
    }

    // Clear verification cookies
    res.clearCookie("pkce_verifier");
    res.clearCookie("oauth_state");

    /* -------------------------------------------------
       4️⃣ OPTIONAL: Store Airtable tokens in cookies
    -------------------------------------------------- */
    res.cookie("airtable_access_token", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: tokenData.expires_in * 1000,
    });

    res.cookie("airtable_refresh_token", tokenData.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    res.cookie("airtable_user_id", userInfo.id, {
      httpOnly: false,
      sameSite: "lax",
      secure: false,
    });

    /* -------------------------------------------------
       5️⃣ Issue JWT containing Airtable Tokens
    -------------------------------------------------- */
    const jwtToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        airtableAccessToken: accessToken,
        airtableRefreshToken: tokenData.refresh_token,
        airtableUserId: userInfo.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const frontendRedirect = `${process.env.FRONTEND_URL}/auth/success?token=${jwtToken}`;
    console.log("Redirecting to frontend:", frontendRedirect);

    return res.redirect(frontendRedirect);

  } catch (err) {
    console.error("Callback error:", err);
    return res.status(500).json({
      message: "OAuth callback error",
      error: err.message,
    });
  }
};







