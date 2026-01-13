import apiURLresolve from "./apiURLresolve";

const uri = apiURLresolve()


export async function getBlogBySlug(slug) {
  try {
    const res = await fetch(`${uri}/api/blogs/${slug}`);
    console.log(res)

    if (!res.ok) {
      const msg = await res.json().catch(() => ({}));
      throw new Error(msg?.error || `Error ${res.status}: Failed to load blog`);
    }

    const blog = await res.json();
    return blog;
  } catch (err) {
    console.error("⚠️ Failed to fetch blog:", err.message);
    return { error: err.message };
  }
}


export async function getAllBlogs() {
  try {
    const res = await fetch(`${uri}/api/blogs`);

    if (!res.ok) {
      throw new Error(`Error ${res.status}: Failed to load blogs`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data.blogs || [];
  } catch (err) {
    console.error("⚠️ Failed to fetch blogs:", err.message);
    return [];
  }
}


export function formatBlogDate(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short", // "short" = Nov, "long" = November
    year: "numeric",
  });
}




// ✅ Individual list
export async function getAllIndividualBlogs() {
  try {
    const res = await fetch(`${uri}/api/individualBlogs`);

    if (!res.ok) {
      throw new Error(`Error ${res.status}: Failed to load individual blogs`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data.blogs || data.individualBlogs || [];
  } catch (err) {
    console.error("⚠️ Failed to fetch individual blogs:", err.message);
    return [];
  }
}

// ✅ Series list
export async function getAllBlogSeries() {
  try {
    const res = await fetch(`${uri}/api/blogsSeries`);

    if (!res.ok) {
      throw new Error(`Error ${res.status}: Failed to load blog series`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data.blogs || data.blogSeries || data.blogsSeries || [];
  } catch (err) {
    console.error("⚠️ Failed to fetch blog series:", err.message);
    return [];
  }
}
