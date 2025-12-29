import CheckBoxField from "./CheckBoxField.jsx";

export default function BillingToggle({ form, onChange }) {
  return (
    <CheckBoxField
      name="billingSame"
      label="Billing address is the same as shipping"
      checked={form.billingSame}
      onChange={onChange}
    />
  );
}
