"use client";
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard/ProductCard'; // Assuming ProductCard is in the same directory
import useProductStore from '../storeContext/store';
import { Pagination } from 'swiper/modules';
import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Product = () => {
  const [currentStatus, setCurrentStatus] = useState('Featured');

  const { fetchProductByStatus, fetchProductsByStatus } = useProductStore();

  useEffect(() => {
    fetchProductsByStatus(currentStatus);
  }, [fetchProductsByStatus, currentStatus]);

  const handleStatusChange = (status) => {
    setCurrentStatus(status);
  };

  return (
    <>
      <div className='flex flex-col py-3 gap-6 font-fontNew'>
        <div className='flex flex-col gap-5'>
          <div className="text-center">
            <h1 className='mt-3 text-[60px] lowercase font-bold'>
              <span className='text-[#000] capitalize'>Our</span> <span className='text-[#3fd4b4] capitalize'>Prod</span>ucts
            </h1>
          </div>
          <div className='flex gap-7 justify-center'>
            <button onClick={() => handleStatusChange('Featured')} className={`hover:underline hover:text-[#45B348] transition duration-300 ease-in-out ${currentStatus === 'Featured' ? 'text-[#45B348]' : ''}`}>Featured</button>
            <button onClick={() => handleStatusChange('Latest')} className={`hover:underline hover:text-[#45B348] transition duration-300 ease-in-out ${currentStatus === 'Latest' ? 'text-[#45B348]' : ''}`}>Latest</button>
            <button onClick={() => handleStatusChange('Bestselling')} className={`hover:underline hover:text-[#45B348] transition duration-300 ease-in-out ${currentStatus === 'Bestselling' ? 'text-[#45B348]' : ''}`}>Bestselling</button>
          </div>
        </div>
        {fetchProductByStatus?.length === 0 && <p className='text-center text-[20px] font-bold'>No Products Found</p>}
        <div>
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            freeMode={true}
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
            {fetchProductByStatus.map((curElem, index) => (
              <SwiperSlide key={index} className='mb-12'>
                <ProductCard product={curElem} />
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev" style={{ color: 'black' }}></div>
            <div className="swiper-button-next SwipeNextBanner mr-[-7rem]" style={{ color: 'black' }}></div>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default Product;
