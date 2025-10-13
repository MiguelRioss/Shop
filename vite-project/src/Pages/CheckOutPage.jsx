  import React from "react";
  import { useNavigate } from "react-router-dom";
  import { useCart } from "../components/CartContext.jsx";
  import { createCheckoutSession } from "../services/createCheckOutSession.js";
  import { subscribeUser } from "../services/subscribeUser.js";
  import {
    handleFormChange,
    validateCheckoutForm,
  } from "../services/checkOutFormHelper.js";
  import CheckoutForm from "../components/CheckOut/CheckoutForm.jsx";
  import ProductSummary from "../components/CheckOut/CheckoutSummary.jsx";

  const SHIPPING_COST_CENTS = 1000;

  const countries = [
    { code: "", name: "Choose...", dial: "" },
    { code: "AU", name: "Australia", dial: "+61" },
    { code: "BR", name: "Brazil", dial: "+55" },
    { code: "CA", name: "Canada", dial: "+1" },
    { code: "CR", name: "Costa Rica", dial: "+506" },
    { code: "DE", name: "Germany", dial: "+49" },
    { code: "MX", name: "Mexico", dial: "+52" },
    { code: "NL", name: "Netherlands", dial: "+31" },
    { code: "NZ", name: "New Zealand", dial: "+64" },
    { code: "PT", name: "Portugal", dial: "+351" },
    { code: "ZA", name: "South Africa", dial: "+27" },
    { code: "UY", name: "Uruguay", dial: "+598" },
  ];

  export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, subtotal } = useCart();

    React.useEffect(() => {
      if (!items?.length) {
        // navigate("/cart");
      }
    }, [items]);

    const [form, setForm] = React.useState({
      fullName: "",
      email: "",
      dialCode: "",
      phone: "",
      notes: "",
      address1: "",
      address2: "",
      city: "",
      postcode: "",
      country: "",
      billingSame: true,
      billingAddress1: "",
      billingAddress2: "",
      billingCity: "",
      billingPostcode: "",
      billingCountry: "",
      subscribe: true,
    });

    const [errors, setErrors] = React.useState({});
    const [submitting, setSubmitting] = React.useState(false);

    const fmt = (n) => `\u20AC${(n ?? 0).toFixed(2)}`;
    const subtotalAmount = subtotal ?? 0;
    const shippingCost = items?.length ? SHIPPING_COST_CENTS / 100 : 0;
    const total = subtotalAmount + shippingCost;

    const onChange = (e) => handleFormChange(e, countries, setForm);
    const validate = () => validateCheckoutForm(form, setErrors);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!items?.length || !validate()) return;

      setSubmitting(true);
      try {
        const { success, url, error } = await createCheckoutSession({
          items,
          form,
          shippingCostCents: SHIPPING_COST_CENTS,
        });

        if (form.subscribe) {
          await subscribeUser({
            email: form.email,
            fullName: form.fullName,
            dialCode: form.dialCode,
            phone: form.phone,
          });
        }

        if (success && url) {
          console.log("✅ Redirecting to Stripe...");
          setTimeout(() => (window.location.href = url), 1000);
        } else {
          alert(error || "Payment error. Please try again.");
        }
      } catch (err) {
        console.error("❌ Unexpected checkout error:", err);
        alert("Unexpected error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <section className="bg-[#fcfcf6] min-h-screen py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600 mb-8">
            Please review your order and enter your details to create the order.
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            <CheckoutForm
              form={form}
              errors={errors}
              items={items}
              countries={countries}
              onChange={onChange}
              handleSubmit={handleSubmit}
              submitting={submitting}
            />
            <ProductSummary
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              fmt={fmt}
            />
          </div>
        </div>
      </section>
    );
  }
