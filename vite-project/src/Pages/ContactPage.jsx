import React from "react";
import Button from "../components/UtilsComponent/Button.jsx";
import { Link } from "react-router-dom";

function SubjectSelect({ label = "Subject", value, onChange, options = [] }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(() => Math.max(0, options.findIndex((o) => o === value)));
  const wrapRef = React.useRef(null);

  React.useEffect(() => {
    function onDocClick(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  React.useEffect(() => {
    setActive(Math.max(0, options.findIndex((o) => o === value)));
  }, [value, options]);

  const choose = (val) => {
    if (typeof onChange === "function") onChange({ target: { name: "subject", value: val } });
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " " )) {
      setOpen(true);
      e.preventDefault();
      return;
    }
    if (open) {
      if (e.key === "ArrowDown") {
        setActive((i) => Math.min(options.length - 1, i + 1));
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setActive((i) => Math.max(0, i - 1));
        e.preventDefault();
      } else if (e.key === "Enter") {
        choose(options[active]);
        e.preventDefault();
      } else if (e.key === "Escape") {
        setOpen(false);
        e.preventDefault();
      }
    }
  };

  return (
    <div ref={wrapRef} className="w-full">
      <label className="block text-sm font-medium text-gray-800">{label}</label>
      <div className="mt-1 relative">
        <button
          type="button"
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 pr-9 text-left outline-none focus:ring-2 focus:ring-[var(--brand-from)]"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onKeyDown}
        >
          <span>{value}</span>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">▾</span>
        </button>
        {open && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 z-30 mt-1 max-h-56 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none"
          >
            {options.map((opt, i) => (
              <li
                key={opt}
                role="option"
                aria-selected={value === opt}
                className={[
                  "px-3 py-2 cursor-pointer",
                  i === active ? "bg-[var(--brand)]/10 text-gray-900" : "text-gray-800 hover:bg-black/5",
                ].join(" ")}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(opt)}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const subjects = [
    "General enquiry",
    "Order support",
    "Country missing at checkout? We'll help",
    "Feedback",
  ];

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    subject: subjects[0],
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
    } catch {}

    const to = "info@mesodose.com";
    const subject = encodeURIComponent(`MesoConnect - ${form.subject}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCountry: ${form.country}\nOrder ID: ${form.orderId}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  return (
    <main className="bg-[var(--secondBackground)] min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl text-gray-900">MesoConnect</h1>
        <p className="mt-2 text-gray-700">We'd love to hear from you. Send us a message and we will get back within 1–2 business days.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-800">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
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
                autoComplete="email"
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
                autoComplete="country-name"
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
                autoComplete="off"
                value={form.orderId}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand-from)]"
              />
            </div>
          </div>

          <SubjectSelect label="Subject" value={form.subject} onChange={onChange} options={subjects} />

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
            <p className="text-sm text-green-700">Thanks! Your email client may open. We'll reply soon.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600">Please fill name, email, and message.</p>
          )}
        </form>
      </div>
    </main>
  );
}

