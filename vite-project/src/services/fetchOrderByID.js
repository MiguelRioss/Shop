import apiURLresolve from "./apiURLresolve";

// src/services/fetchStock.js
export default async function fetchOrderByID(sessionId) {
    const apiBase = apiURLresolve()
    const res = await fetch(`${apiBase}/api/orders/${sessionId}`);
    console.log(res)
    if (!res.ok) throw new Error(`Failed to fetch stock: ${res.status}`);
    return res.json(); // expect { id: { stockValue, name, ... }, ... }
}
