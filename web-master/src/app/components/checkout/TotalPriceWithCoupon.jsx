"use client"
import React, { useState } from 'react'
import { FaAngleRight } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { styled } from "@mui/material/styles";
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { useSnackbar } from '@/app/SnackBarProvider';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const TotalPriceWithCoupon = ({ totalPrice, coupons, fetchCoupons, checkCouponApplicability, message, discountedPrice, appliedCoupon, setAppliedCoupon, convertInRupee }) => {
    const { openSnackbar } = useSnackbar();
    const [openCoupon, setOpenCoupon] = useState(false);

    const handleClickOpenCoupon = () => {
        fetchCoupons()
        setOpenCoupon(true);
    };
    const handleCloseCoupon = () => {
        setOpenCoupon(false);
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
    };

    const handleApplyCoupon = (coupon) => {
        checkCouponApplicability(coupon.id, totalPrice, openSnackbar);
        setAppliedCoupon(coupon);
        setOpenCoupon(false);
    };

    function formatDate(apiTimestamp) {
        const date = new Date(apiTimestamp);
        const options = { day: "numeric", month: "short", year: "numeric" };
        return date.toLocaleDateString("en-US", options);
    }
    return (
        <>
            <div onClick={handleClickOpenCoupon} className={`group ${appliedCoupon ? 'pointer-events-none' : 'cursor-pointer'}`}>
                <div
                    id="couponButton"
                    className="flex items-center justify-between cursor-pointer group-hover:shadow-md px-[10px] py-[13px]"
                >
                    <div className="flex items-center space-x-3">
                        <MdOutlineLocalOffer />
                        <div className="flex flex-col">
                            <span className="text-[15px] text-slate-600">
                                Add a coupon code
                            </span>
                            <span className="text-[13px] text-green-700">
                                Avail offers and discounts on your order
                            </span>
                        </div>
                    </div>
                    <FaAngleRight />
                </div>
            </div>

            {appliedCoupon && (
                <div className="mt-5">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <span className="flex items-center justify-between px-[20px] py-[10px] bg-[#46b348] rounded-[15px] text-[#fff]">
                            {appliedCoupon.coupon_name} Applied
                            <span onClick={handleRemoveCoupon}>
                                <IoMdClose className="text-[16px] font-bold cursor-pointer" />
                            </span>
                        </span>
                    </div>
                </div>
            )}


            <BootstrapDialog
                onClose={handleCloseCoupon}
                fullWidth
                aria-labelledby="customized-dialog-title"
                open={openCoupon}
            >
                <DialogTitle
                    sx={{ m: 0, p: 2 }}
                    id="customized-dialog-title"
                    className="!font-inherit"
                >
                    Apply Coupon
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseCoupon}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <IoCloseCircleOutline />
                </IconButton>
                <DialogContent dividers className="!py-[10px] !px-[28px]">
                    <div className="py-[24px] space-y-4">
                        {coupons && coupons.filter(e => e.min_order_amount <= totalPrice).length == 0 && (
                            <p className="text-center">No coupon available</p>
                        )}
                        {coupons &&
                            coupons.filter(e => e.min_order_amount <= totalPrice).map((e, i) => (
                                <div className="coupon-card" key={i}>
                                    <h3 className="font-[500] capitalize">
                                        {e.coupon_title}
                                    </h3>
                                    <di className="coupon-row">
                                        <span id="cpnCode" className="font-[600] uppercase">
                                            {e.coupon_name}
                                        </span>
                                        <span
                                            id="cpnBtn"
                                            className="font-[500]"
                                            onClick={() => handleApplyCoupon(e)}
                                        >
                                            Apply
                                        </span>
                                    </di>
                                    <p className="font-[400]">
                                        Valid Till:{" "}
                                        <span className="font-[500]">
                                            {formatDate(e.expiry_date)}
                                        </span>
                                    </p>
                                    <div className="circle1"></div>
                                    <div className="circle2"></div>
                                </div>
                            ))}
                    </div>
                </DialogContent>
            </BootstrapDialog>
        </>
    )
}

export default TotalPriceWithCoupon
