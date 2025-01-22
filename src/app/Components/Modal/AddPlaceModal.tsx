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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative z-50 w-full max-w-4xl mx-4 bg-gray-800 rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-7 text-gray-200 hover:text-white"
        >
          ✕
        </button>

        <div
          className="max-h-[95vh] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-2 
            [&::-webkit-scrollbar-track]:bg-gray-800 
            [&::-webkit-scrollbar-thumb]:bg-blue-500
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:border-2
            [&::-webkit-scrollbar-thumb]:border-transparent
            [&::-webkit-scrollbar-thumb]:bg-clip-padding
            [&::-webkit-scrollbar-thumb]:hover:bg-blue-400"
        >
          <AddPlaceForm
            position={position}
            onSubmit={handleAddPlace}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default AddPlaceModal;
