"use client";
import CategoryProductList from "@/app/components/CategoryProduct/CategoryProductList";
import Navbar from "@/app/components/Navbar/Navbar";
import ProductMain from "@/app/components/products/productsLists/ProductMain";
import BreadCrumbs from "@/app/components/utils/BreadCrumbs";
import Footer from "@/app/HomePage/Footer";
import HeaderMain from "@/app/HomePage/HeaderMain";
import Hero from "@/app/HomePage/Hero";
import WebSpeciails from "@/app/HomePage/WebSpeciails";
import React from "react";

const Page = ({ params }) => {
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
      {/* <HeaderMain /> */}
      <Navbar />

      <Hero />

      <>
      <BreadCrumbs pageName={params.product_name}/>
      <CategoryProductList params={params} convertInRupee={convertInRupee} />

      </>


      <WebSpeciails />

      <Footer />
    </>
  );
};

export default Page;
