const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

// Serve all the static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// For any other request, serve the index.html file.
// This is important for single-page applications that might use client-side routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Cortex CodeStudio server is running on http://localhost:${PORT}`);
});