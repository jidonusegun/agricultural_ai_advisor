const express = require("express");
const cors = require("cors");

const diagnoseRoutes = require("./routes/diagnose.route");

const whatsappRoutes = require("./routes/whatsapp.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/diagnose", diagnoseRoutes);
app.use("/", whatsappRoutes);

module.exports = app;