import React from "react";
import HeaderMain from "../HomePage/HeaderMain";
import WebSpeciails from "../HomePage/WebSpeciails";
import Footer from "../HomePage/Footer";
import Hero from "../HomePage/Hero";
import Image from "next/image";
import keyboard from "../Asset/Keyboard.svg";
import Rating from "../ListingPage/ratings";
import rupee from "../Asset/Rupee.svg";

const page = () => {
  return (
    <div>
      <HeaderMain />
      <Hero />
      {/* <div>
        <div className=" flex flex-col justify-center items-center">
          <h1 className=" text-[3rem] font-bold "> Results</h1>
          <p className=" text-[1rem]">
            Check each product page for other buying options.
          </p>
        </div>
        <div>
          <div className="py-5 sm:py-10">
            <div className=" font-fontNew  rounded-lg px-6 mb-5 w-[25rem] max-w-lg">
              <div className=" shadow-lg bg-white rounded-lg">
                <div className="flex justify-center">
                  <Image
                    width={20}
                    height={20}
                    src={keyboard}
                    alt="keyboard"
                    className="w-full rounded-t-lg"
                  />
                  <div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <div className="px-5">
                  <h2 className="py-3 text-xl">{}</h2>
                </div>
                <div className="px-5 py-4">
                  <div className="rounded-t-lg bg-[#BE1E2D] w-full lg:w-[15rem] h-auto py-2  px-3">
                    <p className="text-white text-2xl">Limited time Offer</p>
                  </div>
                </div>
                <div className="px-5 gap-2 lg: flex">
                  <Rating />
                  <p className="text-xl">1,200</p>
                </div>
                <div className="py-4 px-5">
                  <div className="flex  gap-2">
                    <Image
                      width={20}
                      height={20}
                      src={rupee}
                      alt="rupee"
                      className="w-5 h-5"
                    />
                    <p className="text-3xl font-bold">{}</p>
                    <p>M.R.P</p>
                    <Image
                      width={20}
                      height={20}
                      src={rupee}
                      alt="rupee"
                      className="w-5 h-5"
                    />
                    <p className="line-through">sdf</p>
                    <p>(60% off)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      Brand list
      <WebSpeciails />
      {/* <Footer /> */}
    </div>
  );
};

export default page;
