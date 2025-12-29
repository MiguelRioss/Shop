import { Link } from "react-router-dom";
import CustomerAndAddressSection from "../Form/CustomerAndAddressSection.jsx";
import CheckBoxField from "../Form/CheckBoxField.jsx";
import Button from "../UtilsComponent/Button.jsx";

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
        {/* CUSTOMER + ADDRESS */}
        <CustomerAndAddressSection
          form={form}
          errors={errors}
          countries={countries}
          onChange={onChange}
        />

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
            className="px-5 py-3 rounded-lg text-base font-semibold disabled:bg-gray-300 disabled:opacity-70 disabled:cursor-not-allowed"
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
