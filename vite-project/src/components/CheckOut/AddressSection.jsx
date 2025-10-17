import InputField from "../InputFieldComponent.jsx";

/**
 * Generic address section used for both Shipping and Billing.
 *
 * Props:
 * - title: "Shipping address" or "Billing address"
 * - prefix: "" or "billing" (used to prefix field names)
 * - form, errors, onChange, countries
 */
export default function AddressSection({
  title,
  prefix = "",
  form,
  errors,
  onChange,
  countries,
}) {
  // Compute key names dynamically (billing vs normal)
  const key = (name) =>
    prefix ? `${prefix}${name.charAt(0).toUpperCase()}${name.slice(1)}` : name;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <InputField
          label="Address line 1"
          name={key("address1")}
          required
          value={form[key("address1")]}
          onChange={onChange}
          error={errors[key("address1")]}
          className="sm:col-span-2"
        />

        <InputField
          label="Address line 2 (optional)"
          name={key("address2")}
          value={form[key("address2")]}
          onChange={onChange}
        />

        <InputField
          label="City"
          name={key("city")}
          required
          value={form[key("city")]}
          onChange={onChange}
          error={errors[key("city")]}
        />

        <InputField
          label="Postcode"
          name={key("postcode")}
          required
          value={form[key("postcode")]}
          onChange={onChange}
          error={errors[key("postcode")]}
        />

        {/* ✅ COUNTRY DROPDOWN FIXED */}
        <div className="sm:col-span-2">
          <label
            htmlFor={key("country")}
            className="block text-sm font-medium text-gray-700"
          >
            Country *
          </label>
          <select
            id={key("country")}
            name={key("country")}
            value={form[key("country")]}
            onChange={onChange}
            required
            className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 ${
              errors[key("country")] ? "border-red-400" : "border-gray-300"
            }`}
          >
            {/* Default option */}
            <option value="">Select country…</option>

            {countries.map((c) => (
              <option
                key={c.code}
                value={c.code}
                disabled={c.disabled}
                className={c.disabled ? "text-gray-400 italic" : ""}
              >
                {c.name}
              </option>
            ))}
          </select>

          {errors[key("country")] && (
            <p className="text-xs text-red-500 mt-1">
              {errors[key("country")]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
