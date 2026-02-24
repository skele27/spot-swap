"use client";

import Link from "next/link";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FiMapPin } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <FiMapPin className="text-2xl" />
            <span>Spot Swap</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-muted hover:text-foreground transition-colors">
              Browse
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm rounded-lg border border-border text-foreground hover:bg-gray-800 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-muted cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <Link href="/browse" className="block text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>
              Browse
            </Link>
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link href="/login" className="text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>
                Log In
              </Link>
              <Link href="/signup" className="text-primary font-semibold" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
