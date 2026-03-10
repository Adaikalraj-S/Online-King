// "use client";
// import React from "react";
// import Image from "next/image";
// import logo from "../Asset/OnlineKingLogo.svg";
// import link from "../Asset/devicon_linkedin.svg";
// import fb from "../Asset/logos_facebook.svg";
// import google from "../Asset/Google.svg";
// import twitter from "../Asset/Twitter.svg";
// import insta from "../Asset/Insta.svg";
// import visa from "../Asset/VisaFooter.svg";
// import phonepe from "../Asset/Phonepe (2).svg";
// import paytm from "../Asset/Paytem.svg";
// import mastercard from "../Asset/masterCard.png";
// import cod from "../Asset/CODFooter.svg";
// import { SlCalender } from "react-icons/sl";
// import Link from "next/link";
// import { SiRazorpay } from "react-icons/si";

// const Footer = () => {
//   return (
//     <div className="bg-[#45B348] py-8 px-4 md:py-12 md:px-12 font-fontNew">
//       <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
//         <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
//           <Image src={logo} alt="Logo" className="w-10 h-10" />
//           <h1 className="text-2xl text-white ml-2 md:text-3xl font-bold logoFont">
//             OnlineKing
//           </h1>
//         </div>
//         <div className="text-white mb-4 md:mb-0">
//           <h1 className="font-bold mb-2">OUR COMPANY</h1>
//           <ul className="space-y-1 list-disc">
//             <li>
//               <Link href="/footerpage/about">About Us</Link>
//             </li>
//             <li>
//               <Link href="/footerpage/brands">Brands</Link>
//             </li>
//             <li>
//               <Link href="/footerpage/contact">Contact</Link>
//             </li>
//             <li>
//               <Link href="/footerpage/privacy">Privacy policy</Link>
//             </li>
//             <li>
//               <Link href="/footerpage/term">Terms and conditions</Link>
//             </li>
//           </ul>
//         </div>
//         <div className="text-white mb-4 md:mb-0">
//           <h1 className="font-bold mb-2">MY ACCOUNT</h1>
//           <ul className="space-y-1 list-disc">
//             <li>
//               <Link href="/account">My Account</Link>
//             </li>
//             <li>
//               <Link href="/Cart">Shopping cart</Link>
//             </li>
//             <li>
//               <Link href="/checkout">Checkout</Link>
//             </li>
//             <li>
//               <Link href="/WishList">Wishlist</Link>
//             </li>
//           </ul>
//         </div>
//         <div className="text-white mb-4 md:mb-0">
//           <h1 className="font-bold mb-2">SECURE PAYMENT</h1>
//           <div className="flex flex-col gap-3">
//             <div className="flex space-x-2">
//               <Image src={visa} alt="Visa" className="w-10 h-10" />
//               <Image src={mastercard} alt="Mastercard" className="w-10 h-10" />
//               <Image src={phonepe} alt="PhonePe" className="w-10 h-10" />
//               <Image src={paytm} alt="Paytm" className="w-10 h-10" />
//             </div>
//             <div className="flex gap-3">
//               <SiRazorpay className=" size-10 mr-3 ml-3" />
//               <div className=" flex text-black bg-[#D9D9D9] items-center h-12 w-24 rounded-lg  px-3 justify-center gap-2">
//                 <SlCalender />
//                 <p className=" text-xs">Easy EMI option</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="text-white">
//           <h1 className="font-bold mb-2">SOCIAL MEDIA LINKS</h1>
//           <div className="flex space-x-2">
//             <Image src={fb} alt="Facebook" className="w-8 h-8" />
//             <Image src={twitter} alt="Twitter" className="w-8 h-8" />
//             <Image src={insta} alt="Instagram" className="w-8 h-8" />
//             <Image src={google} alt="Google" className="w-8 h-8" />
//             <Image src={link} alt="LinkedIn" className="w-8 h-8" />
//           </div>
//         </div>
//       </div>
//       footer
//     </div>
//   );
// };

// export default Footer;

import React from "react";
import Image from "next/image";
import logo from "../Asset/OnlineKingLogo.svg";
import link from "../Asset/devicon_linkedin.svg";
import fb from "../Asset/logos_facebook.svg";
import google from "../Asset/Google.svg";
import twitter from "../Asset/Twitter.svg";
import insta from "../Asset/Insta.svg";
import visa from "../Asset/VisaFooter.svg";
import phonepe from "../Asset/Phonepe (2).svg";
import paytm from "../Asset/Paytem.svg";
import mastercard from "../Asset/masterCard.png";
import { SlCalender } from "react-icons/sl";
import Link from "next/link";
import { SiRazorpay } from "react-icons/si";

const Footer = () => {
  return (
    <div className="bg-[#45B348] py-8 px-4 md:py-12 md:px-12 font-fontNew">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
        {/* Logo and Title Section */}
        <div className="">
          <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
            <Image
              src={logo}
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <h1 className="text-2xl text-white ml-2 md:text-3xl font-bold logoFont">
              OnlineKing
            </h1>
          </div>
          <p className="mt-1 !text-justify md:text-left text-xs text-white leading-relaxed max-w-72">
            {/* <span className="font-semibold text-white">
              Customer is always a King, and we are King in what we do.
            </span>
            We specialize in selling{" "}
            <span className="font-semibold text-white">high-end products</span>{" "}
            across the
            <span className="font-semibold text-white">
              {" "}
              entire computer hardware and software category.
            </span>
            Buy all the products under one roof to make a complete{" "}
            <span className="font-semibold text-white">
              Desktop System, PC, or Server.
            </span> */}
            Customer is always a King and we are King in what we do. We
            particularly specialize in selling High end Products across Entire
            Computer Hardware and Software Category. In One word, you can buy
            all the Products under one Roof to make a Complete Desktop
            System/PC/Server. If you need any help in making an Awesome PC for
            yourself. We Also ensures that all credit/debit card and net banking
            transactions are done through secured and trusted gateways.
          </p>
        </div>

        <div className="text-white mb-4 md:mb-0">
          <h1 className="font-bold mb-2 underline">OUR COMPANY</h1>
          <ul className="space-y-1 list-disc">
            <li>
              <Link href="/static_page/about_us">About Us</Link>
            </li>
            <li>
              <Link href="/footerpage/brands">Brands</Link>
            </li>
            <li>
              <Link href="/static_page/contact_us">Contact Us</Link>
            </li>
            <li>
              <Link href="/static_page/privacy_policy">Privacy policy</Link>
            </li>
            <li>
              <Link href="/static_page/term_conditions">
                Terms and conditions
              </Link>
            </li>
            <li>
              <Link href="/static_page/cancellation_policy">
                Cancellation/Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* My Account Section */}
        <div className="text-white mb-4 md:mb-0">
          <h1 className="font-bold mb-2 underline">MY ACCOUNT</h1>
          <ul className="space-y-1 list-disc">
            <li>
              <Link href="/profile/my-account">My Account</Link>
            </li>
            <li>
              <Link href="/Cart">Shopping cart</Link>
            </li>
            {/* <li>
              <Link href="/checkout">Checkout</Link>
            </li> */}
            <li>
              <Link href="/WishList">Wishlist</Link>
            </li>
          </ul>
        </div>

        {/* Secure Payment Section */}
        <div className="text-white mb-4 md:mb-0">
          <h1 className="font-bold mb-2 underline">SECURE PAYMENT</h1>
          <div className="flex flex-col gap-3">
            <div className="flex space-x-2">
              <Image
                src={visa}
                alt="Visa"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <Image
                src={mastercard}
                alt="Mastercard"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <Image
                src={phonepe}
                alt="PhonePe"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <Image
                src={paytm}
                alt="Paytm"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </div>
            <div className="flex gap-3">
              <SiRazorpay className=" size-10 mr-3 ml-3" />
              <div className="flex text-black bg-[#D9D9D9] items-center h-12 w-24 rounded-lg px-3 justify-center gap-2">
                <SlCalender />
                <p className="text-xs">Easy EMI option</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links Section */}
        <div className="text-white">
          <h1 className="font-bold mb-2 underline">SOCIAL MEDIA LINKS</h1>
          <div className="flex space-x-2">
            <Image
              src={fb}
              alt="Facebook"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <Image
              src={twitter}
              alt="Twitter"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <Image
              src={insta}
              alt="Instagram"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <Image
              src={google}
              alt="Google"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <Image
              src={link}
              alt="LinkedIn"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
