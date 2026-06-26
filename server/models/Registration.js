// models/Registration.js
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    qrToken: {
      // Unique token encoded inside QR
      type: String,
      unique: true,
    },
    qrCode: {
      // Base64 Data URL of the QR image
      type: String,
    },
    attended: {
      type: Boolean,
      default: false,
    },
    attendedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports= mongoose.model("Registration", registrationSchema);