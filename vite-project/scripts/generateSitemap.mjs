// generateSitemap.mjs
import fs from "fs";
import path from "path";
import apiURLresolve from "../src/services/apiURLresolve.js"
const SITE_URL = apiURLresolve()
const BLOGS_API = `${SITE_URL}/api/blogs`;

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

async function fetchBlogRoutes() {
  try {
    const res = await fetch(BLOGS_API);

    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`);
    }

    const data = await res.json();

    const posts = data.blogs ?? [];

    return posts.map((post) => `/mesoblog/${post.slug}`);
  } catch (err) {
    console.error("❌ Failed to fetch blog posts:", err);
    return [];
  }
}

function wrapXml(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

function makeUrlEntry(path) {
  return `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === "/" ? "1.0" : "0.7"}</priority>
  </url>`;
}

async function buildSitemap() {
  console.log("🛠 Generating sitemap...");

  const staticXml = staticRoutes.map(makeUrlEntry);
  const blogRoutes = await fetchBlogRoutes();
  const blogXml = blogRoutes.map(makeUrlEntry);

  const xml = wrapXml([...staticXml, ...blogXml]);

  const outputPath = path.resolve("public", "sitemap.xml");
  fs.writeFileSync(outputPath, xml);

  console.log("✅ Sitemap successfully generated:", outputPath);
}

buildSitemap();
