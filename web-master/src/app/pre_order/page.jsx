"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import HeaderMain from "../HomePage/HeaderMain";
import Hero from "../HomePage/Hero";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/app/SnackBarProvider";
import axios from "../../../axios";
import { CartContext } from "../Context/CartContext";
import Link from "next/link";
import useProductStore from "../storeContext/store";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import Footer from "../HomePage/Footer";
import { MdDelete } from "react-icons/md";
import Navbar from "../components/Navbar/Navbar";
import WebSpecials from "../HomePage/WebSpeciails";

const Page = () => {
  const {
    PreOrderCarts,
    handleRemoveFromPreOrderCart,
    handlePreCartIncreaseQuantity,
    handlePreCartDecreaseQuantity,
    PreOrderTotalPrice,
    fetchPreCartData,
    PreOrderCartsCount
  } = useProductStore();
  const router = useRouter();
  const { openSnackbar } = useSnackbar();

  console.log("cartDataShop", PreOrderCarts);

  const convertInRupee = (number) => {
    return number?.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    fetchPreCartData()
  },[])

  return (
    <div>
      {/* <HeaderMain /> */}
      <Navbar />
      <Hero />
      <div className="py-[2rem] font-fontNew">
        <div className="m-2 md:m-4">
          <h1 className="text-2xl font-bold mb-4 text-center">Pre Order Cart</h1>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  {/* Price column, hidden on small screens */}
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    Price
                  </TableCell>
                  {/* Quantity column, hidden on small screens */}
                  <TableCell
                    sx={{
                      display: { xs: "none", md: "table-cell" },
                      textAlign: "center",
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell sx={{ text: "center" }}>Total</TableCell>
                  {/* Actions column, hidden on small screens */}
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {PreOrderCarts.length > 0 ? (
                  PreOrderCarts.map((item) => (
                    <TableRow key={item.id}>
                      {/* Product information */}
                      <TableCell>
                        <div className="space-y-4">
                          <div className="md:flex md:items-center md:flex-row flex flex-col gap-4">
                            <Link
                              href={`/ProductDetails/name/${encodeURIComponent(item.product?.product_name.replaceAll('/', '-SPLIT-'))}`}
                              className="hover:translate-y-0.5"
                            >
                              <img
                                src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${item.product?.images[0]?.image_url}`}
                                alt="Product"
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            </Link>
                            <div className="flex flex-col">
                              <Link
                                href={`/ProductDetails/name/${encodeURIComponent(item.product?.product_name.replaceAll('/', '-SPLIT-'))}`}
                                className="hover:underline"
                              >
                                {item.product?.product_name}
                              </Link>
                              {item?.product_attributes_association
                                ?.combination && (
                                <span className="text-gray-500 uppercase">
                                  {
                                    item.product_attributes_association
                                      .combination
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="md:hidden flex items-center gap-2">
                          {
                            (Number(item?.product_attributes_association ? item?.product_attributes_association?.pre_order_stock : item.product?.pre_order_stock) >= item.quantity) ? (
                              <>
                              <IconButton
                                onClick={() =>
                                  handlePreCartDecreaseQuantity(item, openSnackbar)
                                }
                                disabled={item.quantity <= 1}
                                color="primary"
                              >
                                <IoRemoveCircle />
                              </IconButton>
                              <input
                                type="number"
                                value={item.quantity}
                                className="text-center border rounded py-[8px] w-12"
                                min="1"
                                readOnly
                              />
                              <IconButton
                                onClick={() =>
                                  handlePreCartIncreaseQuantity(item, openSnackbar)
                                }
                                color="primary"
                              >
                                <IoAddCircle />
                              </IconButton>
                              </>
                            ) : (
                              <>
                              <span className="text-red-500">Out of Stock</span>
                              </>
                            )
                          }
                          </div>
                        </div>
                      </TableCell>

                      {/* Price (hidden on small screens) */}
                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        {convertInRupee(item.unitPrice)}
                      </TableCell>

                      {/* Quantity (hidden on small screens) */}
                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        <div className="flex items-center justify-center gap-2">
                        {
                            (Number(item?.product_attributes_association ? item?.product_attributes_association?.pre_order_stock : item.product?.pre_order_stock) >= item.quantity) ? (
                              <>
                              <IconButton
                                onClick={() =>
                                  handlePreCartDecreaseQuantity(item, openSnackbar)
                                }
                                disabled={item.quantity <= 1}
                                color="primary"
                              >
                                <IoRemoveCircle />
                              </IconButton>
                              <input
                                type="number"
                                value={item.quantity}
                                className="text-center border rounded py-[8px] w-12"
                                min="1"
                                readOnly
                              />
                              <IconButton
                                onClick={() =>
                                  handlePreCartIncreaseQuantity(item, openSnackbar)
                                }
                                color="primary"
                              >
                                <IoAddCircle />
                              </IconButton>
                              </>
                            ) : (
                              <>
                              <span className="text-red-500">Out of Stock</span>
                              </>
                            )
                          }
                        </div>
                      </TableCell>

                      {/* Total */}
                      <TableCell>
                        <div className="flex flex-col gap-2 text-[14px]">
                          <span className="text-red-500 line-through !text-[12px]">
                            {item.product_attributes_association
                              ? convertInRupee(
                                  item.product_attributes_association.price *
                                    item.quantity
                                )
                              : convertInRupee(
                                  item.product?.default_price * item.quantity
                                )}
                          </span>
                          {convertInRupee(item.itemTotal)}
                        </div>
                        <div className="md:hidden flex items-center justify-center">
                        <MdDelete
                          onClick={() =>
                            handleRemoveFromPreOrderCart(item, openSnackbar)
                          }
                          className="text-3xl text-gray-600 hover:text-red-500 cursor-pointer"
                        />
                        </div>
                      </TableCell>

                      {/* Actions (hidden on small screens) */}
                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        <MdDelete
                          onClick={() =>
                            handleRemoveFromPreOrderCart(item, openSnackbar)
                          }
                          className="text-3xl text-gray-600 hover:text-red-500 cursor-pointer"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-4 text-center">
                      Your cart is empty
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          

          <div className="py-[2rem] flex justify-end">
            <div className="flex flex-col">
              <div className="text-right flex justify-end items-baseline gap-4">
                <p className="text-[18px] font-bold">Subtotal:</p>
                <p className="text-[16px] text-gray-700 font-[600]">
                  {convertInRupee(PreOrderTotalPrice)}
                </p>
              </div>
              <div className="py-5 flex ">
                <div className="flex flex-col lg:flex-row gap-4">
                  <button
                    onClick={() => router.push("/")}
                    className="w-full lg:w-[15rem] py-2 px-3 text-[16px] border-2 border-[#45B348] text-[#45B348] bg-white rounded-md transition duration-300 ease-in-out hover:bg-[#45B348] hover:text-white"
                  >
                    Continue Shopping
                  </button>
                  <button
                    disabled={PreOrderCarts.length > 0 && PreOrderCarts.find(item => item?.product_attributes_association ? item?.product_attributes_association?.pre_order_stock : item.product?.pre_order_stock >= item.quantity) ? false : true}
                    onClick={() => PreOrderCarts.length > 0 && !PreOrderCarts.find(item => Number(item?.product_attributes_association ? item?.product_attributes_association?.pre_order_stock : item.product?.pre_order_stock) < Number(item.quantity)) ? router.push("/pre_order/checkout") : null}
                    className={`w-full lg:w-[15rem] py-2 px-3 text-[16px] border-2 border-[#45B348] text-white bg-[#45B348] rounded-md transition duration-300 ease-in-out hover:bg-white hover:text-[#45B348] ${PreOrderCarts.length > 0 && !PreOrderCarts.find(item => item?.product_attributes_association ? item?.product_attributes_association?.pre_order_stock : item.product?.pre_order_stock < item.quantity) ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  >
                    Proceed to Checkout
                  </button>
                  {/* <button
                    onClick={() => PreOrderCarts.length > 0 ? router.push("/pre_order/checkout") : null}
                    className={`w-full lg:w-[15rem] py-2 px-3 text-[16px] border-2 border-[#45B348] text-white bg-[#45B348] rounded-md transition duration-300 ease-in-out hover:bg-white hover:text-[#45B348] ${PreOrderCarts.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  >
                    Proceed to Checkout
                  </button> */}
                </div>
              </div>
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
