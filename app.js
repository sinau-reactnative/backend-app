require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const upload = multer();

// Import Route
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const tenantRoute = require("./routes/tenants");

// Sync database, only uncomment when the app first running at your machine
// require("./helpers/sync");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet({ noCache: true }));
app.use(upload.array("images"));

app.get("/", (req, res) => {
  res.status(200).json({ err: false, msg: "Hello World" });
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tenants", tenantRoute);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
