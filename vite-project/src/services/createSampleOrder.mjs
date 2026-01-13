import apiURLresolve from "./apiURLresolve";

export default async function createSampleOrder(form) {
  console.log("🔵 createSampleOrder() CALLED with form:", form);

  try {
    // 1. Resolve API base URL
    const url = apiURLresolve();
    console.log("🌍 Using API URL:", url);

    // 2. Fetch all products / stock
    console.log("📦 Fetching stock from:", `${url}/api/stock`);
    const productsRes = await fetch(`${url}/api/stock`);

    console.log("📦 Stock Response status:", productsRes.status);
    if (!productsRes.ok) throw new Error("Failed to fetch products");

    const products = await productsRes.json();
    console.log("📦 Products received:", products);

    // 3. Find the sample product
    let sampleProduct =
      products.find((p) => p.isSample) ||
      products.find((p) => p.name.toLowerCase().includes("sample")) ||
      products.find((p) => p.id === 5); // fallback ID

    console.log("🔍 Sample product selected:", sampleProduct);

    if (!sampleProduct) {
      console.error("❌ Sample product not found. Products:", products);
      throw new Error("Sample product not found");
    }

    // 4. Build order payload
    const orderPayload = {
      isSample: true,
      name: form.fullName,
      email: form.email,
      amount_total: sampleProduct.price + 10,
      phone: `${form.dialCode} ${form.phone}`,
      currency: "eur",
      payment_id: "pi-sample",
      items: [
        {
          id: sampleProduct.id,
          name: sampleProduct.name,
          quantity: 1,
          unit_amount: sampleProduct.price,
        },
      ],
      metadata: {
        shipping_cost_cents: 1000,
        email: form.email,
        full_name: form.fullName,
        phone: form.phone,
        billing_same_as_shipping: true,
        shipping_address: {
          name: form.fullName,
          line1: form.address1,
          city: form.city,
          postal_code: form.postcode,
          country: form.country,
          phone: form.phone,
        },
        billing_address: {
          name: form.fullName,
          line1: form.address1,
          city: form.city,
          postal_code: form.postcode,
          country: form.country,
          phone: form.phone,
        },
      },
    };

    console.log("📝 Order payload built:", orderPayload);

    // 5. POST order
    console.log("📤 Sending order to:", `${url}/api/orders`);
    const orderRes = await fetch(`${url}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    console.log("📤 Order response status:", orderRes.status);

    if (!orderRes.ok) {
      const errMessage = await orderRes.text();
      console.error("❌ Order creation FAILED. Response:", errMessage);
      throw new Error("Failed creating sample order");
    }

    const orderData = await orderRes.json();
    console.log("✅ Sample order CREATED:", orderData);

    return orderData;
  } catch (err) {
    console.error("🔥 Sample order error:", err);
    throw err;
  }
}
