import React from "react";
import { Helmet } from "react-helmet-async";

export default function HomePageSEO() {
  const baseUrl = "https://mesodose.com";
  const logoUrl = `${baseUrl}/logoIcon.png`; // ✅ your permanent logo

  return (
    <Helmet>
      {/* 🔹 Basic SEO */}
      <title>Mesodose – Ibogaine Mesodosing for Calm, Focus & Balance</title>
      <meta
        name="description"
        content="Discover Mesodose — ibogaine tinctures crafted for gentle mesodosing. Explore products, dosing guides, and resources for sustainable clarity and nervous system support."
      />
      <meta
        name="keywords"
        content="mesodose, ibogaine tincture, mesodosing, microdosing, calm focus, nervous system balance, plant medicine, ibotincture, daily dosing, functional clarity"
      />
      <link rel="canonical" href={baseUrl} />
      <meta name="robots" content="index, follow" />

      {/* 🔹 Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:title" content="Mesodose – Ibogaine Mesodosing for Calm, Focus & Balance" />
      <meta
        property="og:description"
        content="Explore ibogaine mesodosing tinctures for calm focus, balance, and sustainable clarity."
      />
      <meta property="og:image" content={logoUrl} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />

      {/* 🔹 Twitter Card */}
      <meta name="twitter:card" content="summary" /> {/* summary = small logo */}
      <meta name="twitter:title" content="Mesodose – Ibogaine Mesodosing for Calm, Focus & Balance" />
      <meta
        name="twitter:description"
        content="Gentle, functional ibogaine tinctures for calm, focus, and balance. Discover Mesodose."
      />
      <meta name="twitter:image" content={logoUrl} />

      {/* 🔹 Structured Data (Organization + Website) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Mesodose",
          url: baseUrl,
          logo: logoUrl,
          sameAs: [
            "https://www.instagram.com/mesodose",
            "https://www.facebook.com/mesodose",
            "https://www.linkedin.com/company/mesodose",
          ],
          description:
            "Mesodose crafts ibogaine tinctures and guides for functional, gentle dosing that enhances calm, focus, and clarity.",
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Mesodose",
          "url": baseUrl,
          "image": logoUrl,
          "publisher": {
            "@type": "Organization",
            "name": "Mesodose",
            "logo": {
              "@type": "ImageObject",
              "url": logoUrl,
            },
          },
        })}
      </script>
    </Helmet>
  );
}
