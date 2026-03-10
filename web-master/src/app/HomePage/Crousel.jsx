"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "../../../axios";
import React, { Suspense, useEffect, useState, useMemo, lazy } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation, Scrollbar } from "swiper/modules";
import useProductStore from "../storeContext/store";

const Banners = () => {
//   const { fetchDiscountOffer, offersData } = useProductStore();

  const [bannerData, setBannerData] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchBannerData();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const fetchBannerData = async () => {
    try {
      const res = await axios.get(`api/get-banners-customer`);
      if (res.data.code === 200) {
        console.log("res", res.data.banners);
        setBannerData(res.data.banners);
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data.statusCode === 400) {
        console.error(err.response.data.message);
      }
    }
  };

  const handleClick = (banner) => {
    let href = "";
    console.log('Crousel.jsx @ Line 45:', banner);

    if (banner?.banner_type === "category") {
      if (banner?.super_sub_category_id) {
        href += `/super-sub-category/${banner?.super_sub_category_id}/${banner?.super_sub_category?.super_sub_category_name}`;
      } else if (banner?.sub_category_id) {
        href += `/sub-category/${banner?.sub_category_id}/${banner?.sub_category?.sub_category_name}`;
      } else {
        href += `/category/${banner?.category_id}/${banner?.category?.category_name}`;
      }
    } else if (banner?.banner_type === "product") {
      href += `/products/banner/?id=${banner?.id}`;
    }

    router.push(href);
  };

  const responsive = useMemo(
    () => ({
      desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
      tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
      mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
    }),
    []
  );
  // console.log(offersData, "df");


   const[poster, setPoster] = useState(null)

   useEffect(() => {
    const getPoster = async () => {
      try {
        const res = await axios.get(`api/get-offer-images`);
        if (res.data.code === 200) {
          console.log("res", res.data.offer_images);
          setPoster(res.data.offer_images);
        }
      } catch (err) {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
          console.error(err.response.data.message);
        }
      }
    };
    getPoster();
  }, []); 
      

  return (
    <div className="relative flex flex-col w-full gap-2 h-full">
      {loading ? (
        <>
          <div className="w-full p-4">
            <div className="w-full h-96 bg-gray-300 animate-pulse rounded-lg"></div>
            <div className="w-full mt-2 h-32 bg-gray-300 animate-pulse rounded-lg"></div>
          </div>
        </>
      ) : (
        <>
          <div className="relative">
            <Swiper
              key={bannerData.length}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              loop={true}
              modules={[Autoplay, Navigation, Pagination]}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                640: {
                  slidesPerView: 1,
                },
                1024: {
                  slidesPerView: 1,
                },
              }}
            >
              {bannerData.map((e, j) => (
                <SwiperSlide key={`${j}`} id={`swiper-${j}`}>
                  <div
                    onClick={() => handleClick(e)}
                    className="cursor-pointer w-full"
                  >
                    <img
                    className="w-full object-cover sm:h-[8rem] md:h-[8rem] lg:h-96"
                    src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${e.web_image_url}`}
                    alt="bannerImg"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Navigation Arrows */}
            {/* <div 
              className="swiper-button-prev absolute top-1/2 -left-4 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-800 text-white p-2 rounded-full"
              aria-label="Previous"
            ></div>
            <div
              className="swiper-button-next absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-800 text-white p-2 rounded-full"
              aria-label="Next"
            ></div> */}
          </div>
          <Suspense fallback={<div>Loading...</div>}>
  <div className="w-full flex justify-between overflow-x-scroll space-x-4 p-2 scrollbar-hide scrollb">
    {poster?.map((e, i) => (
      <SwiperSlide
        key={i} 
        className={`!h-[6rem] sm:!h-[8rem] flex-shrink-0 !w-[150px] sm:!w-[250px] md:!w-[250px] lg:!w-[250px]`}
      >
        <img
          className="h-full object-contain rounded"
          src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${e.image_url}`}
          alt="offer_Img"
        />
      </SwiperSlide>
    ))}
  </div>
</Suspense>

       
        </>
      )}
    </div>
  );
};

export default Banners;
