import React, { useCallback, useState, useEffect, useContext } from 'react';
import img from "../Asset/earphone.svg"
import rupee from "../Asset/Rupee.svg"
import addtocart from "../Asset/NewArrivalCartIcon.svg"
import wishlistProduct from "../Asset/WishListProduct.svg"
import Image from 'next/image';
import { useSnackbar } from '../SnackBarProvider';
import axios from "../../../axios"
import { CartContext } from '../Context/CartContext';
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import useAuthStore from '../authStore';
import { useRouter } from 'next/navigation';
import useProductStore from '../storeContext/store';
import ProductAttributesCards from '../components/utils/ProductAttributesCards';


const ProductComponent = ({ productDetails }) => {
  const router = useRouter()

  const { openSnackbar } = useSnackbar();
  const { fetchWishListData, fetchCartDetails, cartData } = useContext(CartContext);
  const { fetchCartData, addToCart, wishlistData, fetchWishlistData, handleAddToWishlist, wishlistCount, handleRemoveFromWishlist } = useProductStore()



  const finalPrice = (defaultPrice, discount, discountType) => {
    if (discountType === "percent") {
      return defaultPrice - (defaultPrice * (discount / 100));
    }
    else if (discountType === 'Amount') {
      return defaultPrice - discount;
    } else {
      throw new Error('Invalid discount type');
    }
  }


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
      const selectedCombination = productDetails.product_attributes_associations.find(combination => {
        for (const [key, value] of Object.entries(selectedAttributes)) {
          const attribute = combination.attributes_combinations.find(attr => attr.product_attribute.attribute_name === key && attr.attribute_value === value);
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

  const isInWishlist = wishlistData.some((item) => item.product_id == productDetails.id && (combinationId ? item.combination_id === combinationId : true));
  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);


  const handleWishlistClick = () => {
    if (isInWishlist) {
      handleRemoveFromWishlist(productDetails, combinationId, openSnackbar, router);
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
    <div className='w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg border-2 rounded-md bg-gray-200 shadow-lg flex flex-col justify-between'>
      <div className='w-[100%] h-[235px] bg-white flex justify-center rounded-t-md'>
        <img className='w-[100%] h-[100%] object-contain' src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${productDetails.images[0]?.image_url}`} alt="Product Image" />
      </div>
      <div className='flex flex-col w-full h-[310px] justify-center items-center px-3 py-3 gap-3'>
        <div className='flex flex-col gap-2 mt-3'>
          <p className='font-semibold h-[100px] text-center'>{productDetails.product_name ? productDetails.product_name : 'Brand not available'}</p>
          <div className='flex items-center justify-center'>
            <p className='text-lg font-semibold text-gray-800 item'>{convertInRupee(finalPrice(price, productDetails.discount, productDetails.discount_type))}</p>
            {productDetails.discount > 0 && (
              <p className='text-red-500 line-through text-lg ml-2'>{convertInRupee(price)}</p>
            )}
          </div>

          <div className="flex gap-2 md:gap-2 items-center justify-center overflow-x-auto">
            <ProductAttributesCards
              attributes={productDetails?.product_attributes_associations}
              onAttributeChange={setSelectedAttributes}
            />
          </div>
        </div>
        <div className='flex items-center gap-2 mt-2'>
          <div className='flex items-center justify-center gap-2 w-36 h-14 rounded-lg border bg-gray-300 hover:scale-105 hover:shadow-lg cursor-pointer' onClick={() => addToCart(productDetails, selectedAttributes, '', openSnackbar, router)}>
            <FaShoppingCart className='text-xl' />
            <span className='font-semibold'>Add to Cart</span>
          </div>
          <div className="transition duration-300 cursor-pointer">
            {!isInWishlist ? (
              <FaHeart className="text-[20px] transition duration-300" onClick={handleWishlistClick} />
            ) : (
              <FaHeart className="text-red-500 text-[20px] transition duration-300" onClick={handleWishlistClick} />
            )}
          </div>
        </div>
      </div>

    </div>

  )
}

export default ProductComponent
