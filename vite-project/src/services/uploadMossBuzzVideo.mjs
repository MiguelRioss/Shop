  import apiURLresolve from "./apiURLresolve";

  export default async function uploadMossBuzzVideo(form) {
    const { file, ...fields } = form || {};
    if (!(file instanceof File)) {
      throw new Error("Please attach a video file before submitting.");
    }

    const apiBase = apiURLresolve();
    const endpoint = `${apiBase}/api/upload`;

    const body = new FormData();
    body.append("video", file);

    Object.entries(fields).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      body.append(key, value);
    });

    const res = await fetch(endpoint, {
      method: "POST",
      body,
    });

    if (!res.ok) {
      let message = `Upload failed (${res.status})`;
      try {
        const data = await res.json();
        if (data?.message) message = data.message;
      } catch (err) {
        // ignore JSON parse error
      }
      throw new Error(message);
    }

    return res.json();
  }

  