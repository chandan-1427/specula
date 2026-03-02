import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../ui/Button";

/**
 * Application navigation bar displayed on every page.
 *
 * Contains brand link and conditional login/signup actions based on
 * current route.
 */
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-zinc-900 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <button
            onClick={() => navigate("/")}
            className="text-lg font-semibold tracking-tight cursor-pointer text-white hover:opacity-80 transition"
          >
            Specula
          </button>

          <div className="flex items-center gap-3">
            
            {!isLoginPage && (
              <button
                onClick={() => navigate("/login")}
                className="text-sm cursor-pointer font-medium text-zinc-300 hover:text-white transition"
              >
                Log in
              </button>
            )}


            {!isSignupPage && (
              <Button size="sm" onClick={() => navigate("/signup")}>
                Sign up
              </Button>
            )}

          </div>
        </div>
      </div>

      <div className="pointer-events-none h-5 w-full bg-gradient-to-b from-black/70 to-transparent" />
    </header>
  );
};

export default Navbar;