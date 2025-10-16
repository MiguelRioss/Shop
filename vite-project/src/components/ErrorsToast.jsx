import React, { useEffect } from "react";

export default function ErrorToast({ error, onClose }) {
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(onClose, 5000); // auto-hide after 5s
    return () => clearTimeout(timer);
  }, [error, onClose]);

  if (!error) return null;

  const color =
    error.status >= 500
      ? "bg-red-700"
      : error.status >= 400
      ? "bg-yellow-600"
      : "bg-green-600";

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-lg text-white ${color}`}
    >
      <strong>Error {error.status}:</strong> {error.message}
    </div>
  );
}
