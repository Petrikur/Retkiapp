// app/lib/places.ts

import Place from "../models/Place";
export async function getPlaces() {
  try {
    // Fetch all places without filtering
    const places = await Place.find().sort({ createdAt: -1 }); // Sort by creation date
    return places;
  } catch (error) {
    console.error("Error fetching places:", error);
    throw error;
  }
}

export async function createPlace(data: any) {
  try {
    const place = new Place({
      name: data.name,
      description: data.description,
      category: data.category,
      position: data.position,
      imageUrl: "test", // Assuming you've handled image upload separately,
      city: data.city,
      country: data.country,
      address: data.address,
      zip: data.zip,
    });

    await place.save();
    return place;
  } catch (error) {
    console.error("Error creating place:", error);
    throw error;
  }
}
