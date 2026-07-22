const mongoose = require("mongoose");

// Azan + Iqamah ekta reusable slot
const timeSlot = {
  azan: { type: String, default: "" },
  iqamah: { type: String, default: "" },
};

const mosqueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    prayerTimes: {
      fajr: timeSlot,
      dhuhr: timeSlot,
      asr: timeSlot,
      maghrib: timeSlot,
      isha: timeSlot,
      jumuah: { type: String, default: "" }, // Friday
    },
  },
  { timestamps: true }, // createdAt + updatedAt auto add hobe
);

module.exports = mongoose.model("Mosque", mosqueSchema);
