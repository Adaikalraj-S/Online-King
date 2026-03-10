"use client";
import HeaderMain from "../HomePage/HeaderMain";
import Hero from "../HomePage/Hero";
import { MdDelete } from "react-icons/md";
import Image from "next/image";
import axios from "../../../axios";
import Swal from 'sweetalert2'
import { useState, useEffect, useContext } from "react";
import { useSnackbar } from "../SnackBarProvider";
import { CartContext } from "../Context/CartContext";
import useProductStore from "../storeContext/store";
import Link from "next/link";
import ProductCard from "../components/ProductCard/ProductCard";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../HomePage/Footer";
import WebSpecials from "../HomePage/WebSpeciails";

const Page = () => {
  const { openSnackbar } = useSnackbar();
  const { fetchWishListData, wishListData } = useContext(CartContext);

  useEffect(() => {
    fetchWishListData();
  }, []);

  const { wishlistCount } = useProductStore();
  const removeFromWish = (productId) => {
    Swal.fire({
      title: "Remove from Wishlist",
      text: "Are you sure you want to remove this item from your wishlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Remove it",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            "/api/remove-from-wishlist",
            { product_id: productId },
            {
              headers: {
                Authorization: localStorage.getItem("onlineKingWebToken"),
              },
            }
          )
          .then((res) => {
            if (res.data.status === "success") {
              openSnackbar(res.data.message, "success");
              fetchWishListData(); // Update the wishlist count or UI
            } else {
              openSnackbar(res.data.message, "error");
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  };
  

  const addToCart = (data) => {
    const token = localStorage.getItem("onlineKingWebToken");
    const productToAdd = {
      product_id: data.id,
      combination_id: data.combination_id || null,
      quantity: 1,
    };

    if (token) {
      axios
        .post("/api/add-to-cart", productToAdd, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          if (res.data.status === "success") {
            openSnackbar(res.data.message, "success");
            fetchWishListData();
          } else if (res.data.message === "Product is already in the cart") {
            openSnackbar(res.data.message, "error");
          } else {
            openSnackbar("Login Required", "error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const localCart = JSON.parse(localStorage.getItem("localCartData")) || [];
      const productExists = localCart.some(
        (item) =>
          item.product_id === data.id &&
          item.combination_id === data.combination_id
      );

      if (productExists) {
        openSnackbar("Product is already in the cart", "error");
      } else {
        const updatedCart = [...localCart, productToAdd];
        localStorage.setItem("localCartData", JSON.stringify(updatedCart));
        openSnackbar("Product added to cart", "success");
      }
    }
  };
    console.log(wishListData, "wish list data");
  return (
    <div>
      {/* <HeaderMain /> */}
      <Navbar />
      <Hero />
      <div className="flex flex-col justify-center py-14 px-4 md:px-14">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-center">My WishList</h1>
          <br />
        </div>
        <div className="w-full">
          {wishListData.filter(e => e.product).length === 0 ? (
            <h2 className="text-center text-xl text-gray-500">
              Your wishlist is empty!
            </h2>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {" "}
              {/* 5 columns on large screens */}
              {wishListData.filter(e => e.product).map((value) => {
                const product = value?.product;
                const productImageUrl =
                  product?.images?.length > 0
                    ? `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${product?.images[0]?.image_url}`
                    : "./Asset/NoImage.png"; // Fallback image

                // Find the matching combination by combination_id
                const matchedCombination =
                  product?.product_attributes_associations.find(
                    (assoc) => assoc.id === value?.combination_id
                  );

                // Fetch price based on whether matched combination exists
                const productPrice = matchedCombination
                  ? matchedCombination.price // Use combination price if available
                  : product?.default_price; // Fallback to default price

                const attributeCombination =
                  matchedCombination &&
                  matchedCombination.attributes_combinations.length > 0
                    ? matchedCombination.attributes_combinations
                        .map((comb) => comb.attribute_value)
                        .join(", ")
                    : "N/A";
                    

                return (
                 
                
                <ProductCard product={value.product} />
 
                );
              })}
            </div>
          )}
        </div>
      </div>
      <WebSpecials />
      <Footer />
    </div>
  );
};

export default Page;
