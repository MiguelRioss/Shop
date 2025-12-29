import InputField from "../InputFieldComponent.jsx";
import PhonePicker from "./PhonePicker.jsx";

export default function CustomerDetailsSection({
  form,
  errors,
  countries,
  onChange,
}) {
  return (
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
  );
}
