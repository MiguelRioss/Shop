import { Helmet } from "react-helmet-async";

export default function GlobalSchema() {
  const baseUrl = "https://mesodose.com";
  const logoUrl = `${baseUrl}/logoIcon.png`;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Mesodose",
          "url": baseUrl,
          "publisher": {
            "@type": "Organization",
            "name": "Mesodose",
            "url": baseUrl,
            "logo": {
              "@type": "ImageObject",
              "url": logoUrl,
            },
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://mesodose.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Mesodose",
          "url": baseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": logoUrl,
          },
        })}
      </script>
    </Helmet>
  );
}
