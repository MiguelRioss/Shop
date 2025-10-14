import React from "react";

/**
 * Reusable checkbox field
 *
 * Props:
 * - name: form key
 * - label: label text
 * - checked: boolean
 * - onChange: handler
 * - className: optional wrapper class
 */
export default function CheckBoxField({
  name,
  label,
  checked,
  onChange,
  className = "",
}) {
  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <label className="inline-flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 accent-[var(--brand-from)]"
        />
        <span className="text-sm text-gray-800">{label}</span>
      </label>
    </div>
  );
}
