"use client";

import Navbar from '@/app/components/Navbar/Navbar';
import Footer from '@/app/HomePage/Footer';
import HeaderMain from '@/app/HomePage/HeaderMain';
import Hero from '@/app/HomePage/Hero';
import WebSpeciails from '@/app/HomePage/WebSpeciails';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Page = () => {
  const [aboutUsContent, setAboutUsContent] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/fetch-static-data');
        setAboutUsContent(response.data.data.about_us);   
        console.log("response", response.data);
      } catch (error) {
        console.error('Failed to fetch static data', error);
      }
    };

    fetchTerms();
  }, []);

  return (
    <div>
      {/* <HeaderMain /> */}
      <Navbar/>
      <Hero />
      {/* {aboutUsContent && (
        <section className="about-us-section">
          <h2>About Us</h2>
          <div dangerouslySetInnerHTML={{ __html: aboutUsContent }} />
        </section>
      )} */}

      <div className="container mx-auto px-12 py-6 text-gray-600">
  <h1 className="text-3xl font-bold mb-6 text-center">About Us</h1>

  <div className="flex flex-col gap-8">
    {/* Introduction Section */}
    <section className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
      <p className="text-lg">
        As the name suggests, &quot;Customer is always a King and we are King in what we do&quot;. We specialize in selling high-end products across the entire Computer Hardware and Software category. In one word, you can buy all the products under one roof to make a complete Desktop System/PC/Server. If you need any help in making an awesome PC for yourself, we&apos;re here to help.
      </p>
      <p className="text-lg mt-4">
        We ensure that all credit/debit card and net banking transactions are done through secure and trusted gateways. All your bank details are safe and secure and will not be shared with any third party.
      </p>
    </section>

    {/* Contact Section */}
    <section className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <p className="text-lg mb-2">
        For any inquiry before purchase, kindly contact us at:
      </p>
      <p className="text-lg">
        <strong>Mobile:</strong> 09449052078 / 09916501948
      </p>
      <p className="text-lg">
        <strong>Email:</strong> madhuitjunction@yahoo.com
      </p>
      <p className="text-lg mt-4">
        We respect your feedback and suggestions.
      </p>
    </section>

    {/* Bank Details Section */}
    <section className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Our Bank Account Details for NEFT/RTGS/IMPS</h2>
      <div className="text-lg">
        <p><strong>Bank Name:</strong> Union Bank of India (Rajarajeshwarinagar Branch)</p>
        <p><strong>Company Name:</strong> MADHU IT JUNCTION</p>
        <p><strong>IFSC Code:</strong> UBIN0558168</p>
        <p><strong>Account Number:</strong> 510101007241112</p>
        <p><strong>A/c Type:</strong> Current Account (CA)</p>
      </div>
    </section>

    {/* Google Maps Section */}
    <section className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Our Location</h2>
      <p className="text-lg mb-4">Find us on Google Maps:</p>
      <div className="w-full h-64">
        <iframe
          className="w-full h-full rounded-lg shadow-md"
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243646.4382281294!2d77.520639!3d12.921024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzE1LjciTiA3N8KwMzEnMTQuMyJF!5e0!3m2!1sen!2sin!4v1630402499146!5m2!1sen!2sin`}
          frameBorder="0"
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
        ></iframe>
      </div>
    </section>
  </div>
</div>

      <WebSpeciails />
      <Footer />
    </div>
  );
};

export default Page;
