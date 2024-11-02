const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// // Define a route for the home page
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
