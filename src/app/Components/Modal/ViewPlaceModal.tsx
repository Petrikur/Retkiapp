import React, { useState, useEffect } from "react";
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

import image from "@/app/images/laavu2.jpg";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place | null;
  onDelete: (placeId: string) => void;
  onPlaceUpdate?: (updatedPlace: Place) => void;
}

const categoryIcons = {
  yöpyminen: FaCampground,
  patikointi: FaHiking,
  kalastus: FaFish,
  viinanjuonti: FaWineBottle,
} as const;

const ViewModal = ({
  isOpen,
  onClose,
  place,
  onDelete,
  onPlaceUpdate,
}: ViewModalProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localPlace, setLocalPlace] = useState<Place | null>(place);

  useEffect(() => {
    setLocalPlace(place);
    if (place?._id) {
      fetchReviews();
      fetchUpdatedPlace();
    }
  }, [place?._id]);

  const fetchUpdatedPlace = async () => {
    if (!place?._id) return;

    try {
      const response = await fetch(`/api/places/${place._id}`);
      if (response.ok) {
        const updatedPlace = await response.json();
        setLocalPlace(updatedPlace);
        if (onPlaceUpdate) {
          onPlaceUpdate(updatedPlace);
        }
      }
    } catch (error) {
      console.error("Failed to fetch updated place:", error);
    }
  };

  const fetchReviews = async () => {
    if (!place?._id) return;

    try {
      const response = await fetch(`/api/reviews?placeId=${place._id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (!place?._id || !newReview.comment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placeId: place._id,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (response.ok) {
        await Promise.all([fetchReviews(), fetchUpdatedPlace()]);
        setIsWritingReview(false);
        setNewReview({ rating: 5, comment: "" });
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, isInteractive = false) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <button
            key={index}
            onClick={() =>
              isInteractive && setNewReview({ ...newReview, rating: index + 1 })
            }
            className={`${isInteractive ? "cursor-pointer" : ""}`}
            disabled={!isInteractive}
            type="button"
          >
            {index < (isInteractive ? newReview.rating : rating) ? (
              <AiFillStar className="text-yellow-400 text-xl" />
            ) : (
              <AiOutlineStar className="text-yellow-400 text-xl" />
            )}
          </button>
        ))}
      </div>
    );
  };

  if (!isOpen || !place) return null;

  const categories = Array.isArray(place.category) ? place.category : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative z-50 w-full max-w-4xl bg-gray-800 rounded-lg shadow-xl m-4 flex flex-col max-h-[90vh]">
        {/* Header Section */}
        <div className="relative flex-shrink-0">
          <div className="relative h-64 w-full">
            <Image
              // src={place.image || "/placeholder-image.jpg"}
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
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto p-6 
          [&::-webkit-scrollbar]:w-2 
          [&::-webkit-scrollbar-track]:bg-gray-800 
          [&::-webkit-scrollbar-thumb]:bg-blue-500
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:border-2
          [&::-webkit-scrollbar-thumb]:border-transparent
          [&::-webkit-scrollbar-thumb]:bg-clip-padding
          [&::-webkit-scrollbar-thumb]:hover:bg-blue-400"
        >
          {/* Rest of the content remains the same */}

          {/* Title and Categories */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">{place.name}</h2>
            <div className="flex flex-wrap gap-2">
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
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <FaMapMarkerAlt className="text-red-500" />
              <span>
                Osoite: {place.address} - {place.zip} - {place.country} -{" "}
                {place.city}
              </span>
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Arvostelut</h3>
              <button
                onClick={() => setIsWritingReview(!isWritingReview)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Kirjoita arvostelu
              </button>
            </div>

            {/* New Review Form */}
            {isWritingReview && (
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Rating</label>
                  {renderStars(newReview.rating, true)}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Arvostelusi
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Jaa mietteesi paikasta..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsWritingReview(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                  >
                    Peruuta
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting || !newReview.comment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  >
                    {isSubmitting ? "Lähettää..." : "Kirjoita arvostelu"}
                  </button>
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                {renderStars(localPlace?.averageRating || 0)}
                <span className="text-gray-300">
                  {localPlace?.averageRating?.toFixed(1)} - ({reviews.length}{" "}
                  arvostelua)
                </span>
              </div>

              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-t border-gray-600 pt-4 mt-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-gray-400 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="border-t border-gray-700 p-4 flex-shrink-0">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
            >
              Sulje
            </button>
            <button
              onClick={() => place._id && onDelete(place._id)}
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
