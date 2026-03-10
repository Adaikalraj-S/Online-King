// import Footer from '@/app/HomePage/Footer';
// import HeaderMain from '@/app/HomePage/HeaderMain';
// import Hero from '@/app/HomePage/Hero';
// import WebSpeciails from '@/app/HomePage/WebSpeciails';
// import React from 'react';
// import Image from 'next/image';
// import headphone from '../../Asset/HeadphoneBoat.svg';

// const page = () => {
//   return (
//     <div>
//       <HeaderMain />
//       <Hero />
//       <div className='px-12 py-5'>
//         <div className='grid grid-cols-4 md:grid-cols-6 gap-4'>
//           <div className='border-solid border-2 rounded-xl bg-white flex gap-4'>
//             <Image src={headphone} alt="Headphone" className='size-[10rem]' />
//             <div className='flex justify-center items-center'>
//               <h1 className='text-xl'>Boat</h1>
//             </div>
//           </div>
//           <div className='border-solid border-2 rounded-xl bg-white flex gap-4'>
//             <Image src={headphone} alt="Headphone" className='size-[10rem]' />
//             <div className='flex justify-center items-center'>
//               <h1 className='text-xl'>Boat</h1>
//             </div>
//           </div>
//           <div className='border-solid border-2 rounded-xl bg-white flex gap-4'>
//             <Image src={headphone} alt="Headphone" className='size-[10rem]' />
//             <div className='flex justify-center items-center'>
//               <h1 className='text-xl'>Boat</h1>
//             </div>
//           </div>
//           <div className='border-solid border-2 rounded-xl bg-white flex gap-4'>
//             <Image src={headphone} alt="Headphone" className='size-[10rem]' />
//             <div className='flex justify-center items-center'>
//               <h1 className='text-xl'>Boat</h1>
//             </div>
//           </div>
//           <div className='border-solid border-2 rounded-xl bg-white flex gap-4'>
//             <Image src={headphone} alt="Headphone" className='size-[10rem]' />
//             <div className='flex justify-center items-center'>
//               <h1 className='text-xl'>Boat</h1>
//             </div>
//           </div>
//           <div className='border-solid border-2 rounded-xl bg-white flex gap-4'>
//             <Image src={headphone} alt="Headphone" className='size-[10rem]' />
//             <div className='flex justify-center items-center'>
//               <h1 className='text-xl'>Boat</h1>
//             </div>
//           </div>
//           <div className='border-solid border-2 rounded-xl bg-white flex gap-4'>
//             <Image src={headphone} alt="Headphone" className='size-[10rem]' />
//             <div className='flex justify-center items-center'>
//               <h1 className='text-xl'>Boat</h1>
//             </div>
//           </div>
//         </div>
//       </div>
//       <WebSpeciails />
//       <Footer />
//     </div>
//   );
// };

// export default page;

import React from 'react';
import Image from 'next/image';
import Footer from '@/app/HomePage/Footer';
import HeaderMain from '@/app/HomePage/HeaderMain';
import Hero from '@/app/HomePage/Hero';
import WebSpeciails from '@/app/HomePage/WebSpeciails';
import headphone from '../../Asset/HeadphoneBoat.svg';
import Navbar from '@/app/components/Navbar/Navbar';

const Page = () => {
  return (
    <div>
      {/* Header and Hero Components */}
      {/* <HeaderMain /> */}
      <Navbar/>
      <Hero />
      
      {/* Product Grid Section */}
      {/* <div className='px-12 py-5'>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          {Array(7).fill().map((_, index) => (
            <div key={index} className='border-solid border-2 rounded-xl bg-white flex gap-4 p-4'>
              <Image 
                src={headphone} 
                alt="Headphone" 
                width={160} 
                height={160} 
                className='object-contain' 
              />
              <div className='flex justify-center items-center'>
                <h1 className='text-xl'>Boat</h1>
              </div>
            </div>
          ))}
        </div>
      </div> */}
      <div className='p-8'>
        <img src="https://logodix.com/logo/324843.jpg" className='w-full h-1/4 object-contain'/>
      </div>
      {/* <div class="bg-gray-50 p-6 md:p-12">
  <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
    Customer is Always a King, and We Are Kings in What We Do
  </h1>
  <p class="text-lg md:text-xl text-gray-700 leading-relaxed text-center">
    We particularly specialize in selling <span class="font-semibold text-gray-900">high-end products</span> across the 
    <span class="font-semibold text-gray-900"> entire computer hardware and software category</span>.
  </p>
  <p class="text-lg md:text-xl text-gray-700 leading-relaxed mt-4 text-center">
    In one word, you can buy <span class="font-semibold text-gray-900">all the products under one roof</span> to make a 
    complete <span class="font-semibold text-gray-900">Desktop System, PC, or Server.</span>
  </p>
</div> */}

     
      
      {/* Specials and Footer Components */}
      <WebSpeciails />
      <Footer />
    </div>
  );
};

export default Page;

