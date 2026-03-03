"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FiMapPin } from "react-icons/fi";

export default function Navbar() {
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <FiMapPin className="text-2xl" />
            <span>Spot Swap</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href="/browse" className="text-muted hover:text-foreground transition-colors">
              Browse
            </Link>
            {user && (
              <>
                <Link href="/create" className="text-muted hover:text-foreground transition-colors">
                  Create a Listing
                </Link>
                <Link href="/messages" className="text-muted hover:text-foreground transition-colors">
                  Inbox
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-border animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted truncate max-w-[160px]">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm rounded-lg border border-border text-muted hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
