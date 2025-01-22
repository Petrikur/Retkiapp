import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import Review from "@/app/models/Review";
import Place from "@/app/models/Place";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const { placeId, rating, comment } = await request.json();

    if (!placeId || !rating || !comment) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await Review.create({
      placeId,
      rating,
      comment,
    });

    // Update place's average rating and review count
    const allReviews = await Review.find({ placeId });
    const averageRating =
      allReviews.reduce((acc, curr) => acc + curr.rating, 0) /
      allReviews.length;

    await Place.findByIdAndUpdate(placeId, {
      averageRating: Number(averageRating.toFixed(1)),
      reviewCount: allReviews.length,
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const url = new URL(request.url);
    const placeId = url.searchParams.get("placeId");

    if (!placeId) {
      return NextResponse.json(
        { error: "Place ID is required" },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ placeId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
