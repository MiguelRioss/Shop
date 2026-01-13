import React from "react";
import { Helmet } from "react-helmet-async";

export default function HomePageSEO() {
  const baseUrl = "https://mesodose.com";

  // 🔒 Stable homepage OG image (NOT logo)
  const ogImage = `${baseUrl}/images/og/mesodose-home.jpg`;
  const logoUrl = `${baseUrl}/logoIcon.png`;

  const title = "Mesodose – Ibogaine Mesodosing for Calm, Focus & Balance";
  const description =
    "Explore mesodosing with ibogaine through artisanal tinctures designed for calm focus, balance, and functional clarity.";

  return (
    <Helmet>
      {/* ---------- CORE SEO ---------- */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={baseUrl} />
      <meta name="robots" content="index, follow" />

      {/* ---------- OPEN GRAPH (HOMEPAGE ONLY) ---------- */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* ---------- TWITTER ---------- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* ---------- STRUCTURED DATA: ORGANIZATION ---------- */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Mesodose",
          url: baseUrl,
          logo: logoUrl,
          description:
            "Mesodose crafts ibogaine tinctures and guides for functional, gentle dosing that supports calm, focus, and clarity.",
          sameAs: [
            "https://www.instagram.com/meso_dose/",
            "https://www.facebook.com/groups/1297206078804311/"
          ],
        })}
      </script>

      {/* ---------- STRUCTURED DATA: WEBSITE ---------- */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Mesodose",
          url: baseUrl,
          publisher: {
            "@type": "Organization",
            name: "Mesodose",
            logo: {
              "@type": "ImageObject",
              url: logoUrl,
            },
          },
        })}
      </script>
    </Helmet>
  );
}
