import useWebsiteConfig from "../../hooks/useWebsiteConfig.js";

export default function ProductTags({ soldOut, few }) {
  const { config } = useWebsiteConfig();
  const tags = config?.productsTags ?? {};

  if (soldOut) {
    return (
      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
        {tags.soldOut ?? "Sold Out"}
      </span>
    );
  }

  if (few) {
    return (
      <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
        {tags.few ?? "Limited"}
      </span>
    );
  }

  return null;
}
