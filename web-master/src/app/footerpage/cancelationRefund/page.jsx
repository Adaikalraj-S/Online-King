'use client';
import React from 'react';
import HeaderMain from '@/app/HomePage/HeaderMain';
import Footer from '@/app/HomePage/Footer';
import WebSpeciails from '@/app/HomePage/WebSpeciails';
import Navbar from '@/app/components/Navbar/Navbar';

const Page = () => {
  return (
    <div>
      {/* <HeaderMain /> */}
      <Navbar/>
      <div className="container mx-auto px-12 py-6 text-gray-600">
        <h1 className="text-3xl font-bold mb-6 text-center">Cancelation / Refund Policy</h1>
        <div className="flex flex-col gap-5"> 
          <section>
            <h2 className="text-xl font-semibold mb-2">Cancellations by the Customer</h2>
            <p className="text-lg">
            Cancellation notice and the order has not been processed/approved by us, we shall cancel the order and refund the entire amount. On cancellation of an order after it has been processed/approved by Onlineking.in, the cancellation charges will become applicable @ flat rate of 5% of the order value.Onlineking.in has the full right to decide whether an order has been processed or not. The customer agrees not to dispute the decision made by Onlineking.in and accept Onlineking.in decision regarding the cancellation. Products once dispatched cannot be returned. Nothing herein will prevent you from returning the product pursuant to rights available to you under applicable law.            </p>
          </section>
        </div>
      </div>
      
      <WebSpeciails />
      <Footer />
    </div>
  );
}

export default Page;
