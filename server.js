require("dotenv").config();
const express = require("express");
const dbConnect = require("./config/dbConnect");

const app = express();

dbConnect();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
