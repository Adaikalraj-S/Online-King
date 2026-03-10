import HighlyRatedCardComponent from '@/app/ListingPage/HighlyRatedCardComponent';
import Link from 'next/link'
import React, { useEffect } from 'react'
import HighRatedProductCards from './HighRatedProductCards';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination } from 'swiper/modules';
import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import useProductStore from '@/app/storeContext/store';

const HighRatedProducts = ({ params, convertInRupee }) => {
    const product_id = params.slug
    const { productData, fetchProductData, totalProducts } = useProductStore();

    useEffect(() => {
        fetchProductData('', product_id, '', '')
    }, [fetchProductData])


    return (
        <div className=' py-20 px-14'>
            {productData.length > 0 && (
                <>
          <h1 className=' font-bold text-center text-[60px] lowercase '><span className='text-[#000] capitalize'>Highly</span> <span className='text-[#3fd4b4] capitalize'>Rat</span>ed</h1>
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
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                            },
                            640: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            1024: {
                                slidesPerView: 4,
                            },
                            1280: {
                                slidesPerView: 4,
                            },
                        }}
                    >
                        {productData && productData.map((curElem, index) => (
                            <SwiperSlide key={index} className=' mb-9'>
                                <HighRatedProductCards actualData={curElem} convertInRupee={convertInRupee} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
            )}
        </div>
    )
}

export default HighRatedProducts
