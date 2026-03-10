"use client";
import { React, useEffect, useState } from "react";
import Image from "next/image";
import PopularProductComponent from "./PopularProductComponent";
import { getProductCustomer } from "../api";
import useProductStore from "../storeContext/store";
import ProductCard from "../components/ProductCard/ProductCard";

const DealComponent = () => {
  const { PopularProducts, FetchPopularProduct } = useProductStore();

  useEffect(() => {
    FetchPopularProduct();
  }, []);

  return (
    <>
      <div className=" py-4 px-8 font-fontNew">
        <div className="">
          <h1 className="  text-center py-10 mt-3 text-[60px] lowercase font-bold ">
            <span className="text-[#000] capitalize">Popular</span>{" "}
            <span className="text-[#3fd4b4] capitalize">Produ</span>cts
          </h1>
        </div>
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {PopularProducts &&
            PopularProducts.map((product, i) => (
              <div key={i}>
                {/* <PopularProductComponent productDetails={product}/> */}
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default DealComponent;
