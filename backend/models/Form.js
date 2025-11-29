const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    airtableBaseId: {
      type: String,
      required: true,
    },

    airtableTableId: {
      type: String,
      required: true,
    },

    // All form questions
    questions: [
      {
        questionKey: {
          type: String,
          required: true,
        },

        airtableFieldId: {
          type: String,
          required: true,
        },

        label: {
          type: String,
          required: true,
        },

        type: {
          type: String,
          required: true,
          enum: ["singleLineText", "longText", "singleSelect", "multipleSelects", "attachment"],

        },

        required: {
          type: Boolean,
          default: false,
        },

        // Conditional logic rules
        conditionalRules: {
          logic: {
            type: String,
            enum: ["AND", "OR"],
            default: "AND",
          },

          conditions: [
            {
              questionKey: { type: String },        
              operator: {
                type: String,
                enum: ["equals", "notEquals", "contains"],
              },
              value: { type: mongoose.Schema.Types.Mixed }, 
            },
          ],
        },
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Form", FormSchema);
