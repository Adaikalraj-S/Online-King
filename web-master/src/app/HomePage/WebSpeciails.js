// import React from 'react';
// import secure from "../Asset/secure.svg";
// import help from "../Asset/help.svg";
// import speed from "../Asset/speed.svg";
// import trust from "../Asset/trust.svg";
// import value from "../Asset/grow.svg";
// import Image from 'next/image';

// const WebSpeciails = () => {
//   return (
//     <>
//     <div className='grid gap-8 p-4 sm:grid-cols-2 lg:grid-cols-5 px-8 font-fontNew'>
//   <div className='flex flex-col items-center text-center hover:bg-gray-100 transition duration-300 ease-in-out rounded-xl'>
//     <Image src={secure} alt="Secure Payments" />
//     <h1 className='font-bold mt-2'>Secure Payments</h1>
//     <p>All major credit & debit card accepted</p>
//   </div>
//   <div className='flex flex-col items-center text-center hover:bg-gray-100 transition duration-300 ease-in-out rounded-xl'>
//     <Image src={help} alt="Help Centre" />
//     <h1 className='font-bold mt-2'>Help Centre</h1>
//     <p>Got a question? Look no further. Contact us</p>
//   </div>
//   <div className='flex flex-col items-center text-center hover:bg-gray-100 transition duration-300 ease-in-out rounded-xl'>
//     <Image src={speed} alt="Speedy Delivery" />
//     <h1 className='font-bold mt-2'>Speedy Delivery</h1>
//     <p>Home Delivery all over India</p>
//   </div>
//   <div className='flex flex-col items-center text-center hover:bg-gray-100 transition duration-300 ease-in-out rounded-xl'>
//     <Image src={trust} alt="Trust Pay" />
//     <h1 className='font-bold mt-2'>Trust Pay</h1>
//     <p>100% Payment Protection. Easy Return Policy</p>
//   </div>
//   <div className='flex flex-col items-center text-center hover:bg-gray-100 transition duration-300 ease-in-out rounded-xl'>
//     <Image src={value} alt="Great Value" />
//     <h1 className='font-bold mt-2'>Great Value</h1>
//     <p>We offer competitive prices on our entire product range</p>
//   </div>
// </div>

//     </>
//   );
// };
// export  default WebSpeciails;
"use client";
import React from "react";
import Image from "next/image";
import secure from "../Asset/secure.svg";
import help from "../Asset/help.svg";
import speed from "../Asset/speed.svg";
import trust from "../Asset/trust.svg";
import value from "../Asset/grow.svg";

const WebSpecials = () => {
  return (
    <div className="grid gap-8 p-4 sm:grid-cols-2 lg:grid-cols-5 px-8 font-fontNew">
      <div className="flex flex-col items-center text-center hover:bg-gray-100 transition duration-300 ease-in-out rounded-xl">
        <Image src={secure} alt="Secure Payments" width={50} height={50} />
        <h1 className="font-bold mt-2">Secure Payments</h1>
        <p>All major credit & debit card accepted</p>
      </div>
      <div className="flex flex-col items-center text-center hover:bg-gray-100 transition duration-300 ease-in-out rounded-xl">
        <Image src={help} alt="Help Centre" width={50} height={50} />
        <h1 className="font-bold mt-2">Help Centre</h1>
        <p>Got a question? Look no further. Contact us</p>
      </div>
      <div className="flex flex-col items-center text-center hover:bg-gray-100 transition duration-300 ease-in-out rounded-xl">
        <Image src={speed} alt="Speedy Delivery" width={50} height={50} />
        <h1 className="font-bold mt-2">Speedy Delivery</h1>
        <p>Home Delivery all over India</p>
      </div>
      <div className="flex flex-col items-center text-center hover:bg-gray-100 transition duration-300 ease-in-out rounded-xl">
        <Image src={trust} alt="Trust Pay" width={50} height={50} />
        <h1 className="font-bold mt-2">Trust Pay</h1>
        <p>100% Payment Protection. Easy Return Policy</p>
      </div>
      <div className="flex flex-col items-center text-center hover:bg-gray-100 transition duration-300 ease-in-out rounded-xl">
        <Image src={value} alt="Great Value" width={50} height={50} />
        <h1 className="font-bold mt-2">Great Value</h1>
        <p>We offer competitive prices on our entire product range</p>
      </div>
    </div>
  );
};

export default WebSpecials;
