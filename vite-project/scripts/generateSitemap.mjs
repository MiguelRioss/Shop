// generateSitemap.mjs
import fs from "fs";
import path from "path";
import apiURLresolve from "../src/services/apiURLresolve.js";

const API_URL = apiURLresolve(); // your backend
const SITE_URL = process.env.PUBLIC_SITE_URL || "https://mesodose.com";
const BLOGS_API = `${API_URL}/api/blogs`;
const PRODUCTS_API = `${API_URL}/api/products`;

const staticRoutes = [
  "/",
  "/cart",
  "/legal",
  "/mesoblog",
  "/mesocontact",
  "/mesoconnect",
  "/mesostory",
  "/mesobuzz",
  "/download",
];

// ---- BLOG ROUTES ----
async function fetchBlogRoutes() {
  try {
    const res = await fetch(BLOGS_API);

    if (!res.ok) {
      throw new Error(`BLOGS_API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const posts = data.blogs ?? data ?? [];

    return posts
      .map((post) => post?.slug && `/mesoblog/${post.slug}`)
      .filter(Boolean);
  } catch (err) {
    console.error("❌ Failed to fetch blog posts:", err);
    return [];
  }
}

// ---- PRODUCT ROUTES ----
async function fetchProductRoutes() {
  try {
    const res = await fetch(PRODUCTS_API);

    if (!res.ok) {
      throw new Error(`PRODUCTS_API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const products = data.products ?? data ?? [];

    return products
      .map((p) => p?.slug && `/products/${p.slug}`) // 👈 your example: /products/total-alkaloid-extract-ta
      .filter(Boolean);
  } catch (err) {
    console.error("❌ Failed to fetch product routes:", err);
    return [];
  }
}

function wrapXml(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

function makeUrlEntry(routePath) {
  return `
  <url>
    <loc>${SITE_URL}${routePath}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${routePath === "/" ? "1.0" : "0.7"}</priority>
  </url>`;
}

async function buildSitemap() {
  console.log("🛠 Generating sitemap...");

  const staticXml = staticRoutes.map(makeUrlEntry);

  const [blogRoutes, productRoutes] = await Promise.all([
    fetchBlogRoutes(),
    fetchProductRoutes(),
  ]);

  const blogXml = blogRoutes.map(makeUrlEntry);
  const productXml = productRoutes.map(makeUrlEntry);

  const xml = wrapXml([...staticXml, ...blogXml, ...productXml]);

  const outputPath = path.resolve(process.cwd(), "public", "sitemap.xml");

  fs.writeFileSync(outputPath, xml);

  console.log("✅ Sitemap successfully generated:", outputPath);
}

buildSitemap();
