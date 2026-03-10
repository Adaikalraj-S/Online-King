//import { Inter } from "next/font/google";
"use client";
import "./globals.css";
import { StepperContext } from "./CheckoutPage/StepperContext";
import SnackbarProvider from "./SnackBarProvider";
import CartContextWrapper, { CartContext } from "./Context/CartContext";
import useProductStore from "./storeContext/store";
import { useEffect } from "react";

//const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Tawk.to Script */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
              (function () {
                var s1 = document.createElement("script"),
                  s0 = document.getElementsByTagName("script")[0];
                s1.async = true;
                s1.src = 'https://embed.tawk.to/67593da049e2fd8dfef62cab/1ieq9hflm';
                s1.charset = 'UTF-8';
                s1.setAttribute('crossorigin', '*');
                s0.parentNode.insertBefore(s1, s0);
              })();
            `,
          }}
        />
      </head>
      <body className="font-fontNew overflow-x-hidden">
        <StepperContext>
          <SnackbarProvider>
            <CartContextWrapper>
              <div>
                <div
                  id="onlineKing_info"
                  className="bg-[#45B348] w-full md:block py-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center text-white">
                    <h1 className="text-center text-sm md:text-left md:w-1/3 px-2">
                      Welcome to ONLINEKING, India&apos;s Biggest Online IT
                      Store
                    </h1>
                    <h1 className="text-center text-sm md:text-center md:w-1/3 px-2">
                      Indian Warranty Products Only
                    </h1>
                    <h1 className="text-center text-sm md:text-right md:w-1/3 px-2">
                      Customer Care 11am to 7pm : +91-9481332048
                    </h1>
                  </div>
                </div>
                {children}
              </div>
            </CartContextWrapper>
          </SnackbarProvider>
        </StepperContext>
      </body>
    </html>
  );
}
