"use client";
import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import {
  FaHeart,
  FaTruck,
  FaTag,
  FaShoppingCart,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import {
  MdShoppingCartCheckout,
} from "react-icons/md";
import "react-multi-carousel/lib/styles.css";
import useProductStore from "../../storeContext/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSnackbar } from "../../SnackBarProvider";
import { Box, Rating, Tooltip } from "@mui/material";

const Carousel = lazy(() => import("react-multi-carousel"));

const ProductAttributesCards = lazy(
  () => import("../utils/ProductAttributesCards")
);

const ProductCard = ({ product }) => {
  const {
    handleAddToWishlist,
    handleRemoveFromWishlist,
    wishlistData,
    addToCart,
    addToPreOrderCart,
  } = useProductStore();

  const { openSnackbar } = useSnackbar();

  const router = useRouter();

  const {
    id,
    images ,
    product_name,
    discount,
    discount_type ,
    average_rating ,
    total_ratings ,
    CustomerReviews,
  } = product; 
  // console.log(222, product_name, product);

  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [price, setPrice] = useState(product?.default_price || 0);
  const [rating, setrating] = useState(average_rating || 0);
  const [combinationId, setCombinationId] = useState(null);
  const [showAttributes, setShowAttributes] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  

  useEffect(() => {
    setrating(CustomerReviews?.reduce((acc, review, _, arr) => acc + review.rating / arr.length, 0))
  }, [CustomerReviews])

  useEffect(() => {
    if (product?.product_attributes_associations?.length) {
      const selectedCombination = product?.product_attributes_associations.find(
        (combination, ind) => {
          for (const [key, value] of Object.entries(selectedAttributes)) {
            const attribute = combination.attributes_combinations.find(
              (attr) =>
                attr.product_attribute?.attribute_name === key &&
                attr.attribute_value === value
            );
            if (!attribute) return false;
          }
          return true;
        }
      );
      if (selectedCombination && Object.keys(selectedAttributes).length == 0) {
        let sle = {}
        for (const attri of selectedCombination.attributes_combinations) {
          sle[attri?.product_attribute?.attribute_name] = attri?.attribute_value
        }
        setSelectedAttributes(sle)
      }

      if (selectedCombination) {
        setPrice(selectedCombination.price);
        setCombinationId(selectedCombination.id);
      } else {
        setPrice(product?.default_price);
        setShowAlert("No variant available");
      }
    }
  }, [selectedAttributes, product]);

  const finalPrice = (discount_type, discount, price) => {
    if (combinationId && product?.product_attributes_associations?.length) {
      if (product.is_offer_avl) {
        if (product?.offer_discount_type?.toLowerCase()?.trim() == "percent") {
          return convertInRupee(Number(product.product_attributes_associations.find(e => e.id == combinationId)?.price) - Number(product.product_attributes_associations.find(e => e.id == combinationId)?.price) * (Number(product?.offer_discount)/100));
        } else if (discount_type == "amount") {
          return convertInRupee(Number(product.product_attributes_associations.find(e => e.id == combinationId)?.price) - Number(product?.offer_discount));
        }
      } else {
        if (product?.offer_discount_type?.toLowerCase()?.trim() == "percent") {
          return convertInRupee(Number(product.product_attributes_associations.find(e => e.id == combinationId)?.price) - Number(product.product_attributes_associations.find(e => e.id == combinationId)?.price) * (Number(discount)/100));
        } else if (discount_type == "amount") {
          return convertInRupee(Number(product.product_attributes_associations.find(e => e.id == combinationId)?.price) - Number(discount));
        }
      }
      return convertInRupee(Number(product.product_attributes_associations.find(e => e.id == combinationId)?.price));
    } else {
      if (product.is_offer_avl) {
        if (product?.offer_discount_type?.toLowerCase()?.trim() == "percent") {
          return convertInRupee(Number(price) - Number(price) * (Number(product?.offer_discount)/100));
        } else if (discount_type == "amount") {
          return convertInRupee(Number(price) - Number(product?.offer_discount));
        }
      } else {
        if (product?.offer_discount_type?.toLowerCase()?.trim() == "percent") {
          return convertInRupee(Number(price) - Number(price) * (Number(discount)/100));
        } else if (discount_type == "amount") {
          return convertInRupee(Number(price) - Number(discount));
        }
      }
      return convertInRupee(price);
    }
  }
  
  const convertInRupee = (number) => {
    return number?.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const isInWishlist = useMemo(() => {
    return wishlistData.some(
      (item) =>
        item.product_id === id &&
        (combinationId ? item.combination_id === combinationId : true)
    );
  }, [wishlistData, id, combinationId]);

  const handleWishlistClick = () => {
    if (isInWishlist) {
      handleRemoveFromWishlist(product, combinationId, openSnackbar, router);
    } else {
      handleAddToWishlist(product, combinationId, openSnackbar, router);
    }
  };

  const responsive = useMemo(
    () => ({
      desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
      tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
      mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
    }),
    []
  );

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 relative">
      {/* Image Carousel */}
      <Suspense fallback={<div>Loading...</div>}>
        <Carousel arrows={false} responsive={responsive} autoPlay infinite>
          {images?.map((image, index) => (
            <Link key={index} href={`/ProductDetails/name/${encodeURIComponent(product_name.replaceAll('/', '-SPLIT-'))}`}>
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${image.image_url}`}
                alt={`Product image ${index}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            </Link>
          ))}
        </Carousel>
      </Suspense>

      {/* Discount Badge */}

      <div className="flex justify-between py-4 items-center">
        {discount ? (
          <div className=" bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            Flat {discount}
            {discount_type.toLowerCase() === "percent" ? "% off" : "off"}
          </div>
        ) : (
          <></>
        )}
        {/* Product Actions */}
        <div className="flex justify-between items-center mt-2 gap-4">
          <Tooltip
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            arrow
          >
            <button
              onClick={handleWishlistClick}
              className={`text-2xl ${isInWishlist ? "text-red-500" : "text-gray-500 hover:text-gray-800"} hover:scale-105 transition`}
            >
              <FaHeart />
            </button>
          </Tooltip>

          <Tooltip
            title={showAttributes ? "Hide variant" : "Show variants"}
            arrow
          >
            <button
              onClick={() => setShowAttributes((prev) => !prev)}
              className={`text-xl text-gray-500 hover:text-gray-800 hover:scale-105 transition`}
            >
              {showAttributes ? <FaEye /> : <FaEyeSlash />}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Product Name */}
      <h3 className="font-bold mt-2 !h-[50px] line-clamp-2 hover:text-blue-500">
        <Link href={`/ProductDetails/name/${encodeURIComponent(product_name?.replaceAll('/', '-SPLIT-'))}`}>{product_name}</Link>
      </h3>

      {/* Product Rating */}
      <Box className="flex items-center my-2">
        <Rating
          value={rating || 5}
          precision={0.5}
          readOnly
          size="small"
        />
        <span className="m-2 text-[12px] font-[400px]">
          {rating || 5}
        </span>
        <span className="text-[12px] text-gray-600">
          ({CustomerReviews?.length || 0})
        </span>
      </Box>

      {/* Features */}
      <div className="flex space-x-2 text-sm text-gray-600 mb-2">
        <div className="flex items-center">
          <FaTruck className="mr-1" />
          Fast Delivery
        </div>

        <div className="flex items-center">
          <FaTag className="mr-1" />
          Best Price
        </div>
      </div>

      {/* Add attributes selection */}
      {showAttributes &&
        product?.product_attributes_associations?.length > 0 && (
          <div className="w-full z-10 rounded h-64 absolute top-0 left-0 bg-white bg-opacity-75 transition-transform duration-600 ease-in-out">
            {/* Content goes here */}
            {/* Add attributes selection */}
            <Suspense fallback={<div>Loading attributes...</div>}>
              <div className="flex justify-center items-center h-full">
                <ProductAttributesCards
                  attributes={product?.product_attributes_associations}
                  onAttributeChange={setSelectedAttributes}
                />
              </div>
            </Suspense>
          </div>
        )}

      {showAlert && showAttributes ? (
        <div className="absolute text-[12px] top-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-slate-200 p-2 rounded-full z-20">
          {showAlert}
        </div>
      ) : null}
        {/* <div>{JSON.stringify(selectedAttributes)}</div> */}

      {/* Price and Add to Cart */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col items-center">
          <span className="font-bold">
            {finalPrice(product?.discount_type, product?.discount, product?.default_price)}
          </span>
          <span className="text-[red] line-through text-sm font-[400]">
            {convertInRupee(product?.default_price)}
          </span>
        </div>
        {(!product?.stock && !combinationId && product?.pre_order_availability && product?.pre_order_stock ) ? (
          <button
            onClick={() =>
              addToPreOrderCart(
                product,
                selectedAttributes,
                1,
                openSnackbar,
                router
              )
            }
            className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded text-white flex items-center gap-2 justify-between"
          >
            <span className="inline-block text-2xl hover:translate-x-1 transition-transform duration-300 ease-in-out">
              <MdShoppingCartCheckout />
            </span>
            <span>Pre Order</span>
          </button>
        ) : (combinationId && product?.pre_order_availability && product?.product_attributes_associations?.find(e => e.id == combinationId)?.pre_order_stock ) ? (
          <button
            onClick={() =>
              addToPreOrderCart(
                product,
                selectedAttributes,
                1,
                openSnackbar,
                router
              )
            }
            className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded text-white flex items-center gap-2 justify-between"
          >
            <span className="inline-block text-2xl hover:translate-x-1 transition-transform duration-300 ease-in-out">
              <MdShoppingCartCheckout />
            </span>
            <span>Pre Order</span>
          </button>
        ) : (!product?.product_attributes_associations?.length &&   product?.stock) ? (
          <>
          <button
            className="flex items-center text-white px-4 py-2 sm:text-sm rounded hover:scale-105 transition"
            style={{ backgroundColor: "rgb(69, 179, 70)" }} // Set the background color
            onClick={() =>
              addToCart(
                product, 
                selectedAttributes, 
                "", 
                openSnackbar, 
                router
                )
            }
          >
            <FaShoppingCart className="mr-2" />
            Add to cart
          </button>
          </>
        ) : (combinationId && product?.product_attributes_associations?.find(e => e.id == combinationId)?.stock ) ? (
          <>
          <button
            className="flex items-center text-white px-4 py-2 sm:text-sm rounded hover:scale-105 transition"
            style={{ backgroundColor: "rgb(69, 179, 70)" }} // Set the background color
            onClick={() =>
              addToCart(
                product, 
                selectedAttributes, 
                "", 
                openSnackbar, 
                router
                )
            }
          >
            <FaShoppingCart className="mr-2" />
            Add to cart
          </button>
          </>
        ) : (combinationId && product?.product_attributes_associations?.find(e => e.id == combinationId)?.pre_order_stock ) ? (
          <button
            onClick={() =>
              addToPreOrderCart(
                product,
                selectedAttributes,
                1,
                openSnackbar,
                router
              )
            }
            className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded text-white flex items-center gap-2 justify-between"
          >
            <span className="inline-block text-2xl hover:translate-x-1 transition-transform duration-300 ease-in-out">
              <MdShoppingCartCheckout />
            </span>
            <span>Pre Order</span>
          </button>
        ) : (
          <div className="text-[14x] text-[red] font-[500] drop-shadow-xl">OUT OF STOCK</div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
