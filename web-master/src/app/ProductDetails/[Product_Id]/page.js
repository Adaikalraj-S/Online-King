"use client";
import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";

import DealComponent from "../../HomePage/DealComponent";
import HeaderMain from "../../HomePage/HeaderMain";
import headphone from "../../Asset/HeadphoneBoat.svg";
import Footer from "../../HomePage/Footer";
import wishList from "../../Asset/WishListProduct.svg";
import offer from "../../Asset/OffersProduct.svg";
import productView from "../../Asset/ProductView.svg";
import rupee from "../../Asset/Rupee.svg";
import addtocart from "../../Asset/AddToCart.svg";
import CardComponent from "./CardComponent";
import Image from "next/image";
import Hero from "@/app/HomePage/Hero";
import axios from "../../../../axios";
import { getProductVariants } from "@/app/api";
import Link from "next/link";
import { useSnackbar } from "@/app/SnackBarProvider";
import { useRouter } from "next/navigation";
import { IoAddCircle } from "react-icons/io5";
import { IoRemoveCircleSharp } from "react-icons/io5";
import { CartContext } from "@/app/Context/CartContext";
import TabsDetails from "@/app/components/productDetails/TabsDetails";
import Recomended from "@/app/components/productDetails/utils/Recomended";
import ProductAttributes from "@/app/components/productDetails/attributes/ProductAttributes";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import useProductStore from "@/app/storeContext/store";
import RecomendedComponent from "@/app/HomePage/RecomendedComponent";
import FeaturesComponent from "@/app/HomePage/FeaturesComponent";
import ImageGallery from "@/app/HomePage/ImageGallery";
import RecommendedProductsCarousel from "@/app/components/utils/RecommendedProductsCarousel";
import Navbar from "@/app/components/Navbar/Navbar";
import {
  MdOutlineShoppingCartCheckout,
  MdShoppingCartCheckout,
} from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import WebSpecials from "@/app/HomePage/WebSpeciails";

const Page = ({ params }) => {
  const {
    fetchWishListData,
    fetchCartDetails,
    handleIncrement,
    cartCounter,
    count,
    handleDecrement,
  } = useContext(CartContext); // Use context values

  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleFaq, setIsVisibleFaq] = useState(false);

  const [isVisibleWarranty, setIsVisibleWarranty] = useState(false);
  const [dataProductDetails, setdataProductDetails] = useState({});

  // const [count, setCount] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [inStock, setInStock] = useState(false);
  const [cartData, setCartData] = useState([]);
  const {
    productDetails,
    fetchProductDetails,
    addToCart,
    fetchCartData,
    handleIncreaseQuantity,
    wishlistData,
    fetchWishlistData,
    handleAddToWishlist,
    wishlistCount,
    handleRemoveFromWishlist,
    addToPreOrderCart,
  } = useProductStore();
  console.log(productDetails, "data");

  const { RecomendedProducts, RecomendedFetch } = useProductStore();
  console.log("RecomendedProducts", RecomendedProducts);

  useEffect(() => {
    if (productDetails?.id) {
      RecomendedFetch(productDetails.id);
    }
  }, [productDetails]);

  const { openSnackbar } = useSnackbar();
  const decodedParam = params.Product_Id;
  // console.log("decodeparem")
  // console.log(decodedParam)
  const router = useRouter();


  useEffect(() => {
    let type = 'id' 
    if (typeof decodedParam == 'string') {
      type = 'name'
    }
    fetchCartData();
    fetchProductDetails(decodedParam, type)
  }, [decodedParam]);

  // if (count < 0) {
  //   alert("Items cannot be negative");
  // }
  // const price =
  //   dataProductDetails.length > 0 ? dataProductDetails[0].default_price : 0;
  // const discountType =
  //   dataProductDetails.length > 0
  //     ? dataProductDetails[0].discount_type
  //     : "percent";
  // const discount =
  //   dataProductDetails.length > 0 ? dataProductDetails[0].discount : 0;
  // const defaultPrice =
  //   dataProductDetails.length > 0 ? dataProductDetails[0].default_price : 0;

  const stock = productDetails?.length > 0 ? productDetails.stock : "null";

  const stockAvailability = () => {
    setInStock(stock);
  };

  //-------------------------ADDTOCart--------------------------------------------
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    if (!combinationId && productDetails.stock) {
      if (quantity < productDetails.stock) {
        setQuantity(quantity + 1);
      } else {
        openSnackbar("Maximum quantity reached", "error");
      }
      return;
    } else if (combinationId && productDetails.product_attributes_associations.find(e => e.id == combinationId)) {
      if (quantity < productDetails.product_attributes_associations.find(e => e.id == combinationId).stock) {
        setQuantity(quantity + 1);
      } else if (quantity < productDetails.product_attributes_associations.find(e => e.id == combinationId).pre_order_limit) {
        setQuantity(quantity + 1);
      } else {
        openSnackbar("Maximum quantity reached", "error");
      }
    } else if (productDetails.pre_order_availability) {
      if (quantity < productDetails.pre_order_limit) {
        setQuantity(quantity + 1);
      } else {
        openSnackbar("Maximum quantity reached", "error");
      }
    } else {
      openSnackbar("Maximum quantity reached", "error");
    }
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // ---------------------------Attributes----------------------------------------
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [price, setPrice] = useState(productDetails?.default_price || 0);
  const [combinationId, setCombinationId] = useState(null);
  const [combinationStock, setCombinationStock] = useState(null);
  const [preOrderLimit, setPreOrderLimit] = useState(null);

  useEffect(() => {
    if (productDetails?.default_price) {
      setPrice(productDetails.default_price);
    }
  }, [productDetails]);
  console.log(selectedAttributes, "selected-attr");
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
      console.log(selectedCombination, "comb");
      if (selectedCombination) {
        setPrice(selectedCombination.price);
        setCombinationId(selectedCombination.id);
        console.log(selectedCombination.stock, "stock-combination");
        setCombinationStock(selectedCombination.stock);
        if (productDetails.pre_order_availability) {
          setPreOrderLimit(selectedCombination.pre_order_limit);
        }
      } else {
        setPrice(productDetails.default_price);
        if (productDetails?.pre_order_availability) {
          setPreOrderLimit(selectedCombination?.pre_order_limit);
        }
      }
    }
  }, [selectedAttributes, productDetails]);

  //------------------------------------------WISHLIST------------------------------------

  const isInWishlist = wishlistData.some(
    (item) =>
      item.product_id == productDetails?.id &&
      (combinationId ? item.combination_id === combinationId : true)
  );
  console.log(isInWishlist, "isInWishlist");
  useEffect(() => {
    fetchWishlistData();
  }, []);

  const handleWishlistClick = () => {
    if (isInWishlist) {
      console.log("not in wishlist");
      handleRemoveFromWishlist(
        productDetails,
        combinationId,
        openSnackbar,
        router
      );
    } else {
      console.log("in wishlist");
      handleAddToWishlist(productDetails, combinationId, openSnackbar, router);
    }
  };

  // -------------------------------Wishlist Ended--------------------------------------------

  const convertInRupee = (number) => {
    return number?.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const finalPrice = (
    defaultPrice = 0,
    discount = 0,
    discountType = "percent"
  ) => {
    if (discountType === "percent") {
      return defaultPrice - defaultPrice * (discount / 100);
    } else if (discountType === "amount") {
      return defaultPrice - discount;
    } else {
      console.error("Invalid discount type or data");
      return defaultPrice; // Fallback to default price
    }
  };

  const descriptionLines = productDetails?.product_desc?.split("\n");

  const productImages = productDetails?.images?.map(
    (image) => `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${image?.image_url}`
  );
  const handlePreOrder = () => {
    console.log("pre-order");
  };
  return (
    <div>
      <Navbar />
      <Hero />
      <div className="flex flex-col flex-grow font-fontNew">
        <div
          className="flex flex-col md:flex-row md:items-start"
          style={{ paddingTop: "20px" }}
        >
          <div className="hidden md:block p-4 sticky">
            <ImageGallery screen="lg" images={productImages} />
          </div>
          <div className="md:hidden p-4 sticky">
            <ImageGallery screen="sm" images={productImages} />
          </div>

          <div className="flex p-4 md:w-[50%] md:px-20 justify-center md:justify-start">
            <div className="w-full">
              <div className="md:px-8 flex flex-col gap-4">
                <h2 className="font-bold text-2xl md:text-2xl py-2 md:py-2 capitalize">
                  {productDetails?.product_name || "BrandName not available"}

                  {productDetails?.product_brand?.brand_name && (
                    <Link
                      href={`/brands/${productDetails?.product_brand?.brand_name}/${productDetails?.product_brand?.id}`}
                    >
                      <h1 className="text-base md:text-[15px] py-3 font-bold text-gray-500 hover:underline underline hover:underline-offset-4 cursor-pointer hover:text-green-500">
                        {productDetails?.product_brand?.brand_name}
                      </h1>
                    </Link>
                  )}
                </h2>
                <div className="flex gap-2 md:gap-4 items-center">
                  <p className="text-xl md:text-2xl">
                    {convertInRupee(
                      finalPrice(
                        price,
                        productDetails?.discount,
                        productDetails?.discount_type
                      )
                    )}
                  </p>
                  <p className="line-through text-red-600 text-xl md:text-2xl">
                    {convertInRupee(price)}
                  </p>
                </div>
                <div className="flex gap-2 md:gap-2 items-center">
                  <label htmlFor="check">
                    {combinationId ? (
                      <input
                        type="checkbox"
                        name="checkBoxForInStock"
                        id="check"
                        className="w-4 md:w-6 bg-green-600"
                        checked={combinationStock}
                        readOnly
                      />
                    ) : (
                      <input
                        type="checkbox"
                        name="checkBoxForInStock"
                        id="check"
                        className="w-4 md:w-6 bg-green-600"
                        checked={productDetails?.stock > 0}
                        readOnly
                      />
                    )}
                  </label>
                  <p className="text-base md:text-lg font-bold">In stock</p>
                </div>
                <div className="flex gap-3 md:gap-5 items-center">
                  <ProductAttributes
                    attributes={productDetails?.product_attributes_associations}
                    onAttributeChange={setSelectedAttributes}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4 md:gap-7 md:items-center">
                  <div className="flex gap-6 items-center">
                    <p className="font-bold text-base md:text-base py-2 md:py-4">
                      Quantity
                    </p>
                    <div className="flex gap-2 md:gap-2 border-solid border-2 border-gray md:h-[2rem] items-center">
                      <button onClick={handleDecrease}>
                        <IoRemoveCircleSharp className="text-2xl md:text-2xl" />
                      </button>
                      <p>{quantity}</p>
                      <button onClick={handleIncrease}>
                        <IoAddCircle className="text-2xl md:text-2xl" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 transition duration-300 cursor-pointer">
                    {(combinationStock || productDetails?.stock) ? (
                      <Image
                        src={addtocart}
                        className="h-10 w-24 md:h-[3rem] md:w-[10rem] hover:shadow-l"
                        alt="AddToCart"
                        onClick={() =>
                          addToCart(
                            productDetails,
                            selectedAttributes,
                            quantity,
                            openSnackbar,
                            router
                          )
                        }
                      />
                    ) : (productDetails?.pre_order_availability) ? (
                      <button
                        onClick={() =>
                          addToPreOrderCart(
                            productDetails,
                            selectedAttributes,
                            quantity,
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
                      <div></div>
                    )}

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
                  {/* <div className="flex items-center gap-6 transition duration-300 cursor-pointer">
                    {(!combinationStock &&
                      productDetails.pre_order_availability) ||
                    (!productDetails.stock &&
                      productDetails.pre_order_availability) ? (
                      <button
                        onClick={() =>
                          addToPreOrderCart(
                            productDetails,
                            selectedAttributes,
                            quantity,
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
                      <Image
                        src={addtocart}
                        className="h-10 w-24 md:h-[3rem] md:w-[10rem] hover:shadow-l"
                        alt="AddToCart"
                        onClick={() =>
                          addToCart(
                            productDetails,
                            selectedAttributes,
                            quantity,
                            openSnackbar,
                            router
                          )
                        }
                      />
                    )}

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
                  </div> */}
                </div>
                {(!combinationStock && !productDetails?.stock && productDetails?.pre_order_availability) ? (
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-base md:text-base py-2 md:py-4">
                      Pre Order Estd. Delivery
                    </p>

                    <span className="text-green-600 inline-flex gap-2">
                      <TbTruckDelivery size={24} />
                      {productDetails?.estd_pre_order_processing_time} days
                      processing time
                    </span>
                  </div>
                ) : null}
                <div>
                  <div
                    className="listStyle p-4"
                    style={{ fontSize: "14px" }}
                    dangerouslySetInnerHTML={{
                      __html: productDetails?.product_desc,
                    }}
                  />
                </div>
                {/* <div>
                  <div className="flex">
                    <FeaturesComponent
                      features={productDetails?.features_associations}
                    />
                  </div>
                </div> */}
                <hr />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="md:px-20 px-4">
            <TabsDetails params={decodedParam} data={productDetails} />
          </div>

          <div className="px-4">
            <div>
              <RecommendedProductsCarousel productId={params.product_Id} />
            </div>
          </div>
        </div>
      </div>
      <WebSpecials />
      <Footer />
    </div>
  );
};

export default Page;
