const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Masjid Namaz Time API running"));

// apis
app.use("/api/mosque", require("./routes/mosque"));
app.use("/api/prayer-times", require("./routes/prayerTimes"));
app.use("/api", require("./routes/search"));

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  );
});
