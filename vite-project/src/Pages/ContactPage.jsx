import React from "react";
import Button from "../components/UtilsComponent/Button.jsx";
import { Link } from "react-router-dom";
export default function ContactPage() {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    subject: "General enquiry",
    message: "",
    orderId: "",
    country: "",
  });
  const [status, setStatus] = React.useState("idle"); // idle | sending | sent | error

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    // Try optional API first (if present in your hosting setup)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
    } catch (_) {
      // ignore; fallback to mailto below
    }

    // Fallback: open email client
    const to = "info@mesodose.com";
    const subject = encodeURIComponent(`MesoConnect — ${form.subject}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nCountry: ${form.country}\nOrder ID: ${form.orderId}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  return (
    <main className="bg-[var(--secondBackground)] min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl text-gray-900">MesoConnect</h1>
        <p className="mt-2 text-gray-700">We\'d love to hear from you. Send us a message and we will get back within 1–2 business days.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-800">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand-from)]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand-from)]"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-800">Country (optional)</label>
              <input
                id="country"
                name="country"
                type="text"
                value={form.country}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand-from)]"
              />
            </div>
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-800">Order ID (optional)</label>
              <input
                id="orderId"
                name="orderId"
                type="text"
                value={form.orderId}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand-from)]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-800">Subject</label>
            <select
              id="subject"
              name="subject"
              value={form.subject}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand-from)]"
            >
              <option>General enquiry</option>
              <option>Order support</option>
              <option>Wholesale</option>
              <option>Feedback</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-800">Message</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              value={form.message}
              onChange={onChange}
              className="mt-1 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand-from)]"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-600">
              By submitting, you agree to our <Link to="/legal#privacy-policy" className="underline">Privacy Policy</Link>.
            </p>
            <Button type="submit" className="px-7 py-3 text-sm font-semibold" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send Message"}
            </Button>
          </div>

          {status === "sent" && (
            <p className="text-sm text-green-700">Thanks! Your email client may open. We\'ll reply soon.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600">Please fill name, email, and message.</p>
          )}
        </form>
      </div>
    </main>
  );
}
