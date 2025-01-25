import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface RenderStarsProps {
  rating: number;
  isInteractive?: boolean;
  onRatingChange?: (newRating: number) => void;
}

const RenderStars: React.FC<RenderStarsProps> = ({
  rating,
  isInteractive = false,
  onRatingChange,
}) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <button
          key={index}
          onClick={() =>
            isInteractive && onRatingChange && onRatingChange(index + 1)
          }
          className={isInteractive ? "cursor-pointer" : ""}
          disabled={!isInteractive}
          type="button"
        >
          {index < rating ? (
            <AiFillStar className="text-yellow-400 text-xl" />
          ) : (
            <AiOutlineStar className="text-yellow-400 text-xl" />
          )}
        </button>
      ))}
    </div>
  );
};

export default RenderStars;
