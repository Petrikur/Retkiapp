import React from "react";
import {
  FaCampground,
  FaHiking,
  FaFish,
  FaWineBottle,
  FaMapMarkerAlt,
  FaTrash,
} from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BiCompass } from "react-icons/bi";
import Image from "next/image";
import { Place } from "@/app/types";

import image from "@/app/images/ruunaa.jpg";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place | null;
  onDelete: (placeId: string) => void;
}

const categoryIcons = {
  yöpyminen: FaCampground,
  patikointi: FaHiking,
  kalastus: FaFish,
  viinanjuonti: FaWineBottle,
} as const;

const ViewModal = ({ isOpen, onClose, place, onDelete }: ViewModalProps) => {
  if (!isOpen || !place) return null;

  const handleDelete = async () => {
    if (place._id) {
      await onDelete(place._id);
      onClose();
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) =>
          index < rating ? (
            <AiFillStar key={index} className="text-yellow-400 text-xl" />
          ) : (
            <AiOutlineStar key={index} className="text-yellow-400 text-xl" />
          )
        )}
      </div>
    );
  };

  const categories = Array.isArray(place.category) ? place.category : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative z-50 w-full max-w-4xl bg-gray-800 rounded-lg shadow-xl m-4">
        {/* Header Image Section */}
        <div className="relative h-64 w-full">
          <Image
            src={image || "/placeholder-image.jpg"}
            alt={place.name}
            className="w-full h-full object-cover rounded-t-lg"
            width={800}
            height={400}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-800/80 p-2 rounded-full text-white hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Title and Categories */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">{place.name}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category, index) => {
                const IconComponent =
                  categoryIcons[category as keyof typeof categoryIcons];
                return (
                  <div
                    key={`${category}-${index}`}
                    className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-full"
                  >
                    {IconComponent && (
                      <IconComponent className="text-blue-400" />
                    )}
                    <span className="text-gray-200 capitalize">{category}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <FaMapMarkerAlt className="text-red-500" />
              <span>
                Koordinaatit: {place.position[0].toFixed(4)},{" "}
                {place.position[1].toFixed(4)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <BiCompass className="text-blue-400" />
              <span>Osoite: {place.address || "Ei määritetty"}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Kuvaus</h3>
            <p className="text-gray-300">
              {place.description || "No description available."}
            </p>
          </div>

          {/* Reviews Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Arvostelut
            </h3>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                {renderStars(5)}
                <span className="text-gray-300">5.0 - (15 ääntä)</span>
              </div>

              {/* Sample Review */}
              <div className="border-t border-gray-600 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(5)}
                  <span className="text-gray-400 text-sm">2 days ago</span>
                </div>
                <p className="text-gray-300">
                  "Great camping spot with beautiful views. The facilities
                  wereclean and well-maintained."
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
            >
              Peruuta
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FaTrash />
              Poista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
