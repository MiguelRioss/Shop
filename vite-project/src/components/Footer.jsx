import React from "react";
import logoPng from "/logo_white.png"; // adjust the path

export default function Footer() {
  return (
    <footer className="bg-[#1f1f1f] text-white/90">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          {/* Left: Logo + community blurb + socials */}
          <div className="md:col-span-8">
            {/* Floating logo + wordmark */}
            <div
              className="
                relative inline-block
                [--logo:372px] sm:[--logo:306px] md:[--logo:304px] lg:[--logo:448px]
              "
            >
              {/* This image floats absolutely and won't push siblings */}
              <img
                src={logoPng}
                alt=""                /* decorative if you keep the text 'sensate' */
                aria-hidden="true"
                className="
                  pointer-events-none select-none
                  absolute left-0 top-1/2 -translate-y-1/2
                  lg:-translate-x-33
                  sm:-translate-x-33
                  md:-translate-x-33
                  -translate-x-27
                  -ml-2 md:-ml-3
                "
              />

              {/* Clickable brand link (text stays in normal flow) */}
              <a
                href="#"
                className="
                  relative inline-flex items-center
                  pl-[calc(var(--logo)+14px)]
                "
              >
          
              </a>
            </div>

            {/* ...rest of your footer content... */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-white">Join the Sensate community</h3>
              <p className="mt-3 max-w-2xl text-white/80">
                Find out how Sensate is helping thousands of people across the world.
              </p>

              <div className="mt-6 flex items-center gap-5">
                {/* socials */}
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

        <div className="mt-12 h-px w-full bg-white/10" />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a href="#" className="hover:text-white underline underline-offset-4">Privacy Policy</a>
            <a href="#" className="hover:text-white underline underline-offset-4">Returns Policy</a>
            <a href="#" className="hover:text-white underline underline-offset-4">Terms of Sale</a>
            <a href="#" className="hover:text-white underline underline-offset-4">Terms of Use</a>
            <a href="#" className="hover:text-white underline underline-offset-4">Shipping</a>
          </div>
          <p className="text-xs text-white/70">
            © Copyright {new Date().getFullYear()} Sensate
          </p>
        </div>
      </div>
    </footer>
  );
}
