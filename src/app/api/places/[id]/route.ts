import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import Place from "@/app/models/Place";
import Review from "@/app/models/Review";
import mongoose from "mongoose";
import { getAuth } from "firebase-admin/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    await connectToDatabase();
    const place = await Place.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
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
          reviews: 0,
        },
      },
    ]).exec();

    if (!place[0]) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json(place[0]);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Failed to fetch place" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    // Validate the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the ID token
    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);

    // Check if the user has an admin role
    if (decodedToken.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();
    await Review.deleteMany({ placeId: id });

    // Delete the place
    const deletedPlace = await Place.findByIdAndDelete(id);
    if (!deletedPlace) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Place and associated reviews deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { error: "Failed to delete place" },
      { status: 500 }
    );
  }
}
