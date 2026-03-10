"use client";
import React, { useState, useEffect } from "react";
import HeaderMain from "../HomePage/HeaderMain";
import Hero from "../HomePage/Hero";
import Footer from "../HomePage/Footer";
import ListingCardComponent from "./ListingCardComponent";
import HighlyRatedCardComponent from "./HighlyRatedCardComponent";
import { getProductCustomer } from "../api";
import Link from "next/link";

const Page = () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const fetchListProduct = async () => {
      try {
        const data = await getProductCustomer();
        console.log(data, "data");
        setDataList(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchListProduct();
  }, []);

  return (
    <>
      <div>
        <HeaderMain />
        <Hero />
      </div>
      <div className="py-10 px-14">
        <div className="grid gap-7 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {dataList.map((curElem) => (
            <Link
              key={curElem.product_id}
              href={`/ProductDetails/${curElem.id}`}
            >
              <div className="border border-transparent hover:border-black transition-all rounded-xl">
                <ListingCardComponent actualData={curElem} />
              </div>
            </Link>
          ))}
        </div>

        {/* ----highly rated--------------------------------------------------------------------------------------------- */}

        <h1 className="text-4xl py-5 font-bold">Highly Rated</h1>
        <div className="grid gap-7 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {dataList.map((curElem) => (
            <Link
              key={curElem.product_id}
              href={`/ProductDetails/${curElem.id}`}
            >
              <HighlyRatedCardComponent actualData={curElem} />
            </Link>
          ))}
        </div>

        {/* --------------------Products------------------------------------------------------------- */}
        <div className="grid gap-7 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <ListingCardComponent />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
