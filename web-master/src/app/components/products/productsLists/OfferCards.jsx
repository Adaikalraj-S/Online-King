import StarRating from '@/app/ListingPage/ratings';
import Image from 'next/image';
import React from 'react';
import headphone from "../../../Asset/headphone.svg";
import rupee from "../../../Asset/Rupee.svg";

const OfferCards = ({ actualData, convertInRupee }) => {
  const price = actualData.product?.default_price ?? 0;

  const defaultPrice = actualData.product?.default_price ?? 0;
  const discountType = actualData.product?.discount_type ?? 'percent';
  const discount = actualData.product?.discount ?? 0;

  // Calculate the final price based on the discount type
  const finalPrice = (defaultPrice, discount, discountType) => {
    if (discountType === "percent") {
      return defaultPrice - (defaultPrice * (discount / 100));
    } else if (discountType === 'amount') {
      return defaultPrice - discount;
    } else {
      return defaultPrice; // No discount applied
    }
  };
  console.log("actualData11",actualData);

  const calculatedFinalPrice = finalPrice(defaultPrice, discount, discountType);

  return (
    <div className='flex flex-col border-2 rounded-md w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg h-[40rem] bg-white shadow-lg items-center'>
      {/* Product Image */}
      <div className='w-full h-full bg-white flex justify-center rounded-t-md'>
        <img
          className='w-full h-full object-contain'
          src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${actualData.product?.images[0]?.image_url}`}
          alt="Offer Image"
        />
      </div>

      {/* Product Details */}
      <div className='flex flex-col items-center justify-center p-4'>
        {/* Product Name */}
        <p className='text-center font-semibold'>
          {actualData.product?.product_name ? actualData.product?.product_name : 'Offer Name Not Available'}
        </p>

        {/* Star Rating */}
        <div className='mt-2'>
          <StarRating />
        </div>

        {/* Pricing */}
        <div className='flex items-center justify-center mt-2'>
      <p className='text-lg font-semibold text-gray-800'>
        {convertInRupee(finalPrice(defaultPrice, discount, discountType))}
      </p>
      {discount > 0 && (
        <p className='text-red-500 line-through text-lg ml-2'>
          {convertInRupee(price)}
        </p>
      )}
    </div>
      </div>
    </div>
  );
};

export default OfferCards;
