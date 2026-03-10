import StarRating from '@/app/ListingPage/ratings';
import Image from 'next/image';
import React from 'react'
import keyboard from '../../../Asset/Keyboard.svg';
import Link from 'next/link';


const HighRatedProductCards = ({ actualData, convertInRupee }) => {

  const price = actualData.default_price ?? 0;
  const discountType = actualData.discount_type ?? 'percent';
  const discount = actualData.discount ?? 0;
  const defaultPrice = actualData.default_price ?? 0;

  const finalPrice = (defaultPrice, discount, discountType) => {
    if (discountType === "percent") {
      return defaultPrice - (defaultPrice * (discount / 100));
    } else if (discountType === 'amount') {
      return defaultPrice - discount;
    } else {
      throw new Error('Invalid discount type');
    }
  };
  return (

    <>
      <div className='flex flex-col border-2 rounded-md w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg h-[40rem] bg-white shadow-lg items-center'>
        <div className='w-[100%] h-[100%] bg-white flex justify-center rounded-t-md'>
          <img className='w-[100%] h-[100%] object-contain' src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${actualData.images[0]?.image_url}`} alt="Product Image" />
        </div>
        <div className='flex flex-col items-center justify-center p-4'>
          <p className='text-center font-semibold'>{actualData.product_name ? actualData.product_name : 'Product Name Not Available'}</p>
          <div className='mt-2'>
            <StarRating />
          </div>
          <div className='px-5 py-4'>
            <div className='rounded-t-lg bg-[#BE1E2D] w-full lg:w-[15rem] h-auto py-2  px-3'>
              <p className='text-white text-2xl'>Limited time Offer</p>
            </div>
          </div>
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
    </>
  )
}

export default HighRatedProductCards
