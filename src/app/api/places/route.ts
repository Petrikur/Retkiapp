import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import Place from "@/app/models/Place";
// import Review from "@/app/models/Review";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    // Use aggregation to get places with their average ratings
    const places = await Place.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "placeId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $eq: [{ $size: "$reviews" }, 0] },
              then: 0,
              else: { $avg: "$reviews.rating" },
            },
          },
          reviewCount: { $size: "$reviews" },
        },
      },
      {
        $project: {
          reviews: 0, // Remove the reviews array from the final output
        },
      },
    ]);

    return NextResponse.json(places);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const formData = await request.json();
    const { name, description, category, position } = formData;

    if (!name || !position) {
      return NextResponse.json(
        { error: "Name and position are required" },
        { status: 400 }
      );
    }

    const cleanedCategories = category.map((cat: string) =>
      cat.toLowerCase().trim()
    );

    const data = {
      name,
      description,
      category: cleanedCategories,
      position,
      image: "",
      averageRating: 0, // Initialize with 0
      reviewCount: 0, // Initialize with 0
    };

    const place = await Place.create(data);
    return NextResponse.json(place);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Failed to create place" },
      { status: 500 }
    );
  }
}
