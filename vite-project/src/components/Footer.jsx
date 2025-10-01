// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Globe } from "lucide-react";

const iconMap = {
  browser: Globe,
  globe: Globe,
  website: Globe,
  web: Globe,
  facebook: Facebook,
  instagram: Instagram,
};

export default function Footer({
  logoSrc,
  brandHref,
  brandText,
  community = {},
  disclaimer = {},
  topLinks = [],
  bottomLinks = [],
  copyrightName,
  socialLinks = [],
}) {
  const { heading: commHeading, body: commBody, socialsBlurb } = community;
  const { heading: discHeading, body: discBody } = disclaimer;

  const [activeTip, setActiveTip] = React.useState(null); // index of icon showing tip
  const tipTimerRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (tipTimerRef.current) clearTimeout(tipTimerRef.current);
    };
  }, []);

  return (
    <footer
      id="site-footer"
      role="contentinfo"
      className="bg-[#1f1f1f] text-white/90"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          {/* Left: Logo + community blurb + socials */}
          <div className="md:col-span-8">
            {/* Floating logo + wordmark */}
            <div className="relative inline-block [--logo:372px] sm:[--logo:306px] md:[--logo:304px] lg:[--logo:448px]">
              <img
                src={logoSrc}
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute left-0 top-1/2 -translate-y-1/2 lg:-translate-x-33 sm:-translate-x-33 md:-translate-x-33 -translate-x-27 -ml-2 md:-ml-3"
                loading="lazy"
                decoding="async"
              />

              <Link
                to={brandHref}
                className="relative inline-flex items-center pl-[calc(var(--logo)+14px)]"
                aria-label={brandText || "Home"}
              >
                {brandText ? (
                  <span className="sr-only">{brandText}</span>
                ) : null}
              </Link>
            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-white">
                {(() => {
                  const fb = (socialLinks || []).find(
                    (s) => String(s?.label || "").toLowerCase() === "facebook"
                  );
                  const href = fb?.href || "/mesobuzz";
                  const isExternal = /^https?:\/\//i.test(href);
                  return isExternal ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded underline-offset-4 hover:underline focus:outline-none focus-visible:ring focus-visible:ring-white/60"
                    >
                      {commHeading}
                    </a>
                  ) : (
                    <Link
                      to={href}
                      className="rounded underline-offset-4 hover:underline focus:outline-none focus-visible:ring focus-visible:ring-white/60"
                    >
                      {commHeading}
                    </Link>
                  );
                })()}
              </h3>

              {commBody ? (
                <p className="mt-3 max-w-2xl text-white/80">{commBody}</p>
              ) : null}
              {Array.isArray(socialsBlurb) ? (
                (() => {
                  // Build a lookup from your config's socialLinks
                  const linkByKey = Object.fromEntries(
                    (socialLinks || []).map(({ label, href }) => [
                      String(label || "").toLowerCase(),
                      href,
                    ])
                  );

                  const inferKey = (text) => {
                    const s = String(text).toLowerCase();
                    if (s.includes("instagram")) return "instagram";
                    if (s.includes("facebook")) return "facebook";
                    return "browser"; // default for MesoBuzz / website
                  };

                  const linkFor = (key) => {
                    if (key === "browser") return "/mesobuzz"; // internal route for MesoBuzz
                    return linkByKey[key]; // from config for fb/ig
                  };

                  return (
                    <ul className="mt-3 max-w-2xl text-white/80 list-none pl-0 space-y-2">
                      {socialsBlurb.map((text, i) => {
                        const key = inferKey(text);
                        const Icon = iconMap[key] || Globe;
                        const href = linkFor(key);
                        const isExternal = href
                          ? /^https?:\/\//i.test(href)
                          : false;

                        const Content = href ? (
                          isExternal ? (
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline underline-offset-4"
                            >
                              {text}
                            </a>
                          ) : (
                            <Link
                              to={href}
                              className="hover:underline underline-offset-4"
                            >
                              {text}
                            </Link>
                          )
                        ) : (
                          <span>{text}</span>
                        );

                        return (
                          <li key={i} className="flex items-start gap-3">
                            <span
                              className="mt-1 inline-flex h-5 w-5 items-center justify-center text-white/70"
                              aria-hidden="true"
                            >
                              <Icon size={18} strokeWidth={1.8} />
                            </span>
                            {Content}
                          </li>
                        );
                      })}
                    </ul>
                  );
                })()
              ) : socialsBlurb ? (
                <p className="mt-3 max-w-2xl text-white/80">{socialsBlurb}</p>
              ) : null}
              {socialLinks.length > 0 && (
                <div className="mt-4 flex items-center gap-4">
                  {socialLinks.map(({ message,label, href }, i) => {
                    const key = String(label || "")
                      .toLowerCase()
                      .trim();
                    const Icon = iconMap[key];
                    const msg = ` ${message}`;

                    const showTip = () => {
                      if (tipTimerRef.current)
                        clearTimeout(tipTimerRef.current);
                      setActiveTip(i);
                      tipTimerRef.current = setTimeout(
                        () => setActiveTip(null),
                        1200
                      );
                    };

                    return (
                      <div key={href} className="relative group">
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-white hover:text-white"
                          aria-label={label}
                          title={label}
                          onClick={showTip}
                          onFocus={showTip}
                        >
                          {Icon ? (
                            <Icon
                              size={20}
                              strokeWidth={1.6}
                              aria-hidden="true"
                            />
                          ) : (
                            <span className="text-sm font-medium">
                              {label?.charAt(0)}
                            </span>
                          )}
                        </a>

                        {/* Tooltip */}
                        <span
                          role="status"
                          className={[
                            "pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2",
                            "whitespace-nowrap rounded px-2 py-1 text-xs",
                            "bg-white/90 text-black shadow",
                            "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
                            activeTip === i ? "opacity-100" : "",
                          ].join(" ")}
                        >
                          {msg}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {discHeading ? (
                <h3 className="mt-5 text-xl font-semibold text-white">
                  {discHeading}
                </h3>
              ) : null}
              {discBody ? (
                <p className="mt-1 max-w-2xl text-white/80">{discBody}</p>
              ) : null}
            </div>
          </div>

          {/* Right: simple top links */}
          <nav className="md:col-span-4 md:justify-self-end">
            <ul className="flex gap-8 text-sm font-semibold text-white/90 md:gap-10">
              {topLinks.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 h-px w-full bg-white/10" />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            {bottomLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="underline underline-offset-4 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-white/70">
            © Copyright {new Date().getFullYear()} {copyrightName}
          </p>
        </div>
      </div>
    </footer>
  );
}


