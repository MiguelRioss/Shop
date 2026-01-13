import { countries as countryData } from "country-data";

const countryOptions = [
  { code: "", name: "Choose...", dial: "" },
  ...countryData.all
    .filter((country) => !["UM", "VI", "GU", "MP", "AS"].includes(country.alpha2))
    .map((country) => {
      const isUnitedStates = country.alpha2 === "US";
      return {
        code: country.alpha2,
        name: isUnitedStates
          ? "United States (EUA) - Not available for shipping"
          : country.name,
        dial: (country.countryCallingCodes?.[0] || "").trim(),
        disabled: isUnitedStates,
      };
    }),
];

export default countryOptions;
