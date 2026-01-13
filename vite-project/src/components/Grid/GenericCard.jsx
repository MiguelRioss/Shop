import React from "react";
import { Link } from "react-router-dom";

export default function GenericCard({
  to,                // internal route
  href,              // external link
  onClick,
  title,
  description,
  meta,              // ReactNode
  imageSrc,
  imageAlt = "",
  imageFallbackSrc,  // optional
  aspectClassName = "aspect-[16/10]",
  className = "",
  children,          // optional extra content
}) {
  const Wrapper = to ? Link : href ? "a" : "div";
  const wrapperProps = to
    ? { to }
    : href
    ? { href, target: "_blank", rel: "noreferrer" }
    : {};

  const [imgFailed, setImgFailed] = React.useState(false);

  const showPrimary = !!imageSrc && !imgFailed;
  const showFallback = !showPrimary && !!imageFallbackSrc;

  return (
    <Wrapper
      {...wrapperProps}
      onClick={onClick}
      className={`group block rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      {/* IMAGE */}
      <div className={`${aspectClassName} w-full overflow-hidden`}>
        {showPrimary ? (
          <img
            src={imageSrc}
            alt={imageAlt || title || "Card"}
            className="h-full w-full object-cover object-top block transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgFailed(true)}
          />
        ) : showFallback ? (
          <img
            src={imageFallbackSrc}
            alt={imageAlt || title || "Card"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-neutral-100 text-neutral-400 text-sm">
            No image
          </div>
        )}
      </div>

      {/* TEXT */}
      <div className="p-6">
        {title && (
          <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-[var(--brand-from)] transition-colors">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-sm text-neutral-600 line-clamp-3">{description}</p>
        )}

        {meta && <div className="mt-4">{meta}</div>}

        {children}
      </div>
    </Wrapper>
  );
}
