"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import axios from "../../../../../axios";
import { useSnackbar } from "@/app/SnackBarProvider"; // Import your custom Snackbar hook

const RatingsReview = ({ CustomerReviews, params }) => {
  const { openSnackbar } = useSnackbar(); // Use your custom Snackbar hook
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    reviewHeading: "",
    reviewText: "",
    rating: 0,
  });
  const [images, setImages] = useState([]);

  const averageRating =
    reviews.reduce((acc, curr) => acc + curr.review_stars, 0) / reviews.length || 0;
  const totalRatings = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((review) => review.review_stars === star).length
  );

  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("productId", params);
      formData.append("reviewHeading", newReview.reviewHeading);
      formData.append("reviewText", newReview.reviewText);
      formData.append("rating", newReview.rating);
      formData.append("image_count", images.length);

      images.forEach((image, index) => {
        formData.append(`photos${index + 1}`, image);
      });

      const response = await axios.post(
        // "http://103.86.177.4:8888/api/add-product-review",
        "/api/add-product-review",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      );

      if (response.data.status === "success") {
        setReviews([
          ...reviews,
          {
            ...newReview,
            createdAt: new Date().toISOString(),
            status: "pending",
          },
        ]);
        setNewReview({ reviewHeading: "", reviewText: "", rating: 0 });
        setImages([]);
        openSnackbar("Your review is uploaded successfully", "success");
        window.location.reload();
      }

    } catch (error) {
      console.error("Error adding review:", error);
      openSnackbar("Failed to upload your review", "error");
    }
   
  };
  
  useEffect(() => {  
    const ShowReviews = async () => {
      const response = await axios.get(
        `/api/get-reviews-by-customer-on-products?productId=${params}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      );
      setReviews(response.data.data);
    };
    ShowReviews();
  }, [params]);
  

  return (
    <div className="py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        {/* Ratings Summary */}
        <div className="w-full md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
          <h2 className="hidden md:block text-2xl font-bold mb-2">
            Customer Ratings & Reviews
          </h2>
          <h2 className="md:hidden text-2xl font-bold mb-2 flex flex-col items-center">
            <span>Customer Ratings</span>
            <span className="text-3xl font-normal leading-none">&</span>
            <span>Reviews</span>
          </h2>
          <div className="flex items-center">
            <Rating
              name="average-rating"
              value={averageRating}
              precision={0.1}
              readOnly
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarIcon fontSize="inherit" />}
            />
            <span className="text-xl font-medium ml-2">
              {averageRating.toFixed(1)} out of 5
            </span>
          </div>
          <p className="text-sm text-gray-500">{totalRatings} ratings</p>
          <div className="w-full max-w-lg mt-4">
            {[5, 4, 3, 2, 1].map((star, index) => (
              <div key={star} className="flex items-center mb-1">
                <span className="text-sm font-medium">{star} star</span>
                <div className="w-full bg-gray-200 rounded-full h-2 mx-2">
                  <div
                    className="bg-[#45B348] h-2 rounded-full"
                    style={{
                      width: `${((ratingCounts[5 - star] / totalRatings) * 100).toFixed(2)}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {ratingCounts[5 - star]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews and Add Review Form */}
        <div className="w-full md:w-2/3">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {reviews
              .filter((review) => review.status === "approved")
              .map((review, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center mb-2">
                      <Rating
                        name={`review-rating-${index}`}
                        value={Number(review.review_stars)}
                        readOnly
                        icon={<StarIcon fontSize="inherit" />}
                        emptyIcon={<StarIcon fontSize="inherit" />}
                      />
                      {/* <span className="ml-2 text-sm text-gray-600">
                        {review.review_heading}
                      </span> */}
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      {review.review_heading}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {review.review_text}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Reviewed on{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                    {review.CustomerReviewImages &&
                      review.CustomerReviewImages.length > 0 && (
                        <div className="mt-4 flex gap-2">
                          {review.CustomerReviewImages.map(
                            (image, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${image.image_url}`}
                                alt={`Review Image ${imgIndex + 1}`}
                                className="w-20 h-20 object-cover rounded"
                              />
                            )
                          )}
                        </div>
                      )}
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>

          {/* Add Review Form */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Add Your Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-2">
                <label
                  htmlFor="reviewHeading"
                  className="block text-sm font-medium text-gray-700"
                >
                  Heading
                </label>
                <input
                  type="text"
                  name="reviewHeading"
                  id="reviewHeading"
                  value={newReview.reviewHeading}
                  onChange={handleReviewChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="reviewText"
                  className="block text-sm font-medium text-gray-700"
                >
                  Review
                </label>
                <textarea
                  name="reviewText"
                  id="reviewText"
                  rows="4"
                  value={newReview.reviewText}
                  onChange={handleReviewChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rating
                </label>
                <Rating
                  name="rating"
                  value={newReview.rating}
                  onChange={(e, newValue) =>
                    setNewReview({ ...newReview, rating: newValue })
                  }
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarIcon fontSize="inherit" />}
                  required
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Images
                </label>
                <input
                  type="file"
                  name="images"
                  id="images"
                  multiple
                  onChange={handleImageChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <button
                type="submit"
                className="bg-[#45B348] text-white py-2 px-4 rounded-lg mt-2"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingsReview;
