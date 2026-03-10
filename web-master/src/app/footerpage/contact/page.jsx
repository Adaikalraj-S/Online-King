import Navbar from '@/app/components/Navbar/Navbar'
import Footer from '@/app/HomePage/Footer'
import HeaderMain from '@/app/HomePage/HeaderMain'
import Hero from '@/app/HomePage/Hero'
import WebSpeciails from '@/app/HomePage/WebSpeciails'
import React from 'react'

const page = () => {
  return (
    <div>
      {/* <HeaderMain/> */}
      <Navbar/>
      <Hero/>
      <div className=' flex px-12  py-[6rem] justify-around'>
        <div className=' text-xl text-gray-600 flex flex-col gap-4'>
          <p>Madhu IT Junction</p>
          <p>Vikram Pratap Choraria </p>
          <p># 4/1, Amrit Tower, 3rd Floor, PP Lane, 3rd Cross, SP Road, Bangalore, India.</p>
          <p>Ph:+91 9916501948, +91 9449052078</p>
          <p>Email : madhuitjunction@yahoo.com</p>
        </div>
        <div className='flex flex-col gap-4'>
          <h1 className='text-2xl'>SEND ENQUIRY</h1>
          <p className=' text-gray-600 text-xl'>Share your requirements</p>
          <div className=' border-solid border-2 rounded-lg w-[40rem] h-12 px-2 py-3'>
            <input type="text" name="" id=""  placeholder='Your name' className=' outline-none'/>
          </div>
          <div className=' border-solid border-2 rounded-lg w-[40rem] h-12 px-2 py-3'>
            <input type="text" name="" id=""  placeholder='Your name' className=' outline-none'/>
          </div>
          <div className='border-solid  rounded-lg w-[40rem] h-auto' >
            <textarea name="" id="" placeholder='Enquiry' className='border-solid border-2 rounded-lg w-[40rem] h-auto outline-none  ' ></textarea>
            </div>
            <div className=' '> 
              <button className=' border text-xl bg-[#45B348] text-white rounded-lg w-[7rem] h-[2rem] hover:bg-[#265f28]'>Submit</button>
            </div>
        </div>
      </div>
      <WebSpeciails/>
      <Footer/>
    </div>
  )
}

export default page
