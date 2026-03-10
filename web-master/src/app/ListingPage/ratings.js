// components/StarRating.js
"use client"
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ totalStars = 5 }) => {
  const [rating, setRating] = useState(0);

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              className="hidden"
              onClick={() => setRating(ratingValue)}
            />
            <FaStar
              size={30}
              className={`cursor-pointer transition-colors duration-200 ${
                ratingValue <= rating ? 'text-yellow-900' : 'text-yellow-400'
              }`}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
