const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Mosque = require("../models/Mosque");
const auth = require("../middleware/auth");

const router = express.Router();

// Token banano helper
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── POST /api/mosque/register ──────────────
router.post("/register", async (req, res) => {
  try {
    const { name, area, district, email, password } = req.body;
    if (!name || !area || !district || !email || !password) {
      return res.status(400).json({ message: "Shob field দিতে hobe" });
    }
    const exists = await Mosque.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res
        .status(409)
        .json({ message: "Ei email e already account ache" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const mosque = await Mosque.create({
      name,
      area,
      district,
      email,
      passwordHash,
    });
    const token = signToken(mosque._id);
    res.status(201).json({
      token,
      mosque: { id: mosque._id, name: mosque.name, email: mosque.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/mosque/login ─────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const mosque = await Mosque.findOne({ email: (email || "").toLowerCase() });
    if (!mosque)
      return res.status(401).json({ message: "Email ba password bhul" });

    const match = await bcrypt.compare(password, mosque.passwordHash);
    if (!match)
      return res.status(401).json({ message: "Email ba password bhul" });

    const token = signToken(mosque._id);
    res.json({
      token,
      mosque: { id: mosque._id, name: mosque.name, email: mosque.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/mosque/me (protected) ─────────
// Nijer profile — login er por dashboard e current time dekhate
router.get("/me", auth, async (req, res) => {
  const mosque = await Mosque.findById(req.mosqueId).select("-passwordHash");
  if (!mosque) return res.status(404).json({ message: "Masjid pawa jayni" });
  res.json(mosque);
});

// ── GET /api/mosque/:id (open) ─────────────
// User search result theke ek masjid er detail. NOTE: /me er PORE thakte hobe
router.get("/:id", async (req, res) => {
  try {
    const mosque = await Mosque.findById(req.params.id).select("-passwordHash");
    if (!mosque) return res.status(404).json({ message: "Masjid pawa jayni" });
    res.json(mosque);
  } catch (err) {
    res.status(500).json({ message: "Invalid masjid id" });
  }
});

module.exports = router;
