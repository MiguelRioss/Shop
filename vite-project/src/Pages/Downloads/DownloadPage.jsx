import { useEffect, useState } from "react";

export default function DownloadPage() {
  const [message, setMessage] = useState("Preparing your download...");
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const source = params.get("source") || "unknown";
    const file = params.get("file") || "mesodosing-eBook.pdf";

    if (!email) {
      setMessage("Missing email parameter.");
      return;
    }

    // Pi API (HTTPS Tailnet domain)
    const apiBase = "https://tracker-counter.vercel.app";
    const url = `${apiBase}/download/${file}?email=${encodeURIComponent(
      email
    )}&source=${encodeURIComponent(source)}`;

    setDownloadUrl(url);

    // 🧠 Use a short timeout but only auto-redirect if user gesture allowed
    const timer = setTimeout(() => {
      // Try programmatic navigation; fallback stays visible
      window.location.assign(url);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <p>{message}</p>
      {downloadUrl && (
        <a
          href={downloadUrl}
          style={{
            marginTop: "16px",
            color: "#fff",
            background: "#111",
            padding: "12px 18px",
            borderRadius: "6px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Tap here if your download doesn’t start automatically
        </a>
      )}
    </div>
  );
}
