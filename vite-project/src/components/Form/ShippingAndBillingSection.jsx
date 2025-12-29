import AddressSection from "./AddressSection.jsx";
import CheckBoxField from "./CheckBoxField.jsx";

export default function ShippingAndBillingSection({
  form,
  errors,
  countries,
  onChange,
}) {
  return (
    <div className="space-y-6">
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
