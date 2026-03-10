import React, { useEffect, useState } from "react";
import Image from "next/image";
import speaker from "../Asset/Speaker.svg";
import rupee from "../Asset/Rupee.svg";
import addtocart from "../Asset/NewArrivalCartIcon.svg";
import wishlistProduct from "../Asset/WishListProduct.svg";
import useProductStore from "../storeContext/store";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../SnackBarProvider";
import ProductAttributesCards from "../components/utils/ProductAttributesCards";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";

function ProductList({ productDetails }) {
  const {
    addToCart,
    wishlistData,
    fetchWishlistData,
    handleAddToWishlist,
    wishlistCount,
    handleRemoveFromWishlist,
  } = useProductStore();

  const { openSnackbar } = useSnackbar();
  const router = useRouter();

  const finalPrice = (defaultPrice, discount, discountType) => {
    if (discountType === "percent") {
      return defaultPrice - defaultPrice * (discount / 100);
    } else if (discountType === "amount") {
      return defaultPrice - discount;
    } else {
      throw new Error("Invalid discount type");
    }
  };

  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [price, setPrice] = useState(productDetails?.default_price || 0);
  const [combinationId, setCombinationId] = useState(null);

  useEffect(() => {
    if (productDetails?.default_price) {
      setPrice(productDetails.default_price);
    }
  }, [productDetails]);

  useEffect(() => {
    if (productDetails?.product_attributes_associations) {
      const selectedCombination =
        productDetails.product_attributes_associations.find((combination) => {
          for (const [key, value] of Object.entries(selectedAttributes)) {
            const attribute = combination.attributes_combinations.find(
              (attr) =>
                attr.product_attribute.attribute_name === key &&
                attr.attribute_value === value
            );
            if (!attribute) {
              return false;
            }
          }
          return true;
        });

      if (selectedCombination) {
        setPrice(selectedCombination.price);
        setCombinationId(selectedCombination.id);
      } else {
        setPrice(productDetails.default_price);
      }
    }
  }, [selectedAttributes, productDetails]);

  //------------------------------------------WISHLIST------------------------------------

  const isInWishlist = wishlistData.some(
    (item) =>
      item.product_id == productDetails.id &&
      (combinationId ? item.combination_id === combinationId : true)
  );
  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  const handleWishlistClick = () => {
    if (isInWishlist) {
      handleRemoveFromWishlist(
        productDetails,
        combinationId,
        openSnackbar,
        router
      );
    } else {
      handleAddToWishlist(productDetails, combinationId, openSnackbar, router);
    }
  };

  // -------------------------------Wishlist Ended--------------------------------------------

  const convertInRupee = (number) => {
    // console.log(number);
    return number.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <>
      <div className="relative p-4 border rounded-t-3xl shadow-lg flex flex-col items-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        {productDetails.offer && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-200 text-red-600 px-3 py-1 rounded-full">
            Limited time offer
          </div>
        )}
        <div className="w-full h-60 bg-white flex justify-center items-center rounded-t-md overflow-hidden">
          <Link
            href={`/ProductDetails/${productDetails.id}`}
            className="flex justify-center"
          >
            <img
              className="w-3/4 h-[235px] object-contain"
              src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${productDetails.images[0]?.image_url}`}
              alt="Product Image"
            />
          </Link>
        </div>

        <div className="flex flex-col justify-between h-[280px]">
          <p className="mt-4 font-semibold text-center h-[50px] hover:underline">
            <Link href={`/ProductDetails/${productDetails.id}`}>
              {productDetails.product_name}
            </Link>
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-lg font-bold">
              {convertInRupee(
                finalPrice(
                  price,
                  productDetails.discount,
                  productDetails.discount_type
                )
              )}
            </p>
            {price && (
              <p className="text-red-600 line-through text-lg">
                {convertInRupee(price)}
              </p>
            )}
          </div>
          <div className="flex gap-2 md:gap-2 items-center justify-center overflow-x-auto">
            <ProductAttributesCards
              attributes={productDetails?.product_attributes_associations}
              onAttributeChange={setSelectedAttributes}
            />
          </div>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              className="flex items-center bg-gray-200 px-4 py-2 rounded-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() =>
                addToCart(
                  productDetails,
                  selectedAttributes,
                  "",
                  openSnackbar,
                  router
                )
              }
            >
              <Image
                src={addtocart}
                alt="Add to Cart"
                className="w-6 h-6 mr-2"
              />
              <span className="text-lg font-semibold">Add to Cart</span>
            </button>

            <div className="transition duration-300 cursor-pointer">
              {!isInWishlist ? (
                <FaHeart
                  className="text-[20px] transition duration-300"
                  onClick={handleWishlistClick}
                />
              ) : (
                <FaHeart
                  className="text-red-500 text-[20px] transition duration-300"
                  onClick={handleWishlistClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList;
