import React from "react";

export default function GenericGrid({
  items = [],
  renderItem,
  loading = false,
  error = null,
  emptyText = "Nothing found.",
  className = "",
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 gap-10",
}) {
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-600">⚠️ {error}</div>;

  return (
    <div className={className}>
      {items.length === 0 ? (
        <div className="text-center text-neutral-500 py-12">{emptyText}</div>
      ) : (
        <div className={gridClassName}>{items.map(renderItem)}</div>
      )}
    </div>
  );
}
