import React, { useState } from "react";

import SearchResult from "../Search/Searchresult";
import { Place } from "@/app/types";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place | null;
  onDelete: (placeId: string) => void; // Function to handle delete
}

const ViewModal = ({ isOpen, onClose, place, onDelete }: ViewModalProps) => {
  if (!isOpen || !place) return null;

  const handleDelete = async () => {
    if (place._id) {
      await onDelete(place._id);
      onClose(); // Close modal after delete
    }
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

        <SearchResult place={place} />

        <button
          onClick={handleDelete}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Poista
        </button>
      </div>
    </div>
  );
};

export default ViewModal;
