import React from "react";
import Image from "next/image";
import headphone from "../Asset/headphone.svg";
import rupee from "../Asset/Rupee.svg";
import StarRating from "./ratings";
import Link from "next/link";

const ListingCardComponent = ({ actualData = {} }) => {
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

  // const image=actualData.images?.[0]?.image_url || 'image'
  const imageUrl =
    actualData.images && actualData.images.length > 0
      ? `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${actualData.images[0].image_url}`
      : null;

  return (
    <>
      <div className=" flex flex-col bg-[#D9D9D9]  py-6 shadow-xl rounded-xl items-center">
        <div>
          <Image src={headphone} alt="" className=" size-44" />
        </div>
        <div className=" py-4">
          <div>
            <h1 className="  text-xl">
              {actualData.product_name || "Brand not available"}
            </h1>
          </div>
          <div className=" flex">
            <StarRating />
            <p>1200</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 py-3">
            <Image
              src={rupee}
              alt="rupee"
              className="w-4 h-4 lg:w-auto lg:h-auto"
            />
            <p className="text-xl lg:text-3xl font-bold">
              {finalPrice(defaultPrice, discount, discountType)}
            </p>
            <p className="text-sm lg:text-base">M.R.P</p>
            <Image
              src={rupee}
              alt="rupee"
              className="w-4 h-4 lg:w-auto lg:h-auto"
            />
            <p className="line-through text-sm lg:text-base">{price}</p>
            <p className="text-sm lg:text-base">({actualData.discount}%off)</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm lg:text-base">FREE Delivery:</h1>
              <p className="text-base lg:text-xl font-bold">Fri, 12th April</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ListingCardComponent;
