const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const Auth = require("./routes/Auth");
const Form = require("./routes/Form");
const Response = require("./routes/Response")
const database = require("./config/database");
const Webhook = require("./routes/Webhook");
const Airtable = require("./routes/Airtable");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

// database connect
database.connect();

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
  })
);

// Render health check
app.get("/healthz", (req, res) => res.send("OK"));

// routes
app.use("/api/v1/auth", Auth);
app.use("/api/v1/form", Form);
app.use("/api/v1/response", Response);
app.use("/webhooks", Webhook);
app.use("/api/v1/airtable", Airtable);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Your server is up and running...."
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`)
});
