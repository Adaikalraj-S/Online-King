'use client'
import OfferMain from '@/app/components/products/productsLists/OfferMain'
import Footer from '@/app/HomePage/Footer'
import HeaderMain from '@/app/HomePage/HeaderMain'
import Hero from '@/app/HomePage/Hero'
import WebSpeciails from '@/app/HomePage/WebSpeciails'
import React from 'react'

const Page = ({ params }) => {
  const convertInRupee = (number) => {
    // console.log(number);
    return number.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  return (
    <>
      <HeaderMain />

      <Hero />

      <OfferMain params={params} convertInRupee={convertInRupee} />

      <WebSpeciails />
      
      <Footer />
    </>
  )
}

export default Page
