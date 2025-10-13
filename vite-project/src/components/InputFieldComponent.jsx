/**
 * Generic input field component
 * Supports inline error message display, optional placeholder, and custom className
 */
function InputField({
  label,
  name,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder = "",
  error,
  className = "",
}) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-800"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand-from)] ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />

      {error && (
        <p className="text-xs text-red-500 mt-1 leading-tight">{error}</p>
      )}
    </div>
  );
}

export default InputField;
