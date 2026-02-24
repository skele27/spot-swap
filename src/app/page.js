"use client";

import Link from "next/link";
import { FiMapPin, FiShield, FiMessageSquare, FiSearch } from "react-icons/fi";

const features = [
  {
    icon: <FiSearch className="text-3xl text-primary" />,
    title: "Discover Nearby",
    description:
      "Browse items being sold in your local area. Filter by category and price!",
  },
  {
    icon: <FiMessageSquare className="text-3xl text-primary" />,
    title: "Message Sellers",
    description:
      "Chat directly with sellers to negotiate a fair price without revealing your personal identity.",
  },
  {
    icon: <FiShield className="text-3xl text-primary" />,
    title: "Meet Safely",
    description:
      "We will suggest safe meeting spots like police stations, libraries, and coffee shops near you.",
  },
  {
    icon: <FiMapPin className="text-3xl text-primary" />,
    title: "Stay Anonymous",
    description:
      "Our mission? Your privacy. We will never ask you for identifying information.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Sec */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Buy &amp; Sell Locally.
            <br />
            <span className="text-primary">Swap with Confidence.</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
            Spot Swap is a modern, anonymous marketplace for your neighborhood.
            List items, message sellers, and meet at suggested safe locations 
            without needing a social media account.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="px-8 py-3 rounded-xl bg-primary text-white text-lg font-semibold hover:bg-primary-hover transition-colors shadow-lg"
            >
              Browse Listings
            </Link>
            <Link
              href="/signup"
              className="px-8 py-3 rounded-xl border-2 border-primary text-primary text-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Spot Swap?
          </h2>
          <p className="text-center text-muted mb-12 max-w-xl mx-auto">
            A better way to trade simply, safely, and with confidence
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-background rounded-2xl p-6 border border-border hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Sec */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Create an Account</h3>
              <p className="text-muted text-sm">
                Sign up in seconds with just an email.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">List or Browse</h3>
              <p className="text-muted text-sm">
                Post items for sale or browse local listings.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Meet and Swap</h3>
              <p className="text-muted text-sm">
                Agree on a price, meet at a safe spot, and swap.
              </p>
            </div>
          </div>
        </div>
      </section>

      { }
      <section className="py-16 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to start swapping?</h2>
          <p className="text-blue-100 mb-8">
            Join Spot Swap today and discover what your neighbors are selling.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 rounded-xl bg-white text-primary font-semibold text-lg hover:bg-gray-800 transition-colors"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}
