import React, { useEffect, useContext, useState } from "react";
import Image from "next/image";
import rupee from "../Asset/Rupee.svg";
import Keyboard from "../Asset/Keyboard.svg";
import addtocart from "../Asset/AddToCartIcon.svg";
import { useSnackbar } from "../SnackBarProvider";
import useProductStore from "../storeContext/store";
import { useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa";
import ProductAttributesCards from "../components/utils/ProductAttributesCards";
import Link from "next/link";

const RecomendedComponent = ({ productDetails }) => {
  const {
    DealOfTheDayProducts,
    RecomendedFetch,
    fetchCartData,
    addToCart,
    wishlistData,
    fetchWishlistData,
    handleAddToWishlist,
    wishlistCount,
    handleRemoveFromWishlist,
  } = useProductStore();

  useEffect(() => {
    RecomendedFetch(productDetails.id);
  }, []);

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
                attr.product_attribute?.attribute_name === key &&
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
      <div className="flex justify-center">
        <div className="bg-white w-full max-w-xs p-4 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto rounded-md shadow-xl flex flex-col justify-evenly">
          <div className="w-full h-[235px] bg-white flex justify-center items-center rounded-t-md overflow-hidden">
            <Link
              href={`/ProductDetails/${productDetails.id}`}
              className="flex justify-center items-center"
            >
              <img
                className="object-cover"
                src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${productDetails.images[0]?.image_url}`}
                style={{ width: "250px", height: "200px", borderRadius:'8px' }}
                alt="Product Image"
              />
            </Link>
          </div>

          <div className="flex flex-col h-[310px] justify-between items-center gap-3 p-4">
            <h2 className="text-lg h-[100px] font-semibold text-gray-800 text-center">
              <Link
                href={`/ProductDetails/${productDetails.id}`}
                className="hover:underline"
              >
                {productDetails.product_name}
              </Link>
            </h2>
            <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-semibold text-gray-800">
                {convertInRupee(
                  finalPrice(
                    price,
                    productDetails.discount,
                    productDetails.discount_type
                  )
                )}
              </p>
              {productDetails.discount > 0 && (
                <p className="text-red-500 line-through text-lg ml-2">
                  {convertInRupee(price)}
                </p>
              )}
            </div>
            <div className="flex gap-2 md:gap-2 items-center overflow-x-auto">
              <ProductAttributesCards
                attributes={productDetails?.product_attributes_associations}
                onAttributeChange={setSelectedAttributes}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 focus:bg-gray-400 focus:outline-none rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition duration-300 transform hover:scale-105 cursor-pointer"
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
                <Image src={addtocart} alt="Add to Cart" className="w-6 h-6" />
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
      </div>
    </>
  );
};

export default RecomendedComponent;
