import apiURLresolve from "./apiURLresolve";

/**
 * Valida no backend e, se válido, aplica no CartContext.
 * @param {string} code
 * @param {Function} applyCode
 * @param {number} [percent=10]  // <- hardcoded default
 */
export async function validateAndApplyPromo(code, applyCode, percent = 10) {
  const normalized = String(code || "")
    .trim()
    .toUpperCase();
  if (!normalized) return { ok: false, reason: "EMPTY" };

  // 1) valida via API (com percent hardcoded)
  const promo = await validatePromoViaApi(normalized, percent);
  console.log("HERE is the promo",promo)
  if (!promo) return { ok: false, reason: "INVALID" };

  // 2) aplica no CartContext
  const result = await applyCode(normalized, async () => promo);
  return result?.ok ? { ok: true } : { ok: false, reason: "APPLY_FAILED" };
}
const API_BASE = apiURLresolve()

/**
 * POST /api/validatePromoCode
 * Body (default): { code, value: 10, percent: 10, discountPercent: 10 }
 * Accepts API responses:
 *   A) Raw promo object (your example)
 *   B) { ok: true, promo: { ... } }
 * Returns { type: "percent"|"fixed", value: number, label?: string, code?: string } or null.
 */
export async function validatePromoViaApi(code, percent = 10) {
  const endpoint = `${API_BASE}/api/validatePromoCode`;

  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return null;

  const p = Math.trunc(Number(percent)) || 10;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // remove if you don't use cookies
    body: JSON.stringify({
      code: normalized,
      value: p,
      percent: p,
      discountPercent: p,
    }),
  });

  if (!res.ok) return null;

  const data = await res.json().catch(() => null);
  if (!data) return null;

  // Support both shapes
  const promo = data.ok && data.promo ? data.promo : data;

  // --- Map your API fields ---
  const apiType = String(promo.type || "").toLowerCase();       // e.g., "percentage"
  const codeOut = promo.code || normalized;
  const labelOut = promo.name || codeOut;

  if (apiType === "percentage") {
    // Prefer discountPercentage; fallback to value
    const pct =
      (Number.isFinite(Number(promo.discountPercentage)) && Number(promo.discountPercentage)) ||
      (Number.isFinite(Number(promo.value)) && Number(promo.value)) ||
      null;

    if (pct != null) {
      const pv = Math.trunc(pct);
      return {
        type: "percent",
        value: pv,
        label: labelOut || `-${pv}%`,
        code: codeOut,
      };
    }
  }

  // If your API ever returns fixed-amount promos (in cents or euros), handle here:
  // Try amountCents first, then value (as euros) if clearly not a percent type.
  const amountCents =
    (Number.isFinite(Number(promo.amount_cents)) && Number(promo.amount_cents)) ||
    (Number.isFinite(Number(promo.amountCents)) && Number(promo.amountCents)) ||
    null;

  if (amountCents && amountCents > 0) {
    const euros = amountCents / 100;
    return {
      type: "fixed",
      value: euros,
      label: labelOut || `-€${euros.toFixed(2)}`,
      code: codeOut,
    };
  }

  // As a last fallback (non-percentage, non-cents) treat value as euros if present
  if (apiType !== "percentage" && Number.isFinite(Number(promo.value)) && Number(promo.value) > 0) {
    const euros = Number(promo.value);
    return {
      type: "fixed",
      value: euros,
      label: labelOut || `-€${euros.toFixed(2)}`,
      code: codeOut,
    };
  }

  return null;
}