import apiURLresolve from "./apiURLresolve";

// src/services/fetchStock.js
export default async function fetchStock({ samples = false } = {}) {
  const apiBase = apiURLresolve();
  const url = new URL(`${apiBase}/api/products`);
  url.searchParams.set("samples", samples ? "true" : "false");

  const res = await fetch(url);
  console.log("Fetch stock response:", res);
  if (!res.ok) throw new Error(`Failed to fetch stock: ${res.status}`);
  return res.json();
}
