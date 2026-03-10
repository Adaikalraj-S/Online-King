// components/HighlyRatedCardComponent.js
import React from "react";
import Rating from "../ListingPage/ratings";
import rupee from "../Asset/Rupee.svg";
import Image from "next/image";
import keyboard from "../Asset/Keyboard.svg";

const HighlyRatedCardComponent = ({ actualData = {} }) => {
  const price = actualData.default_price ?? 0;
  const discountType = actualData.discount_type ?? "percent";
  const discount = actualData.discount ?? 0;
  const defaultPrice = actualData.default_price ?? 0;

  const finalPrice = (defaultPrice, discount, discountType) => {
    if (discountType === "percent") {
      return defaultPrice - defaultPrice * (discount / 100);
    } else if (discountType === "amount") {
      return defaultPrice - discount;
    } else {
      throw new Error("Invalid discount type");
    }
  };

  return (
    <div className="py-5 sm:py-10">
      <div className="font-sans  rounded-lg mx-auto mb-5 w-full max-w-lg">
        <div className=" shadow-lg bg-white rounded-lg">
          <div className="flex justify-center">
            <Image
              src={keyboard}
              alt="keyboard"
              className="w-full rounded-t-lg"
            />
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className="px-5">
            <h2 className="py-3 text-xl">
              {actualData.product_name || "Brand not available"}
            </h2>
          </div>
          <div className="px-5 py-4">
            <div className="rounded-t-lg bg-[#BE1E2D] w-full lg:w-[15rem] h-auto py-2  px-3">
              <p className="text-white text-2xl">Limited time Offer</p>
            </div>
          </div>
          <div className="px-5 gap-2 lg: flex">
            <Rating />
            <p className="text-xl">1,200</p>
          </div>
          <div className="py-4 px-5">
            <div className="flex  gap-2">
              <Image src={rupee} alt="rupee" className="w-5 h-5" />
              <p className="text-3xl font-bold">{price}</p>
              <p>M.R.P</p>
              <Image src={rupee} alt="rupee" className="w-5 h-5" />
              <p className="line-through">
                {finalPrice(defaultPrice, discount, discountType)}
              </p>
              <p>(60% off)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlyRatedCardComponent;
