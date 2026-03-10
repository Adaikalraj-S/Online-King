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

  const fetchDiscountOffer = async (query = {}) => {
    try {
      const res = await axios.get("/api/get-all-discounts-like-offer", {
        params: query, // Include the query parameters in the request
      });
      if (res.data.status === "success") {
        console.log(res.data, "offer");
        return res.data.discounts; // Return only the discounts array
      } else {
        console.log("Error in fetching offer");
        return [];
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  // Fetch the discounts and filter by discount_id
  const discounts = await fetchDiscountOffer({ discount_id: params.id });

  // Find the discount that matches the params.id
  const discount = discounts.find((d) => d.id === parseInt(params.id));

  return (
    <div>
      {/* <HeaderMain /> */}
      <Navbar />
      <Hero />
      <BreadCrumbs pageName={name} />
      <div className="px-4 md:px-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {discount?.product_discount_associations &&
          discount.product_discount_associations.map((association, i) => (
            <div key={i}>
              <ProductCard product={association.product} />
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
