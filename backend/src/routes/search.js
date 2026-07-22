const express = require("express");
const Mosque = require("../models/Mosque");

const router = express.Router();

// ── GET /api/search?q=... (open) ───────────
router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    const regex = new RegExp(q, "i"); // case-insensitive partial match
    const mosques = await Mosque.find({
      $or: [{ name: regex }, { area: regex }, { district: regex }],
    })
      .select("-passwordHash")
      .limit(20);

    res.json(mosques);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
