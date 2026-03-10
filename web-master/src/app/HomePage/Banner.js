"use client";
import { useState, useEffect } from "react";
import React from "react";
import Image from "next/image";
import arrow from "../Asset/mdi_menu-down.svg";
import Crousel from "./Crousel";
import "react-multi-carousel/lib/styles.css";
import { getCategories } from "../api";
import axios from "../../../axios";
import Banner1 from "../Asset/BannerNew.svg";
import HeroBannerSlider from "../components/banner/HeroBannerSlider";
import Offer from "./Offer";
import NavLinks from "../components/Navbar/NavLinks";

const Banner = () => {
  const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [hideTimeout, setHideTimeout] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        console.log(data, "dataCategory");
        setCategoriesData(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchSubCategories = async (category_id) => {
    try {
      const response = await axios.get(
        `api/fetch-subcategories-customers?category_id=${category_id}`
      );
      if (response.status === 200) {
        console.log(response.data.subcategories, "RDS1");
        return response.data.subcategories;
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };

  const handleMouseEnter = async (index) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    const data = await fetchSubCategories(index);
    setSubCategory(data);
    setHoveredCategoryIndex(index);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCategoryIndex(null);
      setSubCategory([]);
    }, 1000); // 1 second of inactivity
    setHideTimeout(timeout);
  };

  const handleMouseEnterSubCategory = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
  };

  const handleMouseLeaveSubCategory = () => {
    // Immediate clearing of state to hide content
    setHoveredCategoryIndex(null);
    setSubCategory([]);
  };

  return (
    <div className="py-7 flex flex-col lg:flex-row px-4">
      {/* Category Box */}
      <div className="w-[18%] bg-white py-6 border border-gray shadow-2xl rounded-l-xl mb-6 lg:mb-0 lg:block hidden">
        {/* <div className="flex flex-col space-y-2 gap-[0.8rem] relative">
          {categoriesData?.map((category, index) => (
            <div
              key={index}
              className="relative flex cursor-pointer cabinet items-center space-x-3 hover:text-green-500"
              onMouseEnter={() => handleMouseEnter(category.id)}
              onMouseLeave={handleMouseLeave}
            >
              <h3 className="text-[18px] capitalize">
                {category.category_name}
              </h3>
              <Image src={arrow} alt="Arrow Icon" className="w-4 h-4" />
              {hoveredCategoryIndex === category.id &&
                subCategory.length > 0 && (
                  <div
                    className="absolute top-0 left-[97%] ml-0 mt-0 p-2 w-60 bg-white rounded-lg shadow-lg z-50"
                    onMouseEnter={handleMouseEnterSubCategory}
                    onMouseLeave={handleMouseLeaveSubCategory}
                  >
                    {subCategory.map((subCategory, id) => (
                      <a
                        key={id}
                        href={`/products/${subCategory.id}/${subCategory.sub_category_name}`}
                        className="block mb-1"
                      >
                        <h2 className="block px-2 py-1 text-[14px] text-black hover:bg-gray-100">
                          {subCategory.sub_category_name}
                        </h2>
                      </a>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div> */}
        <NavLinks />
      </div>

      {/* Banner or Carousel Section */}
      <div className="w-full lg:w-[82%]">
        {/* Optional components like Image, HeroBannerSlider or Offer can be displayed here */}
        <Crousel />
        {/* <Offer /> */}
      </div>
      
    </div>
  );
};

export default Banner;
