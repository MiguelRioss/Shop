import React from "react";
import Button from "../components/UtilsComponent/Button.jsx";
import { Link } from "react-router-dom";
import SubjectSelect from "../components/SubjectSelect.jsx";
import InputField from "../components/InputFieldComponent.jsx";
import { useLocation } from "react-router-dom";

export default function ContactPage({ contactUsInfo }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSubject = queryParams.get("subject");

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    subject: 
      initialSubject ||
      contactUsInfo.fields.find((f) => f.name === "subject").options[0],
    message: "",
    orderId: "",
    country: "",
    subscribe: false,
  });

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
      const res = await fetch(contactUsInfo.api.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();

      if (form.subscribe) {
        await fetch(contactUsInfo.api.subscribeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, fullName: form.name }),
        });
      }

      setStatus("sent");
    } catch (err) {
      const to = contactUsInfo.api.fallbackEmail;
      const subject = encodeURIComponent(`MesoConnect - ${form.subject}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nCountry: ${form.country}\nOrder ID: ${form.orderId}\n\nMessage:\n${form.message}`
      );
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      setStatus("sent");
    }
  }

  return (
    <main className="bg-[var(--secondBackground)] min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl text-gray-900">
          {contactUsInfo.title}
        </h1>
        <p className="mt-2 text-gray-700">{contactUsInfo.intro}</p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          {/* Name + Email */}
          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              {...contactUsInfo.fields[0]}
              value={form.name}
              onChange={onChange}
            />
            <InputField
              {...contactUsInfo.fields[1]}
              value={form.email}
              onChange={onChange}
            />
          </div>

          {/* Country + Order ID */}
          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              {...contactUsInfo.fields[2]}
              value={form.country}
              onChange={onChange}
            />
            <InputField
              {...contactUsInfo.fields[3]}
              value={form.orderId}
              onChange={onChange}
            />
          </div>

          {/* Subject dropdown */}
          <SubjectSelect
            name="subject"
            label={contactUsInfo.fields[4].label}
            value={form.subject}
            options={contactUsInfo.fields[4].options}
            onChange={onChange}
          />

          {/* Message */}
          <label className="block text-sm font-medium text-gray-800">
            {contactUsInfo.fields[5].label}
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
                {contactUsInfo.fields[6].label}
              </span>
            </label>
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-600">
              {contactUsInfo.privacyNote}{" "}
              <Link to={contactUsInfo.privacyHref} className="underline">
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
                ? contactUsInfo.submitButton.sendingLabel
                : contactUsInfo.submitButton.label}
            </Button>
          </div>

          {status === "sent" && (
            <p className="text-sm text-green-700">
              {contactUsInfo.successMessage}
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600">{contactUsInfo.errorMessage}</p>
          )}
        </form>
      </div>
    </main>
  );
}
