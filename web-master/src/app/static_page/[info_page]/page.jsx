import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../HomePage/Hero';
import WebSpecials from '@/app/HomePage/WebSpeciails';
import Footer from '@/app/HomePage/Footer';
import axios from '../../../../axios';
import ContactUsForm from '@/app/components/utils/ContactUsForm';

const Page = async ({ params }) => {
  const infoPage = params.info_page;

  // Fetch static page data from the backend
  const staticPageData = await axios.get('/api/fetch-static-data');


  // Destructure data and statuses from response
  const {
    about_us,
    contact_us,
    privacy_policy,
    cancellation_policy,
    refund_policy,
    return_policy,
    shipping_policy,
    about_status,
    contact_status,
    privacy_status,
    cancellation_status,
    refund_status,
    return_status,
    shipping_status,
  } = staticPageData.data.data;


  // Function to render the content based on the page type and status
  const renderStaticPageContent = () => {
    switch (infoPage) {
      case 'about_us':
        return about_status ? (
          <>
         
          <div id="static_page" className="static_page" dangerouslySetInnerHTML={{ __html: about_us }}></div>
          </>
        ) : (
          <p>About Us page is not available.</p>
        );

      case 'contact_us':
        return contact_status ? (
          <div className='md:flex md:justify-between md:gap-8'>
            <div>
            <div className='mb-4'>
          <iframe 
          className='w-full h-80'
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15555.175013251788!2d77.5206481!3d12.9209735!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15e0576ef80f%3A0x263a0361424db70e!2sMadhu%20IT%20Junction!5e0!3m2!1sen!2sin!4v1733731968933!5m2!1sen!2sin"
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">

          </iframe>
          </div>
            <div id="static_page" className="static_page" dangerouslySetInnerHTML={{ __html: contact_us }}></div>
            </div>
            <div className='md:flex-1 h-full'>
              <ContactUsForm/>
            </div>
          </div>
        ) : (
          <p>Contact Us page is not available.</p>
        );

      case 'privacy_policy':
        return privacy_status ? (
          <div id="static_page" className="static_page" dangerouslySetInnerHTML={{ __html: privacy_policy }}></div>
        ) : (
          <p>Privacy Policy page is not available.</p>
        );

      case 'cancellation_policy':
        return cancellation_status ? (
          <div id="static_page" className="static_page" dangerouslySetInnerHTML={{ __html: cancellation_policy }}></div>
        ) : (
          <p>Cancellation Policy page is not available.</p>
        );

      case 'refund_policy':
        return refund_status ? (
          <div id="static_page" className="static_page" dangerouslySetInnerHTML={{ __html: refund_policy }}></div>
        ) : (
          <p>Refund Policy page is not available.</p>
        );

      case 'term_conditions':
        return return_status ? (
          <div id="static_page" className="static_page" dangerouslySetInnerHTML={{ __html: return_policy }}></div>
        ) : (
          <p>Return Policy page is not available.</p>
        );

      case 'shipping_policy':
        return shipping_status ? (
          <div id="static_page" className="static_page" dangerouslySetInnerHTML={{ __html: shipping_policy }}></div>
        ) : (
          <p>Shipping Policy page is not available.</p>
        );

      default:
        return <p>Page not found.</p>;
    }
  };

  return (
    <div>
      <Navbar />
      <Hero />
      <div className="content-container p-4 md:p-12">
        {renderStaticPageContent()}
      </div>
      <WebSpecials />
      <Footer />
    </div>
  );
};

export default Page;
