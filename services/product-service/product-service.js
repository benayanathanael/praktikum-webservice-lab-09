const express = require('express');

const app = express();
app.use(express.json());

const products = [
  { id: 1, name: 'Keyboard Mekanik', price: 450000, stock: 10 },
  { id: 2, name: 'Mouse Wireless', price: 175000, stock: 25 },
  { id: 3, name: 'Monitor 24 inci', price: 1850000, stock: 5 },
];

app.get('/products', (request, response) => {
  response.json(products);
});

app.get('/products/:id', (request, response) => {
  const product = products.find((item) => item.id === Number(request.params.id));

  if (!product) {
    return response.status(404).json({ error: 'Product not found' });
  }

  response.json(product);
});

app.post('/products/:id/reserve', (request, response) => {
  const product = products.find((item) => item.id === Number(request.params.id));

  if (!product) {
    return response.status(404).json({ error: 'Product not found' });
  }

  const { qty } = request.body;

  if (!Number.isInteger(qty) || qty <= 0) {
    return response.status(400).json({
      error: 'qty must be an integer greater than 0',
    });
  }

  if (product.stock < qty) {
    return response.status(409).json({ error: 'Insufficient stock' });
  }

  product.stock -= qty;
  response.json(product);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Product service listening on port ${port}`);
});
