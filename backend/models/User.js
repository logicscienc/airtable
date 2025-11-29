const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    airtableUserId: {
      type: String,
      required: true,
      trim: true,
      unique: true, 
    },

    name: {
      type: String,
      required: false,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    accessToken: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },

    tokenExpiresAt: {
      type: Date,
      required: true,
    },

    loginAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("User", userSchema);

