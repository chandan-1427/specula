import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800 bg-black/95 text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="text-base font-semibold text-white">Specula</p>
          <p className="mt-1 text-xs text-zinc-500">
            © {new Date().getFullYear()} Specula. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
