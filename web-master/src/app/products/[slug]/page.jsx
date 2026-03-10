"use client";
import ProductCard from "@/app/components/ProductCard/ProductCard";
import useProductStore from "@/app/storeContext/store";
import { Pagination } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "../../../../axios";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar/Navbar";
import Hero from "@/app/HomePage/Hero";
import WebSpecials from "@/app/HomePage/WebSpeciails";
import Footer from "@/app/HomePage/Footer";

const page = ({ params }) => {
  const { FetchBannerData, BannersData, BannerProductTypeData } =
    useProductStore();
  const router = useRouter();
  const path = new URLSearchParams(location.search);
  const bannerId = path.get("id");
  //const {id} = router.query
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;

  console.log(params.slug, bannerId, "page-banner");

  useEffect(() => {
    FetchBannerData({ banner_id: bannerId });
  }, []);
  console.log(BannersData, BannerProductTypeData, "banner-type-res");

  // Calculate pagination details
  const totalRows = BannerProductTypeData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedRows = BannerProductTypeData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <Navbar />

      <Hero />
      <div className="py-4 flex flex-col lg:flex-row w-full">
        {/* Sidebar
      <div className="w-full lg:w-[18%] mb-4 lg:mb-0">
        <SidebarFilter filters={filterState} onFilterChange={handleFilter} />
      </div> */}

        {/* Main Content */}
        <div className="flex-1 w-full lg:w-[82%] px-2 sm:px-4">
          {/* Grid for Product Cards */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedRows.map((banner) => (
              <Link
                key={banner.id}
                href={`/ProductDetails/${banner?.product?.id}`}
                className="hover:scale-105 transform transition-transform duration-200"
              >{
                banner.product ?  <ProductCard product={banner?.product} /> : null
              }
               
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
      <WebSpecials />

      <Footer />
    </>
  );
};

export default page;
