"use client";
import React, { useEffect, useRef, useState } from "react";
import CheckoutMain from "../components/checkout/CheckoutMain";
import HeaderMain from "../HomePage/HeaderMain";
import Footer from "../HomePage/Footer";
import BreadCrumbs from "../components/utils/BreadCrumbs";
import usePaymentStore from "../storeContext/paymentStore";
import { useSnackbar } from "../SnackBarProvider";
import { useRouter } from "next/navigation";
import useProductStore from "../storeContext/store";
import Navbar from "../components/Navbar/Navbar";

const Page = () => {
  const { openSnackbar } = useSnackbar();
  const router = useRouter();

  const { cartData, fetchCartData, cartCount } = useProductStore();
  const { isAuthenticated, checkLocalStorageAndVerifyToken } =
    usePaymentStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    console.log("Starting auth check and fetching cart data");
    checkLocalStorageAndVerifyToken().then(() => {
      fetchCartData();
      setAuthChecked(true);
      console.log("Auth checked and cart data fetched");
    });
  }, [checkLocalStorageAndVerifyToken, fetchCartData]);

  const initialRender = useRef(true);
  const prevCartCount = useRef(cartCount);

  console.log(cartCount, cartData, "check-cart");

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      if (authChecked) {
        if (!isAuthenticated) {
          router.push("/Login");
        }
      }
    }
    prevCartCount.current = cartCount;
  }, [cartCount, isAuthenticated, authChecked, openSnackbar, router]);

  return (
    <>
      {/* <HeaderMain /> */}
      <Navbar />

      <BreadCrumbs pageName="Checkout" />

      <CheckoutMain cartData={cartData} cartCount={cartCount} />

      <Footer />
    </>
  );
};

export default Page;
