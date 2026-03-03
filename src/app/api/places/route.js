/*
  This page is the API route for fetching safe meeting spots based on a city name using the Google Places API to return safe meeting spots.
*/
import { NextResponse } from "next/server";

const SAFE_PLACE_TYPES = [
  "police station",
  "public library",
  "Starbucks",
  "coffee shop",
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { error: "City parameter is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey || apiKey === "google_places_api_key") {
    return NextResponse.json({
      places: [
        { name: "Local Police Station", address: `Police station in ${city}` },
        { name: "Public Library", address: `Library in ${city}` },
        { name: "Starbucks", address: `Starbucks location in ${city}` },
        { name: "Local Coffee Shop", address: `Coffee shop in ${city}` },
      ],
    });
  }

  try {
    const allPlaces = [];

    for (const type of SAFE_PLACE_TYPES) {
      const searchQuery = `${type} in ${city}`;
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        searchQuery
      )}&key=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.results) {
        const topResults = data.results.slice(0, 2).map((place) => ({
          name: place.name,
          address: place.formatted_address,
          rating: place.rating || null,
        }));
        allPlaces.push(...topResults);
      }
    }

    // Limit to 6 places and no dupes
    const uniquePlaces = [];
    const seen = new Set();
    for (const place of allPlaces) {
      if (!seen.has(place.name)) {
        seen.add(place.name);
        uniquePlaces.push(place);
      }
      if (uniquePlaces.length >= 6) break;
    }

    return NextResponse.json({ places: uniquePlaces });
  } catch (error) {
    console.error("Google Places API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch safe meeting spots" },
      { status: 500 }
    );
  }
}
