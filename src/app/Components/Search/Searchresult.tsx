import React from "react";
import { FaCampground, FaHiking, FaFish, FaWineBottle } from "react-icons/fa";
import Image from "next/image";
import image from "@/app/images/laavu.jpg";
import { Place } from "@/app/types";
import RenderStars from "../utils/RenderStars";

interface SearchResultProps {
  place: Place;
  onClick: () => void;
}

const categoryIcons = {
  yöpyminen: FaCampground,
  patikointi: FaHiking,
  kalastus: FaFish,
  viinanjuonti: FaWineBottle,
} as const;

const SearchResult = ({ place, onClick }: SearchResultProps) => {
  const categories = Array.isArray(place.category) ? place.category : [];

  return (
    <div
      className="flex bg-gray-700 rounded-lg overflow-hidden mb-4 cursor-pointer hover:scale-105 transition-transform duration-200"
      onClick={onClick}
    >
      {/* Left side - Image */}
      <div className="w-1/3 relative">
        <Image
          src={image}
          width={200}
          height={200}
          alt={place.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Content */}
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <div className="flex flex-col flex-grow">
          {/* Category icons */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1 mb-2 flex-wrap">
              {categories.map((category, index) => {
                const IconComponent =
                  categoryIcons[category as keyof typeof categoryIcons];
                return (
                  <div
                    key={`${category}-${index}`}
                    className="flex items-center gap-2 border-2 border-gray-500 p-1 mb-1"
                  >
                    {IconComponent ? (
                      <IconComponent className="text-md text-blue-400" />
                    ) : (
                      <span className="text-xl text-gray-400">⚒️</span>
                    )}
                    <span className="text-sm text-gray-300 capitalize">
                      {category}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Title and Description */}
          <h3 className="text-xl font-bold text-white mb-2">{place.name}</h3>
          <p className="text-sm text-gray-300">
            {place.description ||
              `A beautiful location at coordinates: ${place.position[0].toFixed(
                4
              )}, ${place.position[1].toFixed(4)}`}
          </p>
        </div>

        {/* Reviews Section */}
        <div className="flex items-center gap-1 mt-4">
          {<RenderStars rating={Number(place.averageRating?.toFixed(1))} />}
          <span className="text-sm text-gray-300 ml-2">
            {place.averageRating?.toFixed(1) || "0.0"} - (
            {place.reviewCount || 0} ääntä)
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
