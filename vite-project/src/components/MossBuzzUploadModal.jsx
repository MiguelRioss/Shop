import React from "react";
import uploadMossBuzzVideo from "../services/uploadMossBuzzVideo.mjs";

const initialForm = {
  file: null,
  firstName: "",
  location: "",
  email: "",
  caption: "",
};

export default function MossBuzzUploadModal({
  open,
  onClose,
  copy = {},
  onSuccess,
}) {
  const {
    title = "Submit Your MOSBUZZ\u00AE Video",
    subtitle = "Share your ritual with the community. Keep it real\u2014feelings, reflections, and all the authentic moments that define your mesodose practice.",
    helper = "MP4, MOV, or WebM. Up to 200 MB.",
    disclaimer = "By submitting, you confirm you own the rights to this footage and grant MOSBUZZ\u00AE permission to share it across channels.",
    successMessage = "Thanks! Your clip was uploaded successfully.",
    errorMessage = "Upload failed. Please try again.",
  } = copy || {};

  const [form, setForm] = React.useState(initialForm);
  const [previewUrl, setPreviewUrl] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState({ type: "idle", message: "" });

  React.useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setStatus({ type: "idle", message: "" });
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
    }
  }, [open, previewUrl]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    updateField("file", file || null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!form.file) {
      setStatus({ type: "error", message: "Please choose a video to upload." });
      return;
    }

    setSubmitting(true);
    try {
      await uploadMossBuzzVideo(form);

      // Call the onSuccess callback instead of setting local state
      if (onSuccess) {
        onSuccess();
      } else {
        // Fallback to local state if no callback provided
        setStatus({ type: "success", message: successMessage });
        setForm(initialForm);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl("");
        }
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-8 sm:py-12"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mossbuzz-upload-title"
    >
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/10 text-gray-600 transition hover:bg-black/20"
          aria-label="Close upload modal"
          disabled={submitting}
        >
          &times;
        </button>

        <div className="max-h-[90vh] overflow-y-auto px-6 py-10 sm:px-10">
          <header className="mb-8 text-center">
            <h2
              id="mossbuzz-upload-title"
              className="text-2xl font-serif text-gray-900 sm:text-3xl"
            >
              {title}
            </h2>
            <p className="mt-3 text-sm text-gray-600 sm:text-base">
              {subtitle}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label
                htmlFor="video"
                className="block text-sm font-medium text-gray-700"
              >
                Video clip
              </label>
              <input
                id="video"
                name="video"
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileChange}
                className="mt-2 w-full cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-600 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-[var(--brand)] file:px-4 file:py-2 file:text-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-from)] focus:ring-offset-2"
                required
              />
              <p className="mt-2 text-xs text-gray-500">{helper}</p>
              {previewUrl && (
                <video
                  src={previewUrl}
                  controls
                  className="mt-4 w-full rounded-2xl bg-black/5"
                />
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[var(--brand-from)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-from)]"
                  placeholder="Ana"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[var(--brand-from)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-from)]"
                  placeholder="Lisbon, PT"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Contact email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[var(--brand-from)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-from)]"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="caption"
                className="block text-sm font-medium text-gray-700"
              >
                Caption / context
              </label>
              <textarea
                id="caption"
                name="caption"
                rows={4}
                value={form.caption}
                onChange={(e) => updateField("caption", e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[var(--brand-from)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-from)]"
                placeholder="Tell us about your mesodosing clip..."
              />
            </div>

            {status.type === "error" && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {status.message}
              </p>
            )}

            {status.type === "success" && (
              <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {status.message}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">{disclaimer}</p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center rounded-full bg-[var(--brand-from)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Uploading..." : "Upload video"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
