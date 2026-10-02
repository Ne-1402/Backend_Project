require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);
app.get("/", (req, res) => res.send("API is running"));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});