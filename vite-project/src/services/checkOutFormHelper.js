/**
 * formHandlers.js
 * ----------------
 * Shared utilities for form state management and validation.
 */

/**
 * Handles change events for forms that include both country and dialCode fields.
 */
export function handleFormChange(e, countries, setForm) {
  const { name, value, type, checked } = e.target;

  setForm((prev) => {
    const next = { ...prev, [name]: type === "checkbox" ? checked : value };

    // --- When user selects a country ---
    if (name === "country") {
      const selected = countries.find((c) => c.code === value);
      if (selected?.dial) {
        const currentCountry = countries.find(
          (c) => c.dial === prev.dialCode
        );
        const shouldUpdateDial =
          !prev.dialCode || (currentCountry && currentCountry.code === prev.country);

        if (shouldUpdateDial) {
          next.dialCode = selected.dial;
        }
      }
    }

    // --- When user selects a dial code ---
    if (name === "dialCode") {
      // Do not force the country to match — let the user mix freely
      // Only ensure the dial code value is updated
      next.dialCode = value;
    }

    return next;
  });
}

/**
 * Adds a field-level validation rule to the error bag.
 */
export function requireField(form, cond, key, msg, bag) {
  if (cond && !String(form[key] || "").trim()) bag[key] = msg;
}

/**
 * Validates checkout form fields.
 * @returns {boolean} true if valid, false otherwise.
 */
export function validateCheckoutForm(form, setErrors) {
  const e = {};

  // Customer
  requireField(form, true, "fullName", "Required", e);
  if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
  requireField(form, true, "phone", "Required", e);
  if (form.phone && !/^[0-9\s()+-]+$/.test(form.phone))
    e.phone = "Invalid phone format";

  // Shipping
  requireField(form, true, "address1", "Required", e);
  requireField(form, true, "city", "Required", e);
  requireField(form, true, "postcode", "Required", e);
  if (!form.country) e.country = "Required";

  // Billing (if not same)
  if (!form.billingSame) {
    requireField(form, true, "billingAddress1", "Required", e);
    requireField(form, true, "billingCity", "Required", e);
    requireField(form, true, "billingPostcode", "Required", e);
    if (!form.billingCountry) e.billingCountry = "Required";
  }

  setErrors(e);
  return Object.keys(e).length === 0;
}

