// import React from 'react';
// import HeaderMain from '../HomePage/HeaderMain';
// import Hero from '../HomePage/Hero';
// import Razor from "../Asset/RazorPayNew.png";
// import visa from "../Asset/VisaFooter.svg";
// import Image from 'next/image';
// import paytm from "../Asset/Paytem.svg";
// import headphone from "../Asset/HeadphoneBoat.svg";
// import rupee from "../Asset/Rupee.svg";

// const page = () => {
//   return (
//     <div>
//       <HeaderMain />
//       <Hero />
//       <div className='flex flex-col lg:flex-row'>
//         <div className='py-7 px-4 sm:px-8 w-full lg:w-[50rem] flex flex-col gap-4'>
//           <div className='flex justify-between'>
//             <h1 className='text-xl'>Contact</h1>
//             <h1 className='text-red-600 text-xl hover:text-red-900 '>Login</h1>
//           </div>
//           <div className='w-full lg:w-[45rem] border-solid border-2 border-gray rounded-lg h-[4rem] flex items-center px-3 py-3'>
//             <input type="text" placeholder='Email' className='w-full outline-none' />
//           </div>
//           <div className='flex gap-3'>
//             <input type="checkbox" id="offer" />
//             <label htmlFor="offer">Email me with News & offers</label>
//           </div>
//           <div className='flex flex-col gap-3'>
//             <h1 className='text-xl font-bold'>Delivery</h1>
//             <div className='w-full lg:w-[45rem] h-[4rem] border-solid border-2 rounded-lg flex items-center px-3 py-3'>
//               <input type="text" placeholder='Country/Region' className='w-full outline-none' />
//             </div>
//             <div className='flex flex-col md:flex-row gap-4'>
//               <div className='border-solid border-2 border-gray rounded-lg h-[4rem] flex items-center w-full md:w-[22rem] px-3 py-3'>
//                 <input type="text" placeholder='First Name' className='w-full outline-none' />
//               </div>
//               <div className='border-solid border-2 border-gray rounded-lg h-[4rem] flex items-center w-full md:w-[22rem] px-3 py-3'>
//                 <input type="text" placeholder='Last Name' className='w-full outline-none' />
//               </div>
//             </div>
//             <div className='w-full lg:w-[45rem] h-[4rem] border-solid border-2 rounded-lg flex items-center px-3 py-3'>
//               <input type="text" placeholder='Company (Optional)' className='w-full outline-none' />
//             </div>
//             <div className='w-full lg:w-[45rem] h-[4rem] border-solid border-2 rounded-lg flex items-center px-3 py-3'>
//               <input type="text" placeholder='Address' className='w-full outline-none' />
//             </div>
//             <div className='flex flex-col md:flex-row gap-4'>
//               <div className='border-solid border-2 border-gray rounded-lg h-[4rem] flex items-center w-full md:w-44 px-4 py-3'>
//                 <input type="text" placeholder='City' className='w-full outline-none' />
//               </div>
//               <div className='border-solid border-2 border-gray rounded-lg h-[4rem] flex items-center w-full md:w-60 px-4 py-3'>
//                 <input type="text" placeholder='State' className='w-full outline-none' />
//               </div>
//               <div className='border-solid border-2 border-gray rounded-lg h-[4rem] flex items-center w-full md:w-44 px-4 py-3'>
//                 <input type="text" placeholder='Pincode' className='w-full outline-none' />
//               </div>
//             </div>
//             <div className='w-full lg:w-[45rem] h-[4rem] border-solid border-2 rounded-lg flex items-center px-3 py-3'>
//               <input type="text" placeholder='Phone' className='w-full outline-none' />
//             </div>
//             <div className='flex gap-3'>
//               <input type="checkbox" id="save-info" />
//               <label htmlFor="save-info">Save This Info For Next Time</label>
//             </div>
//             <div className='flex flex-col gap-3'>
//               <h1 className='text-xl font-bold'>Shipping Method</h1>
//               <div className='w-full lg:w-[45rem] h-[4rem] border-solid border-2 rounded-lg flex items-center px-3 py-3'>
//                 <input type="text" placeholder='Enter your Shipping Method' className='w-full outline-none' />
//               </div>
//             </div>
//             <div className='flex flex-col gap-3'>
//               <h1 className='text-xl font-bold'>Payment Method</h1>
//               <p className='text-[#B0A8A8]'>All Transactions Are Secure & Encrypted</p>
//               <div>
//                 <div className='w-full lg:w-[45rem] h-auto border-solid border-2 rounded-lg flex flex-col md:flex-row items-center px-4 py-4 gap-4'>
//                   <input type="text" placeholder='Razor Pay Secure (Upi, Cards, Wallets, Netbanking)' className='w-full lg:w-[25rem] outline-none' />
//                   <div className='flex gap-2 flex-wrap justify-center'>
//                     <Image src={Razor} alt="Razorpay" className='w-8 h-8' />
//                     <Image src={paytm} alt="Paytm" className='w-8 h-8' />
//                     <Image src={visa} alt="Visa" className='w-8 h-8' />
//                     <p>+15</p>
//                   </div>
//                 </div>
//               </div>
//               <div className='py-12'>
//                 <button className='bg-[#45B348] text-white w-full lg:w-[45rem] h-[5rem] border-solid border-2 rounded-lg py-3 px-3 text-3xl font-bold'>Pay Now</button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='py-16 px-4 sm:px-6 lg:px-6'>
//           <div className='flex flex-col md:flex-row'>
//             <div className='bg-[#D9D9D9] w-full md:w-[29rem]'>
//               <Image src={headphone} alt="" className='items-center w-full md:w-[27rem]' />
//             </div>
//             <div className='px-4 md:px-7'>
//               <h1 className='text-xl py-9 font-bold'>Sony- Bluetooth Boom Headphone S1 Series</h1>
//               <div className='flex gap-5'>
//                 <Image src={rupee} alt="Rupee" />
//                 <p className='text-xl'>25,864.00</p>
//               </div>
//             </div>
//           </div>
//           <div className='flex flex-col md:flex-row gap-7 py-5'>
//             <div className='w-full md:w-[40rem] border-solid border-2 border-gray rounded-lg h-[4rem] flex items-center px-3 py-3'>
//               <input type="text" placeholder='Discount Code' className='w-full outline-none' />
//             </div>
//             <div className='w-full md:w-[9rem] border-solid border-2 border-gray rounded-lg h-[4rem] flex items-center px-3 py-3'>
//               <input type="text" placeholder='Apply' className='w-full outline-none' />
//             </div>
//           </div>
//           <div className='flex flex-col gap-5 font-bold'>
//             <div className='flex justify-between'>
//               <h1>Sub Total</h1>
//               <p>Rs.25,864.00</p>
//             </div>
//             <div className='flex justify-between'>
//               <h1>Shipping Fee</h1>
//               <p className='text-green-500'>Free</p>
//             </div>
//             <div className='flex justify-between'>
//               <h1>Discount</h1>
//               <p className='text-red-500'>Apply Coupon</p>
//             </div>
//             <div className='flex justify-between'>
//               <h1>Total</h1>
//               <div className='flex flex-col gap-3'>
//                 <p>Rs.25,864.00</p>
//                 <p>Including Taxes</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default page;

import React from "react";
import Image from "next/image";
import HeaderMain from "@/app/HomePage/HeaderMain";
import Hero from "@/app/HomePage/Hero";
import Razor from "../../app/Asset/RazorPayNew.png";
import Paytm from "../../app/Asset/Paytem.svg";
import Visa from "../../app/Asset/VisaFooter.svg";
import Headphone from "../../app/Asset/HeadphoneBoat.svg";
import Rupee from "../../app/Asset/Rupee.svg";

const Page = () => {
  return (
    <div>
      {/* <HeaderMain />
      <Hero /> */}
      {/* <div className="flex flex-col lg:flex-row">
        <div className="py-7 px-4 sm:px-8 w-full lg:w-[50rem] flex flex-col gap-4">
          
          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-bold">Payment Method</h1>
            <p className="text-[#B0A8A8]">
              All Transactions Are Secure & Encrypted
            </p>
            <div>
              <div className="w-full lg:w-[45rem] h-auto border-solid border-2 rounded-lg flex flex-col md:flex-row items-center px-4 py-4 gap-4">
                <input
                  type="text"
                  placeholder="Razor Pay Secure (Upi, Cards, Wallets, Netbanking)"
                  className="w-full lg:w-[25rem] outline-none"
                />
                <div className="flex gap-2 flex-wrap justify-center">
                  <Image
                    width={32}
                    height={32}
                    src={Razor}
                    alt="Razorpay"
                    className="w-8 h-8"
                  />
                  <Image
                    width={32}
                    height={32}
                    src={Paytm}
                    alt="Paytm"
                    className="w-8 h-8"
                  />
                  <Image
                    width={32}
                    height={32}
                    src={Visa}
                    alt="Visa"
                    className="w-8 h-8"
                  />
                  <p>+15</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        <div className="py-16 px-4 sm:px-6 lg:px-6">
          <div className="flex flex-col md:flex-row">
            <div className="bg-[#D9D9D9] w-full md:w-[29rem]">
              <Image
                src={Headphone}
                alt="Headphone"
                width={432}
                height={432}
                className="items-center w-full md:w-[27rem]"
              />
            </div>
            <div className="px-4 md:px-7">
              <h1 className="text-xl py-9 font-bold">
                Sony- Bluetooth Boom Headphone S1 Series
              </h1>
              <div className="flex gap-5">
                <Image width={24} height={24} src={Rupee} alt="Rupee" />
                <p className="text-xl">25,864.00</p>
              </div>
            </div>
          </div>
          
        </div>
      </div> */}
      paymenT
    </div>
  );
};

export default Page;
