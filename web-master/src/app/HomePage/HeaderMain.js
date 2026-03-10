"use client";

import React, { useState, useEffect, useContext } from "react";
import { debounce } from "lodash";
import Link from "next/link";
import Image from "next/image";
import { MdMenu } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import mike from "../Asset/Record.svg";
import logo from "../Asset/OnlineKingLogo.svg";
import search from "../Asset/searchIcon.svg";
import { CartContext } from "../Context/CartContext";
import useProductStore from "../storeContext/store";
import "./App.css";
import wishlist from "../Asset/miniheart.svg";
import cart from "../Asset/cart.svg";
import profile from "../Asset/Profile.svg";

const HeaderMain = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const { cartCounter, wishListCount, fetchWishListData, count } =
    useContext(CartContext);

  const {
    fetchSearchProductData,
    searchProducts,
    user,
    isAuthenticated,
    checkLocalStorageAndVerifyToken,
    fetchCartData,
    cartCount,
    wishlistCount,
    fetchWishlistData,
  } = useProductStore();

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = "en-US";

      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };

      speechRecognition.onerror = (event) => {
        console.error(event.error);
        setIsListening(false);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(speechRecognition);
    }
  }, []);

  useEffect(() => {
    checkLocalStorageAndVerifyToken();
    fetchCartData();
    fetchWishlistData();

    const debouncedFetchSearchProducts = debounce(async () => {
      await fetchSearchProductData(searchQuery);
    }, 500);

    if (searchQuery !== "") {
      debouncedFetchSearchProducts();
    } else {
      fetchSearchProductData("");
    }

    return () => {
      debouncedFetchSearchProducts.cancel();
    };
  }, [
    searchQuery,
    fetchSearchProductData,
    checkLocalStorageAndVerifyToken,
    fetchCartData,
    fetchWishlistData,
  ]);
  useEffect(() => {
    // Fetch wishlist data to get the latest count
    fetchWishListData();
  }, [fetchWishListData]);
  const handleClick = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const handleVoiceSearch = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening);
    }
  };

  return (
    <>
      <div className="font-fontNew">
        <div className="bg-[#45B348] w-full hidden md:block">
          <div className="flex flex-col md:flex-row md:items-center text-white">
            <h1 className="text-center text-lg md:text-left md:w-1/3 px-2">
              Welcome to ONLINEKING, India&apos;s Biggest Online IT Store
            </h1>
            <h1 className="text-center text-lg md:text-center md:w-1/3 px-2">
              Indian Warranty Products Only
            </h1>
            <h1 className="text-center text-lg md:text-right md:w-1/3 px-2">
              Customer Care 10am to 8pm : +91-9916501948
            </h1>
          </div>
        </div>

        <nav className="flex justify-between bg-cover py-3 px-2 md:px-9 h-[6rem] items-center nav font-fontNew">
          <Link href={"/"}>
            <div className="flex gap-3 items-center">
              <Image src={logo} alt="Logo" className="object-cover w-16" />
              <h1 className="text-white text-[45px]  logoFont">OnlineKing</h1>
            </div>
          </Link>
          <div className="flex items-center justify-between w-2/3 gap-[20px]">
            <div className="hidden relative md:flex md:flex-1 bg-white rounded-3xl md:justify-between items-center px-5 py-2">
              <div className="flex items-center gap-4">
                <Image src={search} alt="Search" className="w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search"
                  className="lg:text-lg outline-none w-32 md:w-60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Image
                src={mike}
                alt="Mic"
                className={`w-5 h-5 cursor-pointer ${isListening ? "text-red-500" : ""}`}
                onClick={handleVoiceSearch}
              />
              {searchQuery !== "" &&
                (searchProducts.length > 0 ? (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 z-[99] max-h-[400px] overflow-y-auto">
                    <div className="p-2 bg-gray-100 border-b border-gray-300 font-semibold text-[12px]">
                      Search Results
                    </div>
                    {searchProducts.map((result, index) => (
                      <Link href={`/ProductDetails/${result.id}`} key={index}>
                        <div className="p-2 border-b border-gray-200 text-[12px] hover:bg-[#45B348] hover:text-white transition duration-300 cursor-pointer">
                          {result.product_name}
                        </div>
                      </Link>
                    ))}
                    <div className="p-2 bg-gray-100 text-center text-[11px] sticky bottom-0 text-right">
                      Powered by online king
                    </div>
                  </div>
                ) : (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 z-[99]">
                    <div className="p-2 bg-gray-100 border-b border-gray-300 font-semibold text-[12px]">
                      No Results
                    </div>
                  </div>
                ))}
            </div>
            <button onClick={handleClick} className="md:hidden">
              {isMenuOpen ? (
                <IoMdClose className="text-white w-6 h-6" />
              ) : (
                <MdMenu className="text-white w-6 h-6" />
              )}
            </button>
            <div className="hidden md:flex gap-3">
              {isAuthenticated && (
                <>
                  <div className="relative inline-block">
                    <Link href="/WishList">
                      <Image
                        src={wishlist}
                        alt="wishlist"
                        className="size-10"
                      />
                    </Link>
                    {wishlistCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <div className="relative inline-block">
                    <Link href="/Cart">
                      <Image
                        src={cart}
                        alt="Cart"
                        className="size-10"
                        productData={props.cartData}
                        countData={props.count}
                      />
                    </Link>
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                      {cartCount}
                    </span>
                  </div>
                </>
              )}
              {!isAuthenticated ? (
                <Link href="/Login">
                  <h1
                    className="text-white text-2xl cursor-pointer pt-1"
                    style={{ transition: "color 0.1s" }} // Add smooth transition for color change
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#45b348")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "white")
                    }
                  >
                    Login / Register
                  </h1>
                </Link>
              ) : (
                <>
                  <Link href={`/profile/myaccount`}>
                    <div>
                      <Image src={profile} alt="Profile" className="size-10" />
                    </div>
                  </Link>
                  <Link href="/Login">
                    <h1 className="text-white text-2xl cursor-pointer pt-1">
                      {user.fullname}
                    </h1>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="fixed bg-white inset-0 z-50 flex flex-col items-center pt-10">
            <button
              onClick={handleClick}
              className="absolute top-5 right-5 md:hidden"
            >
              <IoMdClose className="text-black w-6 h-6" />
            </button>
            <div className="flex gap-3 items-center mb-8">
              <Image src={logo} alt="Logo" className="object-cover w-10 h-10" />
              <h1 className="text-black text-xl font-bold">Online King</h1>
            </div>
            {/* <Link
              href="/WishList"
              className="text-2xl hover:bg-gray-200 rounded-lg p-2 w-full text-center"
            >
              WishList
            </Link> */}
            <Link
              href="/Cart"
              className="text-2xl hover:bg-gray-200 rounded-lg p-2 w-full text-center"
            >
              Add To Cart
            </Link>
            <Link
              href="/Profile"
              className="text-2xl hover:bg-gray-200 rounded-lg p-2 w-full text-center"
            >
              Profile
            </Link>
            <Link href="/Login">
              <h1 className="text-2xl text-center cursor-pointer hover:bg-gray-200 rounded-lg p-2 w-full">
                Login/Register
              </h1>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default HeaderMain;
