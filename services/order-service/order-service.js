const express = require('express');

const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3000';
const app = express();
app.use(express.json());

const orders = [];

app.post('/orders', async (request, response) => {
  const { productId, qty } = request.body;

  if (!Number.isInteger(productId) || !Number.isInteger(qty) || qty < 1) {
    return response.status(400).json({
      error: 'productId and qty must be integers, and qty must be at least 1',
    });
  }

  let productResponse;
  try {
    productResponse = await fetch(
      `${PRODUCT_URL}/products/${productId}/reserve`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty }),
        signal: AbortSignal.timeout(2000),
      },
    );
  } catch (error) {
    console.error(`product-service request failed: ${error.message}`);
    return response
      .status(503)
      .json({ error: 'product-service tidak tersedia, coba lagi nanti' });
  }

  const data = await productResponse.json();

  if (!productResponse.ok) {
    return response.status(productResponse.status).json(data);
  }

  const order = {
    id: orders.length + 1,
    productId,
    productName: data.name,
    qty,
    total: data.price * qty,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);

  response.status(201).json(order);
});

app.get('/orders', (request, response) => {
  response.json(orders);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Order service listening on port ${port}`);
});
