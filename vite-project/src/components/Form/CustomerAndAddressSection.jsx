import InputField from "../InputFieldComponent.jsx";
import PhonePicker from "./PhonePicker.jsx";
import AddressSection from "./AddressSection.jsx";
import CheckBoxField from "./CheckBoxField.jsx";

export default function CustomerAndAddressSection({
  form,
  errors,
  countries,
  onChange,
}) {
  return (
    <div className="space-y-10">
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
    </div>
  );
}
