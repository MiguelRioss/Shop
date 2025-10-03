    // src/services/fetchStock.js
export default async function fetchStock(apiBase = "https://api-backend-mesodose-2.onrender.com") {
  const res = await fetch(`${apiBase}/api/products`);
  console.log("Fetch stock response:", res);
  if (!res.ok) throw new Error(`Failed to fetch stock: ${res.status}`);
  return res.json(); // expect { id: { stockValue, name, ... }, ... }
}
