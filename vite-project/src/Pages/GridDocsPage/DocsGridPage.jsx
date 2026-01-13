import React from "react";
import GenericGrid from "../../components/Grid/GenericGrid";
import GenericCard from "../../components/Grid/GenericCard";

export default function DocsGridPage({ docs }) {
  const title = docs?.title || "Docs";
  const subtitle = docs?.subtitle || "Download guides, handbooks, and resources.";

  // ✅ accepts:
  // 1) docs.items as array
  // 2) docs.items as object map (firebase style)
  const items = React.useMemo(() => {
    const raw = docs?.items;

    if (Array.isArray(raw)) return raw;

    if (raw && typeof raw === "object") {
      return Object.entries(raw).map(([id, data]) => ({
        id,
        ...(data || {}),
      }));
    }

    return [];
  }, [docs]);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-6 pt-12 pb-6 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-neutral-700">{subtitle}</p>
      </header>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-6 pb-14 lg:px-8">
        <GenericGrid
          items={items}
          emptyText="No docs available yet."
          renderItem={(doc) => (
            <GenericCard
              key={doc.id || doc.downloadUrl || doc.title}
              href={doc.downloadUrl} // ✅ direct download link
              title={doc.title}
              description={doc.description}
              imageSrc={doc.imageSrc} // ✅ no fallback
              imageAlt={doc.title}
              meta={
                doc.fileType || doc.fileSize ? (
                  <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
                    {doc.fileType && <span>{doc.fileType}</span>}
                    {doc.fileSize && (
                      <>
                        <span aria-hidden>•</span>
                        <span>{doc.fileSize}</span>
                      </>
                    )}
                  </div>
                ) : null
              }
            />
          )}
        />
      </section>
    </main>
  );
}
