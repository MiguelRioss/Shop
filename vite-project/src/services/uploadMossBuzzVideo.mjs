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

  // Map frontend fields to backend expected fields
  const backendFields = {
    name: fields.name || '',
    description: fields.description || '',
    city: fields.city || '',
    country: fields.country || '',
    userEmail: fields.userEmail || '',
    userName: fields.userName || fields.name || '', // Use name as fallback for userName
  };

  // Append all backend fields
  Object.entries(backendFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      body.append(key, value);
    }
  });

  console.log("📤 Sending to backend:", backendFields); // Debug log

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