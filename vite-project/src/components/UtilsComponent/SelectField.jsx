import React from "react";

function normalizeOptions(options, optionLabel, optionValue) {
  if (!Array.isArray(options)) return [];
  return options.map((opt, index) => {
    if (
      opt !== null &&
      typeof opt === "object" &&
      Object.prototype.hasOwnProperty.call(opt, optionLabel)
    ) {
      const extractedValue = opt[optionValue];
      return {
        key: opt.id ?? extractedValue ?? index,
        label: String(opt[optionLabel]),
        value: extractedValue,
      };
    }
    return {
      key: index,
      label: String(opt),
      value: opt,
    };
  });
}

const SelectField = React.forwardRef(function SelectField(
  {
    id,
    name,
    label,
    hideLabel = false,
    options = [],
    optionLabel = "label",
    optionValue = "value",
    placeholder,
    value,
    onChange,
    className = "",
    containerClass = "",
    labelClassName = "",
    arrowClassName = "",
    ...rest
  },
  ref
) {
  const normalized = normalizeOptions(options, optionLabel, optionValue);
  const stringValue =
    value === undefined || value === null ? "" : String(value);

  const composedContainer = ["inline-flex flex-col", containerClass]
    .filter(Boolean)
    .join(" ");
  const composedLabel = [
    hideLabel ? "sr-only" : "mb-1 text-sm font-medium text-gray-700",
    labelClassName,
  ]
    .filter(Boolean)
    .join(" ");
  const composedSelect = [
    "block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm leading-tight",
    "transition-colors focus:border-[var(--brand-from)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-from)]",
    "pr-10",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const composedArrow = [
    "pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500",
    arrowClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={composedContainer}>
      {label ? (
        <label htmlFor={id} className={composedLabel}>
          {label}
        </label>
      ) : null}

      <div className="relative">
        <select
          id={id}
          name={name}
          ref={ref}
          value={stringValue}
          onChange={onChange}
          className={composedSelect}
          {...rest}
        >
          {placeholder !== undefined ? (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          ) : null}
          {normalized.map(({ key, label: optLabel, value: optValue }) => {
            const optionValueString =
              optValue === undefined || optValue === null
                ? ""
                : String(optValue);
            const optionKey =
              key ?? optionValueString ?? `${optLabel}-${optionValueString}`;
            return (
              <option key={optionKey} value={optionValueString}>
                {optLabel}
              </option>
            );
          })}
        </select>

        <span className={composedArrow} aria-hidden="true">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
});

export default SelectField;
