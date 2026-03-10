"use client";
import React from "react";
import { useState, useEffect } from "react";
import DealComponent from "./DealComponent";
import axios from "axios";
import { getProductCustomer } from "../api";
import useProductStore from "../storeContext/store";
import ProductCard from "../components/ProductCard/ProductCard";

const Deal = () => {
  const { DealOfTheDayProducts, DealOfTheDayFetch } = useProductStore();

  useEffect(() => {
    DealOfTheDayFetch();
  }, [DealOfTheDayFetch]);

  return (
    <>
      <div className="px-2 md:px-8 font-fontNew">
        <div className="bg-[#74B491] rounded-lg py-8 md:py-4">
          <div className="py-4 md:py-3">
            <h1 className="text-center text-[60px] md:text-[60px] font-bold text-white ">
              DEALS OF THE DAY
            </h1>
          </div>
          <div className="px-4 md:px-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-4">
            {DealOfTheDayProducts &&
              DealOfTheDayProducts.map((product, i) => (
                <div key={i}>
                  {/* <DealComponent productDetails={product} /> */}
                  <ProductCard product={product} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Deal;
