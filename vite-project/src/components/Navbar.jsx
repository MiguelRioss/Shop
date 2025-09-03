import React from "react";
import { Menu, X } from "lucide-react";
// Tailwind color tokens to match the screenshot vibe
// bg-ivory = #fcfcf4, orange = #f5653b
// Add this to your global CSS if you want the exact ivory: .bg-ivory{ background-color:#fcfcf4 }

const links = [
  { href: "#research", label: "Research" },
  { href: "#stories", label: "Stories" },
  { href: "#blog", label: "Blog" },
];

export default function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50">
      

      {/* Main nav */}
      <div className="w-full bg-[#fcfcf4] border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex h-16 items-center justify-between">
            {/* Left: Logo */}
            <a href="#" aria-label="Home" className="flex items-center gap-2">
              {/* Simple S mark (placeholder) */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5 6.5c0-2.2-2.2-3.5-4.2-2.6-2.6 1.1-4.7 2.6-6.1 4.4C6.3 9.5 6 11 6.8 12c.9 1.1 2.6 1 3.8.4 1.3-.7 2.3-1.6 3.5-2.2 1.6-.8 3.9.3 3.9 2.2 0 2.5-2.5 3.8-4.6 4.7-2 .8-4 .9-6 .4" stroke="#111" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <span className="tracking-[0.3em] text-lg font-normal text-black">sensate</span>
            </a>

            {/* Center: Links (desktop) */}
            <ul className="hidden md:flex items-center gap-8 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-black/80 hover:text-black transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right: Cart + CTA (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="../cart"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#f5653b] text-[#f5653b] hover:bg-[#f5653b] hover:text-white transition-colors"
                aria-label="Cart"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6h14l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.5L5 3H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="10" cy="20" r="1.5" fill="currentColor"/>
                  <circle cx="17" cy="20" r="1.5" fill="currentColor"/>
                </svg>
              </a>
              <a
                href="#get"
                className="inline-flex items-center rounded-full bg-[#f5653b] px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Get Sensate
              </a>
            </div>

            {/* Mobile: menu toggle */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-black/80 hover:bg-black/5"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>

        {/* Mobile panel */}
        {open && (
          <div className="md:hidden border-t border-black/10 bg-[#fcfcf4]">
            <div className="mx-auto max-w-7xl px-4 py-4 space-y-4">
              <ul className="flex flex-col gap-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="block rounded-lg px-2 py-2 text-black/80 hover:bg-black/5"
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="/cart"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f5653b] text-[#f5653b]"
                  aria-label="Cart"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6h14l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.5L5 3H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="10" cy="20" r="1.5" fill="currentColor"/>
                    <circle cx="17" cy="20" r="1.5" fill="currentColor"/>
                  </svg>
                </a>
                <a
                  href="#get"
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-[#f5653b] px-5 py-2 text-sm font-medium text-white"
                >
                  Get Sensate
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Announcement bar */}
      <div className="w-full bg-[#f5653b] text-white text-sm">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center">
          Experience calm on demand. Sensate helps you unwind, anytime, anywhere
        </div>
      </div>
    </header>
  );
}
// Tailwind CSS is used for styling