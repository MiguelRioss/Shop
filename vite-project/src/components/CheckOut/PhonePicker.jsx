import InputField from "../InputFieldComponent.jsx";

/**
 * PhonePicker Component
 * Combines country dial code select + phone number input
 *
 * Props:
 * - form, errors, onChange, countries
 */
export default function PhonePicker({ form, errors, onChange, countries }) {
  return (
    <div className="sm:col-span-2">
      <label className="block text-sm font-medium text-gray-700">
        Phone <span className="text-red-500">*</span>
      </label>

      <div className="flex gap-2">
        {/* Dial Code Select */}
        <select
          name="dialCode"
          value={form.dialCode}
          onChange={onChange}
          className="mt-1 w-28 rounded-lg border border-gray-300 px-2 py-2 outline-none focus:ring-2 focus:ring-black/10"
        >
          <option value="">Code</option>
          {countries
            .filter((c) => c.dial)
            .map((c) => (
              <option key={c.code} value={c.dial} disabled={c.disabled}>
                {c.dial} {c.name === "Choose..." ? "" : `(${c.name})`}
              </option>
            ))}
        </select>

        {/* Phone Input */}
        <InputField
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder="928269577"
          error={errors.phone}
          className="flex-1"
        />
      </div>

      {errors.phone && (
        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
      )}
    </div>
  );
}
