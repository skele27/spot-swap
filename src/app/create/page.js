"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiUpload,
  FiDollarSign,
  FiMapPin,
  FiTag,
  FiFileText,
  FiImage,
} from "react-icons/fi";

const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Vehicles",
  "Sports",
  "Books",
  "Outdoors",
  "Toys",
  "Other",
];

export default function CreateListingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [city, setCity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Show local preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // upload to cloudinary
  const uploadImage = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append("file", imageFile);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Image upload failed");
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !price || !city.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setUploading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      await addDoc(collection(db, "listings"), {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category,
        city: city.trim(),
        imageUrl,
        sellerId: user.uid,
        sellerName: user.displayName || "Anonymous",
        status: "active",
        createdAt: serverTimestamp(),
      });

      router.push("/browse");
    } catch (err) {
      console.error("Error creating listing:", err);
      setError("Failed to create listing. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Auth check
  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="h-6 w-32 bg-gray-700 rounded animate-pulse mx-auto" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Sign In Required</h1>
        <p className="text-muted mb-6">
          You need to be signed in to create a listing.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Create a Listing
      </h1>
      <p className="text-muted mb-8">
        Fill in the details below to list your item for sale.
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-900/20 border border-red-800/50 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Title *
          </label>
          <div className="relative">
            <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. iPhone 17 Pro Max"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Price ($) *
          </label>
          <div className="relative">
            <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Category
          </label>
          <div className="relative">
            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            City *
          </label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              placeholder="e.g. State College, PA"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe your item, its condition, and any other relevant details..."
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Photo
          </label>
          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors">
            {imagePreview ? (
              <div className="space-y-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="text-sm text-danger hover:underline cursor-pointer"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-2">
                <FiImage className="text-3xl text-muted" />
                <span className="text-muted text-sm">
                  Click to upload an image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-semibold text-lg hover:bg-primary-hover transition-colors disabled:opacity-50 cursor-pointer"
        >
          <FiUpload />
          {uploading ? "Publishing..." : "Publish Listing"}
        </button>
      </form>
    </div>
  );
}
