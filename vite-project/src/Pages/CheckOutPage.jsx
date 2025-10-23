import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext.jsx";
import { createCheckoutSession } from "../services/createCheckOutSession.js";
import {
  handleFormChange,
  validateCheckoutForm,
} from "../services/checkOutFormHelper.js";
import CheckoutForm from "../components/CheckOut/CheckoutForm.jsx";
import ProductSummary from "../components/CheckOut/CheckoutSummary.jsx";
import { useContext } from "react";
import { ErrorContext } from "../components/ErrorContext.jsx";
import { countries as countryData } from "country-data";
import useWebsiteConfig from "../hooks/useWebsiteConfig.js";

const countries = [
  { code: "", name: "Choose...", dial: "" },
  ...countryData.all
    // remove confusing or duplicate territories
    .filter(
      (c) =>
        ![
          "UM", // United States Minor Outlying Islands
          "VI", // U.S. Virgin Islands
          "GU", // Guam
          "MP", // Northern Mariana Islands
          "AS", // American Samoa
        ].includes(c.alpha2)
    )
    .map((c) => {
      const isUS = c.alpha2 === "US";
      return {
        code: c.alpha2,
        name: isUS
          ? "United States (EUA) — Not available for shipping"
          : c.name,
        dial: (c.countryCallingCodes?.[0] || "").trim(),
        disabled: isUS,
      };
    }),
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();
  const { config, loading: configLoading, error: configError } = useWebsiteConfig();
  const shippingPrices = config?.shippingPrices;
  const shippingCostDefaultCents = shippingPrices?.default ?? 0;

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
  React.useEffect(() => {
    if (!form.country || form.dialCode) return;
    const selected = countries.find((c) => c.code === form.country && c.dial);
    if (!selected) return;
    setForm((prev) =>
      prev.dialCode
        ? prev
        : {
            ...prev,
            dialCode: selected.dial,
          }
    );
  }, [form.country, form.dialCode]);

  const fmt = (n) => `\u20AC${(n ?? 0).toFixed(2)}`;
  const subtotalAmount = subtotal ?? 0;
  const shippingCostCents = items?.length ? shippingCostDefaultCents : 0;
  const shippingCost = shippingCostCents / 100;
  const total = subtotalAmount + shippingCost;

  const onChange = (e) => handleFormChange(e, countries, setForm);
  const validate = () => validateCheckoutForm(form, setErrors);
  const { setError } = useContext(ErrorContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items?.length || !validate()) return;

    setSubmitting(true);
    try {
      if (form.country === "US") {
        alert("We currently cannot ship to the United States (EUA).");
        return;
      }
      const { url } = await createCheckoutSession({
        items,
        form,
        shippingCostCents: shippingCostDefaultCents,
      });
      console.log(url);

      window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);

      let userMessage = err.message;

      setError({ status: err.status || 500, message: userMessage });
    } finally {
      setSubmitting(false);
    }
  };

  if (configLoading && !shippingPrices) {
    return (
      <section className="bg-[#fcfcf6] min-h-screen py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-600">Loading checkout…</p>
        </div>
      </section>
    );
  }

  if (configError) {
    return (
      <section className="bg-[#fcfcf6] min-h-screen py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-red-600">
            We could not load checkout configuration. Please refresh and try again.
          </p>
        </div>
      </section>
    );
  }

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
