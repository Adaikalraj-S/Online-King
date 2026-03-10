"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import useProductStore from "@/app/storeContext/store";
import ProductCard from "../../ProductCard/ProductCard";
import SidebarFilter from "../../utils/SiderbarFilters";

const ProductListMain = ({ params }) => {
  const product_id = params.slug;
  const product_name = decodeURIComponent(params.product_name);

  
  const {
    productData,
    fetchProductData,
    fetchSubCategoryData,
    subCategoryData,
    fetchFilterProductData,
    fetchBrandsData,
    priceRangeProduct,
    superSubCategoryData,
    fetchSuperSubCategoryData
  } = useProductStore();

  const [page, setPage] = useState(1);
  const rowsPerPage = 4; // Show 4 products per page

  // Ensure filterState is initialized properly
  const [filterState, setFilterState] = useState({
    category_id: [],
    sub_category_id: [],
    super_sub_category_id: [],
    product_brand_id: [],
    price_min: null,
    price_max: null,
  });

  // New state to control when filters are applied
  const [isFilterInitialized, setIsFilterInitialized] = useState(false);

  // Initial load: Fetch all products for the specific product ID without filters
  useEffect(() => {
    if (product_id) {
      fetchProductData("", product_id, "", ""); // Fetch products without filters on initial load
      fetchBrandsData();
      fetchSubCategoryData();
      fetchSuperSubCategoryData();
      setIsFilterInitialized(true); // Mark filters as ready for future changes
    }
  }, [product_id]);

  // Handle filter changes
  const handleFilter = (key, values) => {
    console.log(key, "key", values, "value");

    if(key === "priceRange") {
      setFilterState((prev) => ({
        ...prev,
        price_min: parseFloat(values[0]),
        price_max: parseFloat(values[1])
      }));
    } else {
      setFilterState((prev) => ({
        ...prev,
        [key]: values,
      }));
      console.log(key,"kl")
    }
   
    setPage(1); // Reset to page 1 on filter change
  };

  useEffect(() => {
    console.log(filterState, "ste");
    fetchFilterProductData(filterState);
  }, [filterState]);

  // Calculate pagination details
  const totalRows = productData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const paginatedRows = productData.slice(startIndex, endIndex);

  return (
    // <div className="py-4 flex w-full">
    //   <div className="w-[18%]">
    //     <SidebarFilter filters={filterState} onFilterChange={handleFilter} />
    //   </div>
    //   <div className="flex-1 px-4 w-[82%]">
    //     <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    //       {paginatedRows.map((curElem, i) => (
    //         <Link
    //           key={curElem.id}
    //           href={`/ProductDetails/${curElem.id}`}
    //           className="hover:scale-100"
    //         >
    //           <div key={`${i}`}>
    //             <ProductCard product={curElem} />
    //           </div>
    //         </Link>
    //       ))}
    //       {paginatedRows.length === 0 && <p>No products found.</p>}
    //     </div>
    //     {totalPages > 1 && (
    //       <div className="flex justify-center mt-4">
    //         <Pagination
    //           count={totalPages}
    //           page={page}
    //           onChange={(e, newPage) => setPage(newPage)}
    //           shape="rounded"
    //           color="primary"
    //           variant="outlined"
    //         />
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div className="py-4 flex flex-col lg:flex-row w-full">
  {/* Sidebar */}
  <div className="w-full lg:w-[18%] mb-4 lg:mb-0">
    <SidebarFilter filters={filterState} onFilterChange={handleFilter} />
  </div>

  {/* Main Content */}
  <div className="flex-1 w-full lg:w-[82%] px-2 sm:px-4">
    {/* Grid for Product Cards */}
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {paginatedRows.map((curElem) => (
        <Link
          key={curElem.id}
          href={`/ProductDetails/${curElem.id}`}
          className="hover:scale-105 transform transition-transform duration-200"
        >
          <ProductCard product={curElem} />
        </Link>
      ))}
      {paginatedRows.length === 0 && (
        <p className="text-center col-span-full">No products found.</p>
      )}
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
          shape="rounded"
          color="primary"
          variant="outlined"
        />
      </div>
    )}
  </div>
</div>

  );
};

export default ProductListMain;
