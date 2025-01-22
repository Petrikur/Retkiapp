"use client";
import { useState, useEffect } from "react";
import Map from "./Components/Map/Map";
import SearchResult from "./Components/Search/Searchresult";
import Modal from "./Components/Modal/Modal";
import AddPlaceForm from "./Components/Places/AddPlaceForm";
import "leaflet/dist/leaflet.css";

interface Place {
  _id?: string;
  name: string;
  position: [number, number];
  description?: string;
  category: string[];
}

interface PlaceFormData {
  name: string;
  description: string;
  category: string[];
  position: [number, number];
  image: File | null;
}

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

  const handleMapClick = (lat: number, lng: number) => {
    setNewPlacePosition([lat, lng]);
    setIsAddModalOpen(true);
  };

  const handleMarkerClick = (place: Place) => {
    setSelectedPlace(place);
    setIsViewModalOpen(true);
  };

  const handleAddPlace = async (placeData: PlaceFormData) => {
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

  const handleDeletePlace = async (placeId: string) => {
    try {
      const response = await fetch(`/api/places/${placeId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete place");

      setPlaces(places.filter((place) => place._id !== placeId));
      setFilteredPlaces(
        filteredPlaces.filter((place) => place._id !== placeId)
      );
      setIsViewModalOpen(false);
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 overflow-y-auto bg-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-white">Retki app</h1>

        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-700 text-white placeholder-gray-400"
            placeholder="Etsi paikkaa..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="space-y-4">
          {filteredPlaces.map((place) => (
            <SearchResult key={place._id} place={place} />
          ))}
        </div>
      </div>

      <div className="w-2/3 relative">
        <Map
          places={filteredPlaces}
          onMapClick={handleMapClick}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <div className="p-6">
          {selectedPlace && (
            <>
              <SearchResult place={selectedPlace} />
              <button
                onClick={() =>
                  selectedPlace._id && handleDeletePlace(selectedPlace._id)
                }
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
              >
                Poista
              </button>
            </>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewPlacePosition(null);
        }}
      >
        {newPlacePosition && (
          <AddPlaceForm
            position={newPlacePosition}
            onSubmit={handleAddPlace} // Pass to parent handler
            onClose={() => {
              setIsAddModalOpen(false);
              setNewPlacePosition(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
