import React from "react";
import { ImagePlus, Video, X, UploadCloud } from "lucide-react";

export default function StoriesUploadModal({ open, onClose, onSelectFile, progress = 0, busy = false, error = null }) {
  if (!open) return null;

  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !busy && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, busy]);

  const fileInputRef = React.useRef(null);

  const pickFile = (accept) => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = "";
    fileInputRef.current.setAttribute("accept", accept);
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onSelectFile?.(file);
  };

  return (
    <div aria-modal="true" role="dialog" aria-labelledby="stories-upload-title" className="fixed inset-0 z-[100] flex items-center justify-center">
      <button className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!busy ? onClose : undefined} aria-label="Fechar janela" />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={!busy ? onClose : undefined}
          className="absolute right-3 top-3 rounded-full p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50"
          aria-label="Fechar"
          disabled={busy}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4">
          <h2 id="stories-upload-title" className="text-xl font-semibold">Adicionar média</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Seleciona uma imagem ou vídeo para enviar para a comunidade.
          </p>
        </div>

        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => pickFile("image/*")}
            className="group flex flex-col items-center gap-3 rounded-xl border border-neutral-200 p-5 hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50"
            disabled={busy}
          >
            <span className="rounded-xl border border-neutral-200 p-4">
              <ImagePlus className="h-8 w-8" />
            </span>
            <span className="text-sm font-medium">Imagem</span>
            <span className="text-xs text-neutral-500">PNG, JPG, WEBP</span>
          </button>

          <button
            type="button"
            onClick={() => pickFile("video/*")}
            className="group flex flex-col items-center gap-3 rounded-xl border border-neutral-200 p-5 hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50"
            disabled={busy}
          >
            <span className="rounded-xl border border-neutral-200 p-4">
              <Video className="h-8 w-8" />
            </span>
            <span className="text-sm font-medium">Vídeo</span>
            <span className="text-xs text-neutral-500">MP4, MOV, WEBM</span>
          </button>
        </div>

        {/* Upload state */}
        <div className="mt-6 space-y-3">
          {busy ? (
            <>
              <div className="flex items-center gap-2 text-sm font-medium">
                <UploadCloud className="h-4 w-4" />
                A enviar… {progress}%
              </div>
              <div className="h-2 w-full overflow-hidden rounded bg-neutral-200">
                <div className="h-full bg-neutral-800 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : (
            <p className="text-xs text-neutral-500">O ficheiro será marcado como <b>approved = true</b> por agora.</p>
          )}

          {error && (
            <p className="text-xs text-red-600">
              {String(error)}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={!busy ? onClose : undefined}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
            disabled={busy}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
