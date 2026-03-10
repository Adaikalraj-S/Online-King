"use client";
import React, { useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules"; // Import Autoplay module
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import useProductStore from "@/app/storeContext/store";
import ProductCards from "../products/productsLists/ProductCards";
import ProductCard from "../ProductCard/ProductCard";


const RecommendedProductsCarousel = ({ productId }) => {
    const { RecomendedProducts, RecomendedFetch } = useProductStore();

    useEffect(() => {
        if (productId) {
          RecomendedFetch(productId);
        }
      }, []);

  const showNavigation = RecomendedProducts && RecomendedProducts?.length >= 4;

  return (
    <Box
      className="RecommendedProductsCarousel"
      sx={{ borderRadius: 1, width: "100%", mt: 16, mb: 12 }}
    >
      <Box sx={{ mx: "auto", maxWidth: "7xl", textAlign: "center" }}>
        <Typography variant="h4" sx={{ color: "#63AAD8", mb: 4 }}>
          Recommended Products
        </Typography>

        <Box sx={{ position: "relative", px: { xs: 2, md: 2 }, py: 3 }}>
          {
            showNavigation && 
            <>
             {/* Left Arrow Button */}
          <IconButton
            className="swiper-button-prev"
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              zIndex: 10,
              transform: "translateY(-50%)",
              backgroundColor: "transparent", // Remove background color
              boxShadow: "none", // Remove any box-shadow
              color: "#63AAD8", // Set button color
            }}
          >
            <AiOutlineLeft style={{ fontSize: "20px" }} />
          </IconButton>

          {/* Right Arrow Button */}
          <IconButton
            className="swiper-button-next"
            sx={{
              position: "absolute",
              top: "50%",
              right: 10,
              zIndex: 10,
              transform: "translateY(-50%)",
              backgroundColor: "transparent", // Remove background color
              boxShadow: "none", // Remove any box-shadow
              color: "#63AAD8", // Set button color
            }}
          >
            <AiOutlineRight style={{ fontSize: "20px" }} />
          </IconButton>
            </>
          }
         

          <Swiper
            spaceBetween={20}
            loop={RecomendedProducts && RecomendedProducts?.length >= 4}
            navigation={RecomendedProducts && RecomendedProducts?.length >= 4 ? { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" } : false}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true, }} // Autoplay configuration
            modules={[Navigation, Autoplay]} // Include Autoplay module
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {RecomendedProducts && RecomendedProducts?.map((product, index) => (
              <SwiperSlide className="p-2" key={index}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(RecommendedProductsCarousel);
