"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  FiMapPin,
  FiUser,
  FiMessageSquare,
  FiArrowLeft,
  FiClock,
  FiTag,
} from "react-icons/fi";

export default function ListingDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [safePlaces, setSafePlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);

  // Fetch listing from Firestore
  useEffect(() => {
    async function fetchListing() {
      try {
        const docSnap = await getDoc(doc(db, "listings", id));
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchListing();
  }, [id]);

  // Fetch safe meeting spots from Google Places API
  useEffect(() => {
    async function fetchSafePlaces() {
      if (!listing?.city) return;
      setPlacesLoading(true);
      try {
        const res = await fetch(`/api/places?city=${encodeURIComponent(listing.city)}`);
        const data = await res.json();
        if (data.places) setSafePlaces(data.places);
      } catch (err) {
        console.error("Error fetching safe places:", err);
      } finally {
        setPlacesLoading(false);
      }
    }
    fetchSafePlaces();
  }, [listing]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/3 mb-6" />
        <div className="aspect-[16/9] bg-gray-700 rounded-2xl mb-6" />
        <div className="space-y-3">
          <div className="h-6 bg-gray-700 rounded w-1/4" />
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Listing Not Found</h1>
        <p className="text-muted mb-6">
          This listing may have been removed or doesn't exist.
        </p>
        <Link
          href="/browse"
          className="text-primary font-medium hover:underline"
        >
          Back to Browse
        </Link>
      </div>
    );
  }

  const formattedDate = listing.createdAt?.toDate
    ? listing.createdAt.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-muted hover:text-foreground mb-6 transition-colors cursor-pointer"
      >
        <FiArrowLeft />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Image Column */}
        <div className="lg:col-span-3">
          <div className="aspect-[4/3] bg-gray-700 rounded-2xl overflow-hidden">
            {listing.imageUrl ? (
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">
                No Image Available
              </div>
            )}
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Price */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {listing.title}
            </h1>
            <p className="text-3xl font-extrabold text-primary mt-2">
              ${listing.price}
            </p>
          </div>

          {/* Meta Info */}
          <div className="space-y-2 text-sm text-muted">
            <div className="flex items-center gap-2">
              <FiTag />
              <span>{listing.category || "Uncategorized"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin />
              <span>{listing.city || "Local"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiUser />
              <span>{listing.sellerName || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock />
              <span>Posted {formattedDate}</span>
            </div>
          </div>

          {/* Status */}
          <span
            className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
              listing.status === "sold"
                ? "bg-red-900/30 text-red-400"
                : "bg-green-900/30 text-green-400"
            }`}
          >
            {listing.status === "sold" ? "Sold" : "Available"}
          </span>

          {/* Message Seller Button */}
          {user && user.uid !== listing.sellerId && (
            <Link
              href={`/messages?to=${listing.sellerId}&listingId=${listing.id}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
            >
              <FiMessageSquare />
              Message Seller
            </Link>
          )}
          {!user && (
            <Link
              href="/login"
              className="block text-center w-full py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
            >
              Log in to message seller
            </Link>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-foreground mb-3">Description</h2>
        <p className="text-muted whitespace-pre-wrap leading-relaxed">
          {listing.description || "No description provided."}
        </p>
      </div>

      {/* Safe Meeting Spots */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
          <FiMapPin className="text-accent" />
          Suggested Safe Meeting Spots
        </h2>
        <p className="text-muted text-sm mb-4">
          Meet at a public place for a safe transaction.
        </p>
        {placesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card-bg rounded-xl border border-border p-4 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-700 rounded w-full" />
              </div>
            ))}
          </div>
        ) : safePlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {safePlaces.map((place, i) => (
              <div key={i} className="bg-card-bg rounded-xl border border-border p-4 hover:shadow-sm transition-shadow">
                <h3 className="font-semibold text-foreground">{place.name}</h3>
                <p className="text-muted text-sm mt-1">{place.address}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm">
            Enter a city when creating a listing to see safe meeting spot suggestions.
          </p>
        )}
      </div>
    </div>
  );
}
