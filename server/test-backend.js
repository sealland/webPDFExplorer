const express = require('express');
const app = express();
const PORT = 5028;

app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working on port 5028!' });
});

app.listen(PORT, () => {
  console.log(`Test backend running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/test`);
});