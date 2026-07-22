const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token nei, access denied" });
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.mosqueId = decoded.id; // ekhon jani kon masjid request korche
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid ba expired token" });
  }
};

module.exports = auth;
