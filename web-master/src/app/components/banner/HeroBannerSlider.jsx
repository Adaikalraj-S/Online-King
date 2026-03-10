
"use client"
import React, { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination } from 'swiper/modules';
import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import useProductStore from '@/app/storeContext/store';

const HeroBannerSlider = () => {

    const { BannersData, FetchBannerData } = useProductStore();

    useEffect(() => {
        FetchBannerData();
    }, [FetchBannerData]);

    return (
        <Swiper
            slidesPerView={1}
            spaceBetween={30}
            freeMode={true}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            pagination={{
                clickable: true,
            }}
            loop={true}
            navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }}
            modules={[Autoplay, FreeMode, Navigation, Pagination]}
            className="mySwiper"
        >
            {BannersData && BannersData.map((banner, index) => (
                <SwiperSlide key={index}>
                    <div className="w-full">
                        <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${banner.web_image_url}`} alt={banner.alt} className="w-[100%] h-48 lg:h-full" />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default HeroBannerSlider
