import React from "react";
import StoriesHeroVideos from "../components/StoriesHeroVideos";
import StoriesUploadModal from "../components/StoriesUploadModal";
import { uploadMedia } from "../lib/uploadMedia";

export default function StoriesHeroVideosContainer(props) {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState(null);

  const handleSelectFile = async (file) => {
    setError(null);
    setBusy(true);
    setProgress(0);
    try {
      const { downloadURL } = await uploadMedia(file, setProgress);
      // OPTIONAL: do something (toast/snackbar, add to grid, etc.)
      // e.g., props.onUploaded?.(downloadURL);
      setOpen(false);
    } catch (e) {
      setError(e?.message || "Upload falhou.");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  return (
    <>
      <StoriesHeroVideos {...props} onUploadClick={() => setOpen(true)} />
      <StoriesUploadModal
        open={open}
        onClose={() => !busy && setOpen(false)}
        onSelectFile={handleSelectFile}
        progress={progress}
        busy={busy}
        error={error}
      />
    </>
  );
}
