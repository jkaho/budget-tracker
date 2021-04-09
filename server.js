// Require dependencies
const express = require("express"); // server
const logger = require("morgan"); // for logging requests
const mongoose = require("mongoose"); // database
const compression = require("compression"); // for file compression

// Create PORT
const PORT = process.env.PORT || 8000;

// Set up express server
const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Connect to mongoose database
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// API routes
app.use(require("./routes/api.js"));

// Listen to PORT 
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});