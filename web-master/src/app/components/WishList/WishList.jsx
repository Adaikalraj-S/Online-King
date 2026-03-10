"use client"
import useProductStore from '@/app/storeContext/store'
import { useSnackbar } from "../../SnackBarProvider";

import React, { useEffect } from 'react'
import ProductCard from '../ProductCard/ProductCard';

const WishList = () => {
  const {fetchWishlistData, wishlistData, handleAddToWishlist,
    handleRemoveFromWishlist,addToCart,} = useProductStore();
    useEffect(() => {
      fetchWishlistData()
    },[])
  return (
    <div className="w-full">
      <h1 className='text-center font-bold mb-4'>My Wishlist</h1>
    {wishlistData.length === 0 ? (
      <h2 className="text-center text-xl text-gray-500">
        Your wishlist is empty!
      </h2>
    ) : (
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {" "}
        {/* 5 columns on large screens */}
        {wishlistData.map((value) => {
          return (
            <ProductCard product={value.product} />
          );
        })}
      </div>
    )}
  </div>
  )
}

export default WishList