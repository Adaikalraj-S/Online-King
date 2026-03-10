"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/app/SnackBarProvider";
import axios from "axios";
import HeaderMain from "@/app/HomePage/HeaderMain";
import Footer from "@/app/HomePage/Footer";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import Link from "next/link";

const MyWishlist = () => {
  const { openSnackbar } = useSnackbar();
  const router = useRouter();
  const [wishlistData, setWishlistData] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = useCallback(() => {
    axios
      .get("/api/get-all-wishlists", {
        headers: {
          Authorization: localStorage.getItem("onlinekingtoken"),
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setWishlistData(res.data.data);
        } else {
          openSnackbar(res.data.message, "error");
        }
      })
      .catch((err) => {
        console.error("Error fetching wishlist:", err);
        openSnackbar("An error occurred while fetching wishlist", "error");
      });
  }, [openSnackbar]);

  const handleRemoveFromWishlist = (wishlistId) => {
    axios
      .delete(`/api/remove-from-wishlist/${wishlistId}`, {
        headers: {
          Authorization: localStorage.getItem("onlinekingtoken"),
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          openSnackbar("Item removed from wishlist successfully", "success");
          fetchWishlist(); // Refresh the wishlist data
        } else {
          openSnackbar(res.data.message, "error");
        }
      })
      .catch((err) => {
        console.error("Error removing item from wishlist:", err);
        openSnackbar("An error occurred while removing item from wishlist", "error");
      });
  };

  const convertInRupee = (number) => {
    return number?.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div>
      <div className="py-[2rem] font-fontNew">
        <div className="container mx-auto p-4 text-xl">
          <h1 className="text-2xl font-bold mb-4 text-center">My Wishlist</h1>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "40%" }}>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wishlistData.length > 0 ? (
                  wishlistData.map((item) => (
                    <TableRow key={item.id} className="text-center">
                      <TableCell>
                        <div className="flex items-center gap-4 transition duration-300">
                          <Link href={`/ProductDetails/${item.product.id}`} className="hover:translate-y-0.5 ">
                            <img
                              src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${item.product.images?.[0]?.image_url}`}
                              alt={item.product.product_name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          </Link>
                          <div className="flex flex-col">
                            <Link href={`/ProductDetails/${item.product.id}`} className="hover:underline">
                              {item.product.product_name}
                            </Link>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{convertInRupee(item.product.default_price)}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          variant="contained"
                          color="secondary"
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="py-4 text-center">
                      Your wishlist is empty
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default MyWishlist;
