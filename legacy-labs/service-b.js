const express = require('express');

const app = express();

app.use((request, response) => {
  response.json({ service: 'B', path: request.path });
});

app.listen(3001, () => {
  console.log('Service B listening on port 3001');
});
