const express = require("express");
const Mosque = require("../models/Mosque");
const auth = require("../middleware/auth");

const router = express.Router();

// ── PUT /api/prayer-times (protected) ──────
// SUDHU login kora masjid nijer time update korte parbe
router.put("/", auth, async (req, res) => {
  try {
    const { prayerTimes } = req.body;
    if (!prayerTimes) {
      return res.status(400).json({ message: "prayerTimes data নেই" });
    }
    const mosque = await Mosque.findByIdAndUpdate(
      req.mosqueId, // token theke asheche — tai onno masjid er time change kora jabe na
      { $set: { prayerTimes } },
      { new: true, runValidators: true },
    ).select("-passwordHash");

    if (!mosque) return res.status(404).json({ message: "Masjid pawa jayni" });
    res.json({ message: "Namaz time update hoyeche ✅", mosque });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
