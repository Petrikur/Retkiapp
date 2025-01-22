// app/api/places/[id]/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import Place from "@/app/models/Place";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const deletedPlace = await Place.findByIdAndDelete(id);

    if (!deletedPlace) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Place deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { error: "Failed to delete place" },
      { status: 500 }
    );
  }
}
