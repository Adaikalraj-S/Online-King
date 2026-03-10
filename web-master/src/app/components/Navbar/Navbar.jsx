"use client";
import React, { useEffect, useState } from "react";
import useProductStore from "../../storeContext/store";
import Link from "next/link";
import logo from "../../Asset/OnlineKingLogo.svg";
import {
  FaHamburger,
  FaHeart,
  FaOpencart,
  FaRegHeart,
  FaUser,
} from "react-icons/fa";
import Image from "next/image";
import Searchbar from "../Searchbar/Searchbar";
import { CiHeart, CiMenuBurger, CiShoppingCart, CiUser } from "react-icons/ci";
import SideNavbar from "./SideNavbar";
import { Popover, Tooltip } from "@mui/material";
import { Router, useRouter } from "next/navigation";

const popoverContent = [
  {
    name: "My Profile",
    link: "/profile/my-account",
  },
  {
    name: "Logout",
    link: "/",
  },
];

const Navbar = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const {
    fetchSearchProductData,
    searchProducts,
    user,
    isAuthenticated,
    userProfile,
    checkLocalStorageAndVerifyToken,
    fetchCartData,
    cartCount,
    wishlistCount,
    fetchWishlistData,
    fetchPreCartData,
    PreOrderCartsCount
  } = useProductStore();

  useEffect(() => {
    checkLocalStorageAndVerifyToken();
    fetchCartData();
    fetchWishlistData();
    fetchPreCartData();
  }, []);

  const handleSidebarNav = () => {
    setSideNavOpen((prev) => !prev);
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  console.log(PreOrderCartsCount, "user-pre-order");

  return (
    <nav className="nav w-full">
      <div className="flex font-medium justify-between items-center md:p-6 p-4">
        {/* Logo Section */}
        <Link href={`/`} className="flex justify-between items-center gap-2">
          <Image
            width={1000}
            height={1000}
            src={logo}
            alt="logo"
            className="md:cursor-pointer w-12 md:w-16 object-contain"
          />
          <h2 className="hidden md:block logoFont text-white text-4xl">
            OnlineKing
          </h2>
        </Link>

        {/* Search Seaction */}
        <div className="lg:w-[600px] hidden md:block">
          <Searchbar />
        </div>

        {/* Login/sign-up and wishlist cart section */}
        <div className="flex justify-end items-center md:justify-between gap-5">
          {isAuthenticated ? (
            <>
              <div className="relative inline-block">
                <Link href="/WishList">
                  <span className={`relative text-2xl text-green-500`}>
                    <FaRegHeart />
                    {/* <FaHeart /> */}
                  </span>
                </Link>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <div className="relative inline-block">
                <Link href="/Cart">
                  <span className="text-4xl text-green-500">
                    <CiShoppingCart />
                  </span>
                </Link>
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                  {cartCount}
                </span>
              </div>
              {/* {
                PreOrderCartsCount > 0 && 
                <div className="relative inline-block">
              <Tooltip 
                  PopperProps={{
                    sx: {
                      "& .MuiTooltip-tooltip": {
                        backgroundColor: "white",
                        color: "green",
                      },
                      "& .MuiTooltip-arrow": {
                        color: "white",
                      },
                    },
                  }}
                  arrow title="Pre Order">
                    <Link href="/pre_order">
                      <span className="text-4xl text-green-500">
                        <FaOpencart />
                      </span>
                    </Link>
                  </Tooltip>
                  
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                  {PreOrderCartsCount}
                </span>
              </div>
              } */}
               <div className="relative inline-block">
              <Tooltip 
                  PopperProps={{
                    sx: {
                      "& .MuiTooltip-tooltip": {
                        backgroundColor: "white",
                        color: "green",
                      },
                      "& .MuiTooltip-arrow": {
                        color: "white",
                      },
                    },
                  }}
                  arrow title="Pre Order">
                    <Link href="/pre_order">
                      <span className="text-4xl text-green-500">
                        <FaOpencart />
                      </span>
                    </Link>
                  </Tooltip>
                  
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                  {PreOrderCartsCount}
                </span>
              </div>
              
              <div className="relative inline-block">
                <span
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                  onClick={() => {
                    router.push("/profile/my-acccount");
                  }}
                  className="text-2xl text-white cursor-pointer"
                >
                  {userProfile?.profile_img ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${userProfile?.profile_img}`}
                      alt="profile_pic"
                      className="w-10 object-contain h-10 rounded-full border-2 border-green-500"
                    />
                  ) : (
                    <FaUser />
                  )}
                </span>
                {/* <Popover
                    id="mouse-over-popover"
                    sx={{ pointerEvents: "none" }}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    onClose={handlePopoverClose}
                  >
                  
                   <div className="p-4 flex flex-col justify-between">

                   {
                    popoverContent.map((item) => (
                        <Link className={`hover:text-green-500`} href={`${item.link}`}>{item.name}</Link>
                    ))
                   }
                   </div>
                  </Popover> */}
              </div>
              {/* Mobile nav */}
              <div
                className="md:hidden flex items-center justify-between gap-4"
                onClick={handleSidebarNav}
              >
                <span className="text-4xl font-bold text-white">
                  <CiMenuBurger />
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-end gap-5">
              <div className="relative inline-block">
                <Link href="/WishList">
                  <span className={`relative text-2xl text-green-500`}>
                    <FaRegHeart />
                    {/* <FaHeart /> */}
                  </span>
                </Link>
              </div>
              <div className="relative inline-block">
                <Link href="/Cart">
                  <span className="text-4xl text-white">
                    <CiShoppingCart />
                  </span>
                </Link>
              </div>
              <div className="relative inline-block">
                <div className="relative inline-block">
                  <Tooltip 
                  PopperProps={{
                    sx: {
                      "& .MuiTooltip-tooltip": {
                        backgroundColor: "white",
                        color: "green",
                      },
                      "& .MuiTooltip-arrow": {
                        color: "white",
                      },
                    },
                  }}
                  arrow title="Pre Order">
                    <Link href="/Cart">
                      <span className="text-4xl text-white">
                        <FaOpencart />
                      </span>
                    </Link>
                  </Tooltip>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  className="text-white text-sm md:text-2xl hover:text-green-500"
                  href={"/Login"}
                >
                  Login
                </Link>
                <span className="text-white md:text-2xl text-sm">/</span>
                <Link
                  className="text-white text-sm md:text-2xl hover:text-green-500"
                  href={"/SignUp"}
                >
                  Sign-up
                </Link>
              </div>
              {/* Mobile nav */}
              <div
                className="md:hidden flex items-center justify-between gap-4"
                onClick={handleSidebarNav}
              >
                <span className="text-4xl font-bold text-white">
                  <CiMenuBurger />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="md:hidden block p-3">
        <Searchbar />
      </div>
      {
        <SideNavbar
          openSidebar={sideNavOpen}
          onCloseSidebar={handleSidebarNav}
        />
      }
    </nav>
  );
};

export default Navbar;
