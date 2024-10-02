const express = require("express");
const dotenv = require("dotenv"); // Ensure correct path to .env
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connect_Database = require("./config/database");
const path = require("path");

dotenv.config({ path: "backend/config/config.env" });
const app = express();
connect_Database();

// Middleware setup
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Allow all origins for CORS
app.use(cors({ origin: "*" }));

// Port configuration
const PORT = process.env.PORT || 5000;
const user = require("./routes/user.routes");
const task = require("./routes/tasks.routes");
const group = require("./routes/groups.routes");

app.use("/api", user);
app.use("/api", task);
app.use("/api", group);

const dirname = path.resolve();
app.use(express.static(path.join(dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(dirname, "frontend", "dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
