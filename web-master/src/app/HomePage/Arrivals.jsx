"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import { getProductCustomer } from "../api";
// import gif from "../../../public/gif3.gif"
import Image from 'next/image';
import { Pagination } from 'swiper/modules';
import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ProductCard from '../components/ProductCard/ProductCard';




const Arrivals = () => {
  const [dataArrival, setDataArrival] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const incrementCount = 12

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductCustomer();
        console.log(data, "data")
        setDataArrival(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProduct();
  }, []);

  if (!Array.isArray(dataArrival)) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }


  const handleMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  const handleLess = () => {
    setVisibleCount(8);
  };

  const initSwiper = () => {
    new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 5000,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
};

  return (
    <div className=' px-2 sm:px-4 lg:px-6 font-fontNew'>
      <div className='py-8'>
        <div className='text-center text-2xl sm:text-3xl md:text-4xl font-bold  flex justify-center'>
          {/* <Image src={gif} alt="" className=' w-44 h-24' /> */}
          <h1 className='py-10 mt-3 text-[60px]'>
            <span className='text-[#000] capitalize'>New</span> 
            <span className='text-[#3fd4b4] capitalize'>Arriv</span>als
          </h1>
        </div>
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            freeMode={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: true,
              
            }}
            // pagination={{
            //   clickable: true,
            // }}
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
            {dataArrival.map((curElem,index) => (
              <SwiperSlide key={index} className=' mb-12'>
                <ProductCard key={`${curElem}`} product={curElem}/>
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev " style={{ color: 'black' }}></div>
            <div className="swiper-button-next SwipeNextBanner  mr-[-7rem] " style={{ color: 'black' }}></div>
          </Swiper>
        
      </div>
     
      {/* <div className='text-center mt-8'>
    {visibleCount < dataArrival.length && (
      <button onClick={handleMore} className='px-4 py-2 bg-green-500 text-white rounded'>Load More</button>
    )}
    {visibleCount > 8 && (
      <button onClick={handleLess} className='px-4 py-2 bg-green-500 text-white rounded ml-4'>Load Less</button>
    )}
  </div> */}

    </div>
  );
}

export default Arrivals;