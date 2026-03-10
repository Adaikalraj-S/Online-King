"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/swiper-bundle.css";
import axios from "../../../axios";
import Link from "next/link";
import useProductStore from "../storeContext/store";

// Import Swiper styles
import "swiper/css/bundle"; // Import this to ensure all styles are included

const Offer = () => {
  const [offerDate, setOfferDate] = useState([]);
  
  const fetchOfferData = useCallback(() => {
    axios
      .get(`/api/get-all-discounts-like-offer`)
      .then((res) => {
        if (res.data.code === 200) {
          setOfferDate(res.data.discounts);
          console.log("res.data.discounts", res.data.discounts);
        } else if (res.data.message === "Session expired") {
          // openSnackbar(res.data.message, "error");  // Comment out if not using Snackbar
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    fetchOfferData();
  }, [fetchOfferData]);

  return (
    <>
      {offerDate && offerDate.length > 0 && (
        <section className="py-5 bg-transparent text-white">
          <div className="container mx-auto">
            <div className="title text-center mb-5">
              <h3>Offers</h3>
            </div>
            <Swiper
              slidesPerView={4}
              spaceBetween={30}
              freeMode={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              loop={true}
              navigation={true}
              modules={[Autoplay, FreeMode, Navigation, Pagination]}
              className="mySwiper"
            //   breakpoints={{
            //     320: {
            //       slidesPerView: 1,
            //     },
            //     640: {
            //       slidesPerView: 2,
            //     },
            //     768: {
            //       slidesPerView: 3,
            //     },
            //     1024: {
            //       slidesPerView: 4,
            //     },
            //     1280: {
            //       slidesPerView: 4,
            //     },
            //   }}
            >
              {offerDate.map((item, index) => (
                <SwiperSlide key={index} className="mb-12">
                  <Link href={`/offersPage/${item.id}`}>
                    <div className="py-5">
                      {item.image && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${item.image}`}
                          alt="image"
                          className="rounded-lg w-full h-52 object-cover"
                        />
                      )}
                      <div className="text-center py-2 capitalize">
                        <h3 className="font-bold text-white">{item.discount_name}</h3>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
              <div className="swiper-button-prev" style={{ color: "black" }}></div>
              <div className="swiper-button-next" style={{ color: "black" }}></div>
            </Swiper>
          </div>
        </section>
      )}
    </>
  );
};

export default Offer;
