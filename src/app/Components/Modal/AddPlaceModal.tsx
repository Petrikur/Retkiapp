import React from "react";
import { PlaceFormData } from "@/app/types";
import AddPlaceForm from "../Places/AddPlaceForm";

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlace: (placeData: PlaceFormData) => void;
  position: [number, number] | null;
}

const AddPlaceModal = ({
  isOpen,
  onClose,
  onAddPlace,
  position,
}: AddPlaceModalProps) => {
  if (!isOpen || !position) return null;

  const handleAddPlace = async (placeData: PlaceFormData) => {
    await onAddPlace(placeData);
    onClose(); // Close modal after add
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative z-50 w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <AddPlaceForm
          position={position}
          onSubmit={handleAddPlace}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default AddPlaceModal;
