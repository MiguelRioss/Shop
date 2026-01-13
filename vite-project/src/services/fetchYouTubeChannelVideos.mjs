const DEFAULT_MAX_RESULTS = 12;
const CORS_PROXY_URL = "https://api.allorigins.win/raw?url=";

function buildFeedUrl(channelId, playlistId) {
  if (playlistId) {
    return `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`;
  }
  if (channelId) {
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
  }
  return "";
}

async function fetchXml(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch YouTube feed: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

function getText(entry, selectors) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const selector of list) {
    const node = entry.querySelector(selector);
    const text = node?.textContent?.trim();
    if (text) return text;
  }
  return "";
}

function parseFeed(xmlText, maxResults) {
  if (typeof DOMParser === "undefined") return [];
  const doc = new DOMParser().parseFromString(xmlText, "application/xml");
  if (doc.querySelector("parsererror")) {
    throw new Error("Invalid YouTube feed XML");
  }
  return Array.from(doc.querySelectorAll("entry"))
    .slice(0, maxResults)
    .map((entry) => {
      const youtubeId = getText(entry, ["yt\\:videoId", "videoId"]);
      if (!youtubeId) return null;
      const title = getText(entry, "title");
      const description = getText(entry, ["media\\:description", "description"]);
      const shareUrl =
        entry.querySelector("link")?.getAttribute("href") ||
        `https://www.youtube.com/watch?v=${youtubeId}`;
      const user = getText(entry, "author > name");
      const isShort = shareUrl.includes("/shorts/");
      return {
        id: youtubeId,
        youtubeId,
        title,
        description,
        user,
        shareUrl,
        isShort,
      };
    })
    .filter(Boolean);
}

export default async function fetchYouTubeChannelVideos(
  channelId,
  { playlistId, maxResults = DEFAULT_MAX_RESULTS } = {},
) {
  const feedUrl = buildFeedUrl(channelId, playlistId);
  if (!feedUrl) return [];
  try {
    const xmlText = await fetchXml(feedUrl);
    return parseFeed(xmlText, maxResults);
  } catch (err) {
    const fallbackUrl = `${CORS_PROXY_URL}${encodeURIComponent(feedUrl)}`;
    const xmlText = await fetchXml(fallbackUrl);
    return parseFeed(xmlText, maxResults);
  }
}
