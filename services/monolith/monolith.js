const express = require('express');

const app = express();
app.use(express.json());

const products = [
  { id: 1, name: 'Keyboard Mekanik', price: 450000, stock: 10 },
  { id: 2, name: 'Mouse Wireless', price: 175000, stock: 25 },
  { id: 3, name: 'Monitor 24 inci', price: 1850000, stock: 5 },
];
const orders = [];

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

app.post('/orders', (request, response) => {
  const { productId, qty } = request.body;

  if (!Number.isInteger(productId) || !Number.isInteger(qty) || qty <= 0) {
    return response.status(400).json({
      error: 'productId and qty must be integers, and qty must be greater than 0',
    });
  }

  const product = products.find((item) => item.id === productId);

  if (!product) {
    return response.status(404).json({ error: 'Product not found' });
  }

  if (product.stock < qty) {
    return response.status(400).json({ error: 'Insufficient stock' });
  }

  product.stock -= qty;

  const order = {
    id: orders.length + 1,
    productId: product.id,
    productName: product.name,
    qty,
    total: product.price * qty,
  };
  orders.push(order);

  response.status(201).json(order);
});

app.get('/orders', (request, response) => {
  response.json(orders);
});

app.listen(3000, () => {
  console.log('Monolith listening on port 3000');
});
