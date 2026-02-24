import Link from "next/link";
import { FiMapPin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Icon */}
          <div className="flex items-center gap-2 text-lg font-bold text-primary">
            <FiMapPin />
            <span>Spot Swap</span>
          </div>

          {/* Links to pages */}
          <div className="flex gap-6 text-sm text-muted">
            <Link href="/browse" className="hover:text-foreground transition-colors">
              Browse
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">
              Sign Up
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Spot Swap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
