"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import useProductStore from "@/app/storeContext/store";
import SidebarFilter from "../utils/SiderbarFilters";
import ProductCards from "../ProductCard/ProductCard";

const CategoryProductList = ({ params }) => {
  const product_type = params.product_type;
  const product_type_id = params.id;

  const {
    productData,
    fetchProductData,
    fetchSubCategoryData,
    subCategoryData,
    fetchFilterProductData,
    fetchBrandsData,
    priceRangeProduct,
    superSubCategoryData,
    fetchSuperSubCategoryData,
  } = useProductStore();

  const [page, setPage] = useState(1);
  const rowsPerPage = 12;
const [loading, setLoading] = useState(true)
  // Initialize filters state
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

  // Function to initialize fetching data based on product_type
  useEffect(() => {
    const initializeData = () => {
      fetchBrandsData();
      fetchSubCategoryData();
      fetchSuperSubCategoryData();

      // Fetch products based on the product_type and product_type_id
      switch (product_type) {
        case "category":
          fetchProductData(product_type_id, "", "", "");
          setIsFilterInitialized(false)
          break;
        case "sub-category":
          fetchProductData("", product_type_id, "", "");
          setIsFilterInitialized(false)
          break;
        case "super-sub-category":
          fetchProductData("", "", "", "",product_type_id);
          setIsFilterInitialized(false)
          break;
        default:
          break;
      }

      setLoading(false)
      //setIsFilterInitialized(true); // Mark filters as initialized
    };


    initializeData();
  }, [product_type, product_type_id]);

  // Handle filter changes
  const handleFilter = (key, values) => {
    setIsFilterInitialized(true)
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
      console.log(key, values,"kl222")
    }
  };

  // Apply filters whenever filterState changes
  useEffect(() => {
    if (isFilterInitialized) {
      fetchFilterProductData(filterState);
    }
  }, [filterState, isFilterInitialized, fetchFilterProductData]);
  
  useEffect(() => {
    switch (product_type) {
      case "category":
        if (!filterState.category_id.find(e => e == product_type_id)) {
          setFilterState({
            ...filterState,
            category_id: [Number(product_type_id)],
          })
        }
        fetchProductData(product_type_id, "", "", "");
        setIsFilterInitialized(false)
        break;
      case "sub-category":
        if (!filterState.sub_category_id.find(e => e == product_type_id)) {
          setFilterState({
            ...filterState,
            sub_category_id: [product_type_id]
          })
        }
        fetchProductData("", product_type_id, "", "");
        setIsFilterInitialized(false)
        break;
      case "super-sub-category":
        if (!filterState.super_sub_category_id.find(e => e == product_type_id)) {
          setFilterState({
            ...filterState,
            super_sub_category_id: [product_type_id]
          })
        }
        fetchProductData("", "", "", "",product_type_id);
        setIsFilterInitialized(false)
        break;
    }
  }, [product_type])
  // Calculate pagination details
  const totalRows = productData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedRows = productData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="py-4 flex flex-col lg:flex-row w-full">
      {/* Sidebar */}
      {(!loading) ? (
        <>
          <div className="w-full lg:w-[18%] mb-4 lg:mb-0">
            <SidebarFilter filters={filterState} onFilterChange={handleFilter} product_type={product_type_id} />
          </div>
        </>
      ) : (
        <></>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full lg:w-[82%] px-2 sm:px-4">
        {/* Grid for Product Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedRows.map((product) => (
           
              <ProductCards product={product} />
           
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

export default CategoryProductList;
