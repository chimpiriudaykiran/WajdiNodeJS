const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// POST endpoint to save JSON content
app.post("/save-json", (req, res) => {
  const { filename, content } = req.body;

  // Define the path to save the file in the 'public' directory
  const filePath = path.join(__dirname, "public", filename);

  fs.writeFile(filePath, JSON.stringify(content, null, 2), (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ error: "Failed to save file" });
    }
    res.json({ message: "File saved successfully" });
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
