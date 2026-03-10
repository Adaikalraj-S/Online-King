"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "../components/ProductCard/ProductCard";
import useProductStore from "../storeContext/store";
import Navbar from "../components/Navbar/Navbar";
import SidebarFilter from "../components/utils/SiderbarFilters";
import Hero from "../HomePage/Hero";
import Footer from "../HomePage/Footer";

const SearchResultsContent = ({ keyword }) => {
  const [loading, setLoading] = useState(false);
  const { fetchSearchProductData, searchProducts } = useProductStore();

  const {
    productData,
    fetchProductData,
    fetchSubCategoryData,
    fetchFilterProductData,
    fetchBrandsData,
    fetchSuperSubCategoryData,
  } = useProductStore();

  const [filterState, setFilterState] = useState({
    category_id: [],
    sub_category_id: [],
    super_sub_category_id: [],
    product_brand_id: [],
    price_min: null,
    price_max: null,
    product_name: "",
    q: "",
  });

  const [isFilterInitialized, setIsFilterInitialized] = useState(false);

  useEffect(() => {
    const initializeData = () => {
      fetchBrandsData();
      fetchSubCategoryData();
      fetchSuperSubCategoryData();

      // Fetch initial products based on the keyword
      fetchProductData("", "", "", "", "", keyword);

      setIsFilterInitialized(false);
      setLoading(false);
    };

    initializeData();
  }, [keyword, fetchProductData, fetchBrandsData, fetchSubCategoryData, fetchSuperSubCategoryData]);

  const handleFilter = (key, values) => {
    setIsFilterInitialized(true);
    if (key === "priceRange") {
      setFilterState((prev) => ({
        ...prev,
        price_min: parseFloat(values[0]),
        price_max: parseFloat(values[1]),
      }));
    } else {
      setFilterState((prev) => ({
        ...prev,
        [key]: values,
      }));
    }
  };

  useEffect(() => {
    if (isFilterInitialized) {
      fetchFilterProductData({ ...filterState, q: keyword });
    }
  }, [filterState, isFilterInitialized, keyword, fetchFilterProductData]);

  return (
    <div className="container mx-auto py-6 px-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
      {!loading ? (
        <>
          <div className="w-full lg:col-span-3 mb-4 lg:mb-0">
            <SidebarFilter filters={filterState} onFilterChange={handleFilter} />
          </div>
          <div className="lg:col-span-9">
            <h1 className="text-2xl font-bold mb-4">
              Search Results for "{keyword}"
            </h1>
            {productData?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {productData.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div>No products found for "{keyword}".</div>
            )}
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

const SearchResultsPage = () => {
  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    const updateKeywordFromURL = () => {
      if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search);
        const keywordParam = decodeURIComponent(searchParams.get("keyword") || "");
        setKeyword(keywordParam);
      }
    };

    updateKeywordFromURL();
  }, []);

  return (
    <div>
      <Navbar />
      <Hero />
      <Suspense fallback={<div>Loading search results...</div>}>
        {keyword && <SearchResultsContent keyword={keyword} />}
      </Suspense>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
