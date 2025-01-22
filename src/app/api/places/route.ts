import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import Place from "@/app/models/Place";
export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const formData = await request.json(); // Expecting JSON, not FormData
    const { name, description, category, position } = formData;

    if (!name || !position) {
      return NextResponse.json(
        { error: "Name and position are required" },
        { status: 400 }
      );
    }

    // Clean categories
    const cleanedCategories = category.map((cat: string) =>
      cat.toLowerCase().trim()
    );

    const data = {
      name: name,
      description: description,
      category: cleanedCategories,
      position: position,
      image: "",
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

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const places = await Place.find({}).lean();

    return NextResponse.json(places);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 }
    );
  }
}
