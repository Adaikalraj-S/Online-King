"use client";
import React, { useEffect, useRef, useState } from "react";




import usePaymentStore from "../../storeContext/paymentStore";
import { useSnackbar } from "../../SnackBarProvider";
import { useRouter } from "next/navigation";
import useProductStore from "../../storeContext/store";

import CheckoutMain from "@/app/components/checkout/CheckoutMain";
import Footer from "@/app/HomePage/Footer";
import BreadCrumbs from "@/app/components/utils/BreadCrumbs";
import Navbar from "@/app/components/Navbar/Navbar";

const Page = () => {
  const { openSnackbar } = useSnackbar();
  const router = useRouter();

  const {  PreOrderCarts, fetchPreCartData, cartCount } = useProductStore();
  const { isAuthenticated, checkLocalStorageAndVerifyToken } =
    usePaymentStore();

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    console.log("Starting auth check and fetching cart data");
    checkLocalStorageAndVerifyToken().then(() => {
        fetchPreCartData();
      setAuthChecked(true);
      console.log("Auth checked and cart data fetched");
    });
  }, [checkLocalStorageAndVerifyToken]);

  const initialRender = useRef(true);
  const prevCartCount = useRef(cartCount);

  console.log(cartCount, PreOrderCarts, "check-cart");

  useEffect(() => {``
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      if (authChecked) {
        if (!isAuthenticated) {
          router.push("/Login");
        }
      }1
    }
    prevCartCount.current = cartCount;
  }, [cartCount, isAuthenticated, authChecked, openSnackbar, router]);

  return (
    <>
      {/* <HeaderMain /> */}
      <Navbar />

      <BreadCrumbs pageName="Checkout" />

      <CheckoutMain cartData={PreOrderCarts} cartCount={cartCount} type="pre_order" />

      <Footer />
    </>
  );
};

export default Page;
