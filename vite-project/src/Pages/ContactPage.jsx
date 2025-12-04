import React from "react";
import Button from "../components/UtilsComponent/Button.jsx";
import { Link } from "react-router-dom";
import SubjectSelect from "../components/SubjectSelect.jsx";
import InputField from "../components/InputFieldComponent.jsx";
import { useLocation } from "react-router-dom";

// Add default props or safe access
export default function ContactPage({ contactUsInfo = {} }) {
  const location = useLocation();
  
  // Safe access with defaults
  const safeContactUsInfo = contactUsInfo || {};
  const fields = safeContactUsInfo.fields || [];
  const api = safeContactUsInfo.api || {};
  
  const queryParams = new URLSearchParams(location.search);
  const subjectField = fields.find((f) => f.name === "subject");
  const subjectOptions = subjectField?.options ?? [];
  const fallbackSubject = subjectOptions[0] || "";
  
  const subjectFromQuery = queryParams.get("subject");
  const initialSubject = subjectFromQuery && subjectOptions.includes(subjectFromQuery)
    ? subjectFromQuery
    : (subjectOptions.includes(decodeURIComponent(subjectFromQuery || "")) 
        ? decodeURIComponent(subjectFromQuery) 
        : fallbackSubject);
  
  const initialOrderId = decodeURIComponent(queryParams.get("orderId") || "");
  const initialName = decodeURIComponent(queryParams.get("name") || "");
  const initialEmail = decodeURIComponent(queryParams.get("email") || "");

  const nameField = fields.find((f) => f.name === "name");
  const emailField = fields.find((f) => f.name === "email");
  const orderField = fields.find((f) => f.name === "orderId");
  const messageField = fields.find((f) => f.name === "message");
  const subscribeField = fields.find((f) => f.name === "subscribe");
  
  const nameFieldProps =
    nameField ?? { label: "Name", name: "name", type: "text", required: true };
  const emailFieldProps =
    emailField ?? {
      label: "Email",
      name: "email",
      type: "email",
      required: true,
    };
  const orderFieldProps =
    orderField ?? { label: "Order ID", name: "orderId", type: "text" };
  const messageLabel = messageField?.label ?? "Message";
  const subscribeLabel =
    subscribeField?.label ?? "Subscribe to our newsletter";

  const [form, setForm] = React.useState(() => ({
    name: initialName,
    email: initialEmail,
    subject: initialSubject,
    message: "",
    orderId: initialOrderId,
    subscribe: true,
  }));

  React.useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: initialName || prev.name,
      email: initialEmail || prev.email,
      subject: initialSubject,
      orderId: initialOrderId,
    }));
  }, [initialSubject, initialOrderId, initialName, initialEmail]);

  const [status, setStatus] = React.useState("idle");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
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
      const to = api.fallbackEmail || "support@example.com";
      const subject = encodeURIComponent(`MesoConnect - ${form.subject}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nOrder ID: ${form.orderId}\n\nMessage:\n${form.message}`
      );
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
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
          {safeContactUsInfo.intro || "We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          {/* Name + Email */}
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

          {/* Subject dropdown */}
          <SubjectSelect
            name="subject"
            label={subjectField?.label || "Subject"}
            value={form.subject}
            options={subjectOptions}
            onChange={onChange}
          />

          {/* Message */}
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

          {/* Newsletter */}
          <div className="border rounded-lg p-4">
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="subscribe"
                checked={form.subscribe}
                onChange={onChange}
                className="h-4 w-4"
              />
              <span className="text-sm text-gray-800">
                {subscribeLabel}
              </span>
            </label>
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-600">
              {safeContactUsInfo.privacyNote || "We'll get back to you soon."}{" "}
              <Link to={safeContactUsInfo.privacyHref || "/privacy"} className="underline">
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
                ? (safeContactUsInfo.submitButton?.sendingLabel || "Sending...")
                : (safeContactUsInfo.submitButton?.label || "Send Message")}
            </Button>
          </div>

          {status === "sent" && (
            <p className="text-sm text-green-700">
              {safeContactUsInfo.successMessage || "Message sent successfully!"}
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600">
              {safeContactUsInfo.errorMessage || "Please fill in all required fields."}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}