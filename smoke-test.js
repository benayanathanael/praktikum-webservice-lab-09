const BASE = process.env.BASE_URL || 'http://localhost:8080';

async function main() {
  const productsResponse = await fetch(`${BASE}/product-service/products`);
  const products = await productsResponse.json();
  if (!productsResponse.ok) {
    throw new Error(
      `GET /product-service/products failed (${productsResponse.status}): ${JSON.stringify(products)}`,
    );
  }
  if (!Array.isArray(products)) {
    throw new Error('GET /product-service/products did not return an array');
  }
  console.log(`Jumlah produk: ${products.length}`);

  const orderResponse = await fetch(`${BASE}/order-service/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: 1, qty: 2 }),
  });
  const orderBody = await orderResponse.json();
  console.log(`Status POST /order-service/orders: ${orderResponse.status}`);
  console.log('Body respons order:', orderBody);

  const productResponse = await fetch(`${BASE}/product-service/products/1`);
  const product = await productResponse.json();
  if (!productResponse.ok) {
    throw new Error(
      `GET /product-service/products/1 failed (${productResponse.status}): ${JSON.stringify(product)}`,
    );
  }
  console.log(`Stok terbaru produk 1: ${product.stock}`);
}

main().catch((error) => {
  console.error(`Smoke test gagal: ${error.message}`);
  process.exitCode = 1;
});
