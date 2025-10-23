import apiURLresolve from "./apiURLresolve";

export default async function fetchWebSiteConfigFile() {
  const apiBase = apiURLresolve();
  const res = await fetch(`${apiBase}/page/config`);
  console.log("Fetching website config from:", `${apiBase}/page/config`);
  if (!res.ok) {
    throw new Error(`Failed to fetch website config: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
