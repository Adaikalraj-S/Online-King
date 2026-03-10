import React from "react";
import axios from "../../../../../axios";
import BreadCrumbs from "@/app/components/utils/BreadCrumbs";
import Footer from "@/app/HomePage/Footer";
import WebSpecials from "@/app/HomePage/WebSpeciails";
import Client from "@/app/HomePage/Client";
import HeaderMain from "@/app/HomePage/HeaderMain";
import Hero from "@/app/HomePage/Hero";
import ProductCard from "@/app/components/ProductCard/ProductCard";
import Navbar from "@/app/components/Navbar/Navbar";

const page = async ({ params }) => {
  const name = decodeURIComponent(params.name);
  console.log(name, "name", params.id);

  const fetchProductByBrands = async (query = {}) => {
    try {
      const res = await axios.get("api/get-products-customer", {
        params: query, // Include the query parameters in the request
      });
      if (res.data.status === "success") {
        return res.data.products;
        // console.log(res.data.products, "products");
      } else {
        console.log("Error in fetching products by brand");
        return [];
      }
    } catch (error) {
      console.error("Error in fetching products by brand", error);
      throw new Error(error);
    }
  };

  // Fetch products where product_brand_id matches params.id
  const data = await fetchProductByBrands({ product_brand_id: params.id });
  console.log(data, "data");

  return (
    <div>
      {/* <HeaderMain /> */}
      <Navbar />
      <Hero />
      <BreadCrumbs pageName={name} />
      {/* <ProductCard  /> */}
      {/* {
        
        data &&
        data.map((product, i) => (
          <ProductCard key={i} product={product} />
        ))
      } */}
      <div className="px-4 md:px-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-4">
        {data &&
          data.map((product, i) => (
            <div key={i}>
              {/* <DealComponent productDetails={product} /> */}
              <ProductCard product={product} />
            </div>
          ))}
      </div>
      <Client />
      <WebSpecials />
      <Footer />
    </div>
  );
};

export default page;
