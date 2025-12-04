import { Helmet } from "react-helmet-async";

export default function GlobalSchema() {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Mesodose",
          "url": "https://mesodose.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://mesodose.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
}
