"use client";
import { useState, useEffect } from "react";
import SearchResult from "./Components/Search/Searchresult";
import AddPlaceModal from "./Components/Modal/AddPlaceModal";
import ViewPlaceModal from "./Components/Modal/ViewPlaceModal";
import SearchBar from "./Components/Search/SearchBar";
import "leaflet/dist/leaflet.css";
import { Place } from "./types";
import dynamic from "next/dynamic";

export default function Home() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlacePosition, setNewPlacePosition] = useState<
    [number, number] | null
  >(null);

  const Map = dynamic(() => import("./Components/Map/Map"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-700" />,
  });

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch("/api/places");
        if (!response.ok) throw new Error("Failed to fetch places");
        const data = await response.json();
        setPlaces(data);
        setFilteredPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchPlaces();
  }, []);

  const handleAddPlace = async (placeData: Place) => {
    try {
      const response = await fetch("/api/places", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(placeData),
      });

      if (!response.ok) throw new Error("Failed to create place");

      const newPlace = await response.json();
      setPlaces((prevPlaces) => [...prevPlaces, newPlace]);
      setFilteredPlaces((prevPlaces) => [...prevPlaces, newPlace]);

      setIsAddModalOpen(false);
      setNewPlacePosition(null);
    } catch (error) {
      console.error("Error adding place:", error);
    }
  };

  const handleDeletePlace = async (placeId: string) => {
    try {
      const response = await fetch(`/api/places/${placeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete place");
      }

      setPlaces((prevPlaces) =>
        prevPlaces.filter((place) => place._id !== placeId)
      );
      setFilteredPlaces((prevFilteredPlaces) =>
        prevFilteredPlaces.filter((place) => place._id !== placeId)
      );
      setIsViewModalOpen(false);
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      setFilteredPlaces(places);
    } else {
      const searchQueryLower = query.toLowerCase();
      const results = places.filter(
        (place) =>
          place.name.toLowerCase().includes(searchQueryLower) ||
          place.category.some((cat) =>
            cat.toLowerCase().includes(searchQueryLower)
          ) ||
          place.description?.toLowerCase().includes(searchQueryLower)
      );
      setFilteredPlaces(results);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 overflow-y-auto bg-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-white">Retki app</h1>

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        <div className="space-y-4 ">
          {filteredPlaces.map((place) => (
            <SearchResult
              key={place._id}
              place={place}
              onClick={() => {
                setSelectedPlace(place);
                setIsViewModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-2/3 relative">
        <Map
          places={filteredPlaces}
          onMapClick={(lat, lng) => {
            setNewPlacePosition([lat, lng]);
            setIsAddModalOpen(true);
          }}
          onMarkerClick={(place) => {
            setSelectedPlace(place);
            setIsViewModalOpen(true);
          }}
        />
      </div>

      <ViewPlaceModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        place={selectedPlace}
        onDelete={handleDeletePlace}
      />

      <AddPlaceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewPlacePosition(null);
        }}
        onAddPlace={handleAddPlace}
        position={newPlacePosition}
      />
    </div>
  );
}
