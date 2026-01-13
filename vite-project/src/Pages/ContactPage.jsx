import React from "react";
import Button from "../components/UtilsComponent/Button.jsx";
import { Link } from "react-router-dom";
import SubjectSelect from "../components/SubjectSelect.jsx";
import InputField from "../components/InputFieldComponent.jsx";
import CustomerAndAddressSection from "../components/Form/CustomerAndAddressSection.jsx";
import { useLocation } from "react-router-dom";
import countryOptions from "../constants/countryOptions.js";
import createSampleOrder from "../services/createSampleOrder.mjs";

export default function ContactPage({ contactUsInfo = {} }) {
  const location = useLocation();

  const safeContactUsInfo = contactUsInfo || {};
  const fields = safeContactUsInfo.fields || [];
  const api = safeContactUsInfo.api || {};

  const queryParams = new URLSearchParams(location.search);
  const subjectField = fields.find((f) => f.name === "subject");
  const subjectOptions = subjectField?.options ?? [];
  const fallbackSubject = subjectOptions[0] || "";

  const subjectFromQuery = queryParams.get("subject");
  const initialSubject =
    subjectFromQuery && subjectOptions.includes(subjectFromQuery)
      ? subjectFromQuery
      : subjectOptions.includes(decodeURIComponent(subjectFromQuery || ""))
      ? decodeURIComponent(subjectFromQuery)
      : fallbackSubject;

  const initialOrderId = decodeURIComponent(queryParams.get("orderId") || "");
  const initialName = decodeURIComponent(queryParams.get("name") || "");
  const initialEmail = decodeURIComponent(queryParams.get("email") || "");

  const nameField = fields.find((f) => f.name === "name");
  const emailField = fields.find((f) => f.name === "email");
  const orderField = fields.find((f) => f.name === "orderId");
  const messageField = fields.find((f) => f.name === "message");
  const subscribeField = fields.find((f) => f.name === "subscribe");

  const nameFieldProps = nameField ?? {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  };
  const emailFieldProps = emailField ?? {
    label: "Email",
    name: "email",
    type: "email",
    required: true,
  };
  const orderFieldProps = orderField ?? {
    label: "Order ID",
    name: "orderId",
    type: "text",
  };
  const messageLabel = messageField?.label ?? "Message";
  const subscribeLabel = subscribeField?.label ?? "Subscribe to our newsletter";

  const configuredCountries = safeContactUsInfo.countries;
  const availableCountries = React.useMemo(() => {
    if (Array.isArray(configuredCountries) && configuredCountries.length > 0) {
      return configuredCountries;
    }
    return countryOptions;
  }, [configuredCountries]);

  const [form, setForm] = React.useState(() => ({
    name: initialName,
    fullName: initialName,
    email: initialEmail,
    subject: initialSubject,
    message: "",
    orderId: initialOrderId,
    subscribe: true,
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
  }));

  React.useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: initialName || prev.name,
      fullName: initialName || prev.fullName,
      email: initialEmail || prev.email,
      subject: initialSubject,
      orderId: initialOrderId,
    }));
  }, [initialSubject, initialOrderId, initialName, initialEmail]);

  React.useEffect(() => {
    if (!form.country || form.dialCode) return;
    const selected = availableCountries.find(
      (c) => c.code === form.country && c.dial
    );
    if (!selected) return;
    setForm((prev) =>
      prev.dialCode
        ? prev
        : {
            ...prev,
            dialCode: selected.dial,
          }
    );
  }, [form.country, form.dialCode, availableCountries]);

  const [status, setStatus] = React.useState("idle");
  const isSampleRequest = React.useMemo(() => {
    if (!form.subject) return false;
    const normalized = form.subject.toLowerCase().replace(/\s+/g, "");
    return normalized.includes("10mlsample");
  }, [form.subject]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  async function onSubmit(e) {
    e.preventDefault();
    // Validation for sample vs normal contact
    if (isSampleRequest) {
      const requiredFields = [
        form.fullName,
        form.email,
        form.address1,
        form.city,
        form.postcode,
        form.country,
        form.phone,
      ];

      if (requiredFields.some((f) => !f || f.trim() === "")) {
        setStatus("error");
        return;
      }
    } else {
      if (!form.name || !form.email || !form.message) {
        setStatus("error");
        return;
      }
    }

    setStatus("sending");

    try {
      // ⭐ If this is a sample request, create the order
      if (isSampleRequest) {
        const order = await createSampleOrder(form);
        console.log("Sample order created:", order);
      }

      // Normal contact email flow
      const res = await fetch(api.contactEndpoint || "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      if (form.subscribe) {
        await fetch(api.subscribeEndpoint || "/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, fullName: form.name }),
        });
      }

      setStatus("sent");
    } catch (err) {
      console.error(err);
      setStatus("sent");
    }
  }

  return (
    <main className="bg-[var(--secondBackground)] min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl text-gray-900">
          {safeContactUsInfo.title || "Contact Us"}
        </h1>
        <p className="mt-2 text-gray-700">
          {safeContactUsInfo.intro ||
            "We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          {/* SUBJECT SELECT */}
          <SubjectSelect
            name="subject"
            label={subjectField?.label || "Subject"}
            value={form.subject}
            options={subjectOptions}
            onChange={onChange}
          />

          {/* IF SAMPLE REQUEST, SHOW FULL ADDRESS FORM */}
          {isSampleRequest && (
            <CustomerAndAddressSection
              form={form}
              errors={{}}
              countries={availableCountries}
              onChange={onChange}
            />
          )}

          {/* OTHERWISE SHOW SIMPLE NAME + EMAIL + ORDER */}
          {!isSampleRequest && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  {...nameFieldProps}
                  value={form.name}
                  onChange={onChange}
                />
                <InputField
                  {...emailFieldProps}
                  value={form.email}
                  onChange={onChange}
                />
              </div>

              <InputField
                {...orderFieldProps}
                value={form.orderId}
                onChange={onChange}
              />
            </>
          )}

          {!isSampleRequest && (
            <>
              <label className="block text-sm font-medium text-gray-800">
                {messageLabel}
              </label>
              <textarea
                name="message"
                rows={6}
                required
                value={form.message}
                onChange={onChange}
                className="mt-1 w-full rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand-from)]"
              />
            </>
          )}

          {/* NEWSLETTER */}
          <div className="border rounded-lg p-4">
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="subscribe"
                checked={form.subscribe}
                onChange={onChange}
                className="h-4 w-4"
              />
              <span className="text-sm text-gray-800">{subscribeLabel}</span>
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-600">
              {safeContactUsInfo.privacyNote || "We'll get back to you soon."}{" "}
              <Link
                to={safeContactUsInfo.privacyHref || "/legal#privacy"}
                className="underline"
              >
                Privacy Policy
              </Link>
              .
            </p>

            <Button
              type="submit"
              className="px-7 py-3 text-sm font-semibold"
              disabled={status === "sending"}
            >
              {status === "sending"
                ? safeContactUsInfo.submitButton?.sendingLabel || "Sending..."
                : isSampleRequest
                ? "Enquiry for Sample"
                : safeContactUsInfo.submitButton?.label || "Send Message"}
            </Button>
          </div>

          {status === "sent" && (
            <p className="text-sm text-green-700">
              {safeContactUsInfo.successMessage || "Message sent successfully!"}
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600">
              {safeContactUsInfo.errorMessage ||
                "Please fill in all required fields."}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
