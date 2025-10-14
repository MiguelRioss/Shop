import { Link } from "react-router-dom";
import InputField from "../InputFieldComponent.jsx";
import PhonePicker from "./PhonePicker.jsx";
import AddressSection from "./AddressSection.jsx";
import CheckBoxField from "./CheckBoxField.jsx";
import Button from "../UtilsComponent/Button.jsx";

/**
 * CheckoutForm
 * Encapsulates all form sections on the left side of the Checkout page.
 *
 * Props:
 * - form, errors, items, submitting
 * - countries, onChange, handleSubmit
 */
export default function CheckoutForm({
  form,
  errors,
  items,
  countries,
  onChange,
  handleSubmit,
  submitting,
}) {
  return (
    <div className="lg:col-span-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-8"
      >
        {/* CUSTOMER DETAILS */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Customer details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <InputField
              label="Full name"
              name="fullName"
              required
              value={form.fullName}
              onChange={onChange}
              error={errors.fullName}
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={onChange}
              error={errors.email}
            />

            {/* PHONE */}
            <PhonePicker
              form={form}
              errors={errors}
              onChange={onChange}
              countries={countries}
            />

            <InputField
              label="Notes (optional)"
              name="notes"
              value={form.notes}
              onChange={onChange}
            />
          </div>
        </div>

        {/* SHIPPING ADDRESS */}
        <AddressSection
          title="Shipping address"
          prefix=""
          form={form}
          errors={errors}
          onChange={onChange}
          countries={countries}
        />

        {/* BILLING SAME AS SHIPPING */}
        <CheckBoxField
          name="billingSame"
          label="Billing address is the same as shipping"
          checked={form.billingSame}
          onChange={onChange}
        />

        {/* BILLING ADDRESS (conditional) */}
        {!form.billingSame && (
          <AddressSection
            title="Billing address"
            prefix="billing"
            form={form}
            errors={errors}
            onChange={onChange}
            countries={countries}
          />
        )}

        {/* NEWSLETTER */}
        <CheckBoxField
          name="subscribe"
          label="Subscribe to our newsletter"
          checked={form.subscribe}
          onChange={onChange}
        />

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={submitting || !items?.length}
            className={`px-5 py-3 rounded-lg text-base font-semibold disabled:bg-gray-300 disabled:opacity-70 disabled:cursor-not-allowed`}
            style={
              submitting || !items?.length
                ? undefined
                : {
                    background:
                      "linear-gradient(to right, var(--brand-from), var(--brand-to))",
                  }
            }
          >
            {submitting ? "Creating..." : "Create Order"}
          </Button>
          <Link to="/cart" className="text-sm text-gray-600 hover:underline">
            Back to cart
          </Link>
        </div>
      </form>
    </div>
  );
}
