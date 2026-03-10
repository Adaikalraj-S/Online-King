import Navbar from '@/app/components/Navbar/Navbar'
import Footer from '@/app/HomePage/Footer'
import HeaderMain from '@/app/HomePage/HeaderMain'
import Hero from '@/app/HomePage/Hero'
import WebSpeciails from '@/app/HomePage/WebSpeciails'
import React from 'react'

const page = () => {
    return (
        <div>
        {/* <HeaderMain /> */}
        <Navbar/>
        <div className="container mx-auto px-12 py-6 text-gray-600">
          <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
  
          <div className="flex flex-col gap-5">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Information Collection and Use</h2>
              <p className="text-lg">
                Onlineking is the sole owner of the information collected on this site. We will not sell, share, or rent this information to any outside parties, except as outlined in this policy. We collect information from our customers to process orders and better serve you with pertinent information, such as order confirmations and order status updates.
              </p>
              <p className="text-lg">
                Information collected includes your name, shipping address, billing address, telephone numbers, e-mail address, and payment information such as your credit card number. We also require you to submit a username and password of your choice for your future access to your account information. To safeguard that your username and password remain confidential, <strong>DO NOT</strong> share this information with anyone. If you elect to receive our newsletter or special promotions, your contact information will be used for the delivery of these items.
              </p>
            </section>
  
            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Registration & Order Processing</h2>
              <p className="text-lg">
                To process your orders placed on this website, you must first complete the registration form. During registration, you will be required to provide your contact information, which includes your name, e-mail address, telephone number, and street address. This information is used to provide you with important Onlineking.in services such as automated order status updates via e-mail.
              </p>
              <p className="text-lg">
                Most of the information collected during the registration process will be used to process orders. During the order process, you will have to provide financial information such as your credit card number, expiration date, money order, wire transfer, or check information. This information is used for billing purposes and to fulfill your order. If we have trouble processing an order, we will use this contact information to get in touch with you.
              </p>
            </section>
  
            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Cookies</h2>
              <p className="text-lg">
                We customize certain web page content based upon your browser type and other information provided by our cookie. If you choose to reject the cookie, you can still browse our store but will be unable to use the shopping cart to buy merchandise. The Onlineking shopping cart cannot function without cookies enabled so that the necessary information to process your order is retained. If you disable cookies, Onlineking will be unable to accept your online order.
              </p>
              <p className="text-lg">
                We will not share any personally identifiable information provided by this cookie with any third party. We will, however, link data stored in cookies to the personally identifiable information you submitted while on our site. This allows us to personalize your shopping experience and discern user preferences to evoke subconscious feelings of familiarity and assurance.
              </p>
            </section>
  
            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Log Files</h2>
              <p className="text-lg">
                We use IP addresses to analyze trends, administer the site, track user movement, and gather broad demographic information for aggregate use. We do not link IP addresses to personally identifiable information, and we do not distribute or share IP information with any third parties.
              </p>
            </section>
          </div>
        </div>
  
        <WebSpeciails />
        <Footer />
      </div>
    )
}

export default page
