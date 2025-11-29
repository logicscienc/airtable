const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },

    airtableRecordId: {
      type: String,
      default: null, 
    },

    answers: {
      type: Object, 
      required: true,
    },

    deletedInAirtable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Response", ResponseSchema);
