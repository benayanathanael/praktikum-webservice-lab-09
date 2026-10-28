const express = require('express');

const app = express();

app.use((request, response) => {
  response.json({ service: 'A', path: request.path });
});

app.listen(3000, () => {
  console.log('Service A listening on port 3000');
});
