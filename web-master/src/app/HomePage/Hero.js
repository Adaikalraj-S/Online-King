"use client";
import React, { useEffect, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import useProductStore from "../storeContext/store"; // Assuming Zustand for state management
import Link from "next/link";
import { ArrowRightOutlined } from "@mui/icons-material";

const Hero = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubDropdown, setOpenSubDropdown] = useState(null);
  const [submenuStyles, setSubmenuStyles] = useState({}); // Track dynamic styles for submenus
  const [MainmenuStyles, setMainmenuStyles] = useState({}); // Track dynamic styles for submenus

  const { categoryData, fetchCategoryData } = useProductStore();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        await fetchCategoryData();
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, [fetchCategoryData]);

  const handleDropdownToggle = (id, event) => {
    setOpenDropdown(openDropdown === id ? null : id);
    const rect = event.target.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const openToLeft = rect.right + 200 >= viewportWidth;
    setMainmenuStyles((prev) => ({
      ...prev,
      [id]: openToLeft ? { right: "auto", left: `-100px` } : { left: '0px' },
    }));
    setOpenSubDropdown(null);
  };

  const handleSubDropdownToggle = (id, event) => {
    const rect = event.target.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Adjust submenu position dynamically
    const openToLeft = rect.right + 200 >= viewportWidth;
    setSubmenuStyles((prev) => ({
      ...prev,
      [id]: openToLeft ? { right: "100%", left: "auto" } : { left: "100%" },
    }));
    setOpenSubDropdown(id);
  };

  return (
    <div className="bg-[#45B348] px-2 md:px-4 md:py-4 font-fontNew hidden md:block">
      <div className="flex flex-wrap justify-between bg-green">
        {categoryData.map((category) => (
          <div key={category.id} className="relative flex items-center">
            {/* Main Category Button */}
            <div
              className="relative flex items-center cursor-pointer shadow-md rounded-md p-2 hover:bg-[#3a9d39] hover:shadow-none"
              onMouseEnter={(e) => handleDropdownToggle(category.id, e)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={`/category/${category.id}/${category.category_name}`}
                className="text-[10px] md:text-[12px] lg:text-[14px] capitalize text-white"
              >
                {category.category_name}
              </Link>
              {category.sub_categories.length > 0 && <TiArrowSortedDown className="text-white" />}

              {/* Dropdown Menu */}
              {openDropdown === category.id && (
                <div className="absolute top-full bg-white shadow-lg rounded-md z-50 w-[200px]" style={MainmenuStyles[category.id]}>
                  <ul>
                    {category.sub_categories.map((item) => (
                      <li key={item.id} className="relative group">
                        <div
                          className="flex justify-between items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                          onMouseEnter={(e) => handleSubDropdownToggle(item.id, e)}
                        >
                          <Link href={`/sub-category/${item.id}/${item.sub_category_name}`}>
                            {item.sub_category_name}
                          </Link>
                          {item.super_sub_categories.length > 0 && <ArrowRightOutlined />}
                        </div>

                        {/* Submenu */}
                        {openSubDropdown === item.id && item.super_sub_categories.length > 0 && (
                          <ul
                            className="absolute top-0 bg-white shadow-lg rounded-md w-48"
                            style={submenuStyles[item.id]} // Apply dynamic styles
                          >
                            {item.super_sub_categories.map((e) => (
                              <li key={e.id} className="px-4 py-2 hover:bg-gray-200">
                                <Link href={`/super-sub-category/${e.id}/${e.super_sub_category_name}`}>
                                  {e.super_sub_category_name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
