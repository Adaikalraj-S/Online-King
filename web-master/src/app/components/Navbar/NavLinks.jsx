"use client"
import React from "react";
import Link from "next/link";
import useProductStore from "@/app/storeContext/store";
import { ChevronRightOutlined } from "@mui/icons-material";

const NavLinks = () => {
  const { categoryData } = useProductStore();

  return (
    <div className="relative">
      {categoryData.map((category) => (
        <div key={category.id} className="group relative">
          {/* Category Level */}
          <div className="px-3 py-2 hover:bg-gray-100">
            <Link
              href={`/category/${category.id}/${encodeURIComponent(category.category_name)}`}
              className="text-lg font-semibold flex items-center justify-between gap-1 group-hover:text-primary"
            >
              <span>{category.category_name}</span>
              {/* {category.sub_categories.length > 0 && (
                <ChevronRightOutlined className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              )} */}
               <ChevronRightOutlined className="text-gray-500 transition-opacity duration-200" />
            </Link>

            {/* Sub-category dropdown (shown on hover) */}
            {category.sub_categories.length > 0 && (
              <div className="absolute top-0 left-full hidden rounded-r-lg group-hover:block bg-white shadow-lg p-2 w-64 z-20">
                {category.sub_categories.map((subCategory) => (
                  <div key={subCategory.id} className="sub-dropdown relative">
                    {/* Sub-category Level */}
                    <Link
                      href={`/sub-category/${subCategory.id}/${encodeURIComponent(subCategory.sub_category_name)}`}
                      className="py-2 px-3 link font-medium text-gray-700 flex justify-between items-center gap-1"
                    >
                      <span>{subCategory.sub_category_name}</span>
                      {subCategory.super_sub_categories.length > 0 && (
                        <ChevronRightOutlined className="text-gray-500 left transition-opacity duration-200" />
                      )}
                    </Link>

                    {/* Super-sub-category dropdown (shown on hover) */}
                    {subCategory.super_sub_categories.length > 0 && (
                      <div className="absolute top-0 left-full super-sub-dropdown rounded-r-lg bg-white shadow-lg p-2 z-30">
                        {subCategory.super_sub_categories.map(
                          (superSubCategory) => (
                            <Link
                              key={superSubCategory.id}
                              href={`/super-sub-category/${superSubCategory.id}/${encodeURIComponent(superSubCategory.super_sub_category_name)}`}
                              className="block py-2 px-3 text-nowrap text-gray-700 hover:bg-gray-100 group-hover:text-primary"
                            >
                              {superSubCategory.super_sub_category_name}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NavLinks;




