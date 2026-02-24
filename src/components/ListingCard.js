"use client";

import Link from "next/link";
import { FiMapPin } from "react-icons/fi";

export default function ListingCard({ listing }) {
  return (
    <Link href={`/listing/${listing.id}`} className="group">
      <div className="bg-card-bg rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="aspect-[4/3] bg-gray-700 overflow-hidden">
          {listing.imageUrl ? (
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm">
              No Image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground truncate">
            {listing.title}
          </h3>
          <p className="text-xl font-bold text-primary mt-1">
            ${listing.price}
          </p>
          <div className="flex items-center gap-1 text-muted text-sm mt-2">
            <FiMapPin className="text-xs" />
            <span>{listing.city || "Local"}</span>
          </div>
          <span
            className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${
              listing.status === "sold"
                ? "bg-red-900/30 text-red-400"
                : "bg-green-900/30 text-green-400"
            }`}
          >
            {listing.status === "sold" ? "Sold" : "Available"}
          </span>
        </div>
      </div>
    </Link>
  );
}
