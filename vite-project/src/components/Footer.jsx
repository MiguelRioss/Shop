import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#1f1f1f] text-white/90">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          {/* Left: Logo + community blurb + socials */}
          <div className="md:col-span-8">
            {/* Logo wordmark */}
            <a href="#" className="inline-flex items-center gap-3">
              {/* S mark (placeholder) */}
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M18.5 6.5c0-2.2-2.2-3.5-4.2-2.6-2.6 1.1-4.7 2.6-6.1 4.4C6.3 9.5 6 11 6.8 12c.9 1.1 2.6 1 3.8.4 1.3-.7 2.3-1.6 3.5-2.2 1.6-.8 3.9.3 3.9 2.2 0 2.5-2.5 3.8-4.6 4.7-2 .8-4 .9-6 .4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <span className="tracking-[0.35em] text-4xl font-light text-white">sensate</span>
            </a>

            <div className="mt-10">
              <h3 className="text-xl font-semibold text-white">Join the Sensate community</h3>
              <p className="mt-3 max-w-2xl text-white/80">
                Find out how Sensate is helping thousands of people across the world.
              </p>

              {/* Social icons */}
              <div className="mt-6 flex items-center gap-5">
                <a href="#" aria-label="Facebook" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M13.5 22v-8h2.6l.4-3h-3v-1.9c0-.9.2-1.5 1.6-1.5H17V4.1c-.8-.1-1.7-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H7v3h3.3v8h3.2z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor"/><circle cx="12" cy="12" r="4.2" stroke="currentColor"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>
                </a>
                <a href="#" aria-label="Twitter" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M22 5.9c-.7.3-1.5.6-2.3.6.8-.5 1.4-1.2 1.7-2.2-.8.5-1.7.8-2.6 1A4.1 4.1 0 0 0 12 8.7c0 .3 0 .6.1.9-3.4-.2-6.4-1.9-8.4-4.5-.4.7-.6 1.4-.6 2.3 0 1.4.7 2.6 1.8 3.3-.6 0-1.2-.2-1.7-.5 0 2 1.4 3.7 3.2 4.1-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.6 2 2.8 3.8 2.8A8.3 8.3 0 0 1 2 19.5 11.7 11.7 0 0 0 8.3 21c7 0 10.9-5.8 10.9-10.9v-.5c.8-.6 1.5-1.3 2-2.1z"/></svg>
                </a>
                <a href="#" aria-label="YouTube" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M23.5 6.2s-.2-1.6-.9-2.3c-.8-.9-1.7-.9-2.1-1C17.7 2.5 12 2.5 12 2.5h0s-5.7 0-8.5.4c-.5.1-1.4.1-2.1 1C.8 4.6.5 6.2.5 6.2S0 8.1 0 9.9v2.2c0 1.8.5 3.7.5 3.7s.2 1.6.9 2.3c.8.9 1.8.9 2.3 1 1.7.2 7.2.4 8.3.4 0 0 5.7 0 8.5-.4.5-.1 1.4-.1 2.1-1 .7-.7.9-2.3.9-2.3s.5-1.9.5-3.7V9.9c0-1.8-.5-3.7-.5-3.7zM9.6 14.6V8.3l5.9 3.2-5.9 3.1z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right: simple top links */}
          <nav className="md:col-span-4 md:justify-self-end">
            <ul className="flex gap-8 md:gap-10 text-sm font-semibold text-white/90">
              <li><a href="#help" className="hover:text-white">Help</a></li>
              <li><a href="#buzz" className="hover:text-white">Buzz</a></li>
              <li><a href="#affiliate" className="hover:text-white">Affiliate</a></li>
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-12 h-px w-full bg-white/10" />

        {/* Legal row */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a href="#" className="hover:text-white underline underline-offset-4">Privacy Policy</a>
            <a href="#" className="hover:text-white underline underline-offset-4">Returns Policy</a>
            <a href="#" className="hover:text-white underline underline-offset-4">Terms of Sale</a>
            <a href="#" className="hover:text-white underline underline-offset-4">Terms of Use</a>
            <a href="#" className="hover:text-white underline underline-offset-4">Shipping</a>
          </div>
          <p className="text-xs text-white/70">© Copyright {new Date().getFullYear()} Sensate</p>
        </div>
      </div>
    </footer>
  );
}
