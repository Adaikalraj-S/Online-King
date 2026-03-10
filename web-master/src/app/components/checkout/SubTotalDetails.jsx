"use client"
import React, { useEffect } from 'react'

const SubTotalDetails = ({ cartData, totalPrice, discountedPrice, appliedCoupon, convertInRupee }) => {

    return (
        <div className="flex flex-col justify-between py-4 space-y-4">
            <div className="flex justify-between ">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                    {convertInRupee(totalPrice)}
                </span>
            </div>
            {appliedCoupon &&
                <div className="flex justify-between ">
                    <span className='text-red-600 text-[15px] font-bold'>Coupon</span>
                    <span className="font-bold text-red-600">
                        {appliedCoupon.coupon_name}
                    </span>
                </div>
            }
            <div className="flex justify-between ">
                <span className='text-red-600 text-[15px] font-bold'>Discount</span>
                <span className="font-bold text-red-600">
                    - {appliedCoupon ? convertInRupee(totalPrice - discountedPrice) : convertInRupee(0)}
                </span>
            </div>
            <div className="flex justify-between ">
                <span className='text-slate-900 text-lg font-bold'>Total Amount</span>
                <span className="font-[700] text-slate-900">
                    {convertInRupee(appliedCoupon ? discountedPrice : totalPrice)}
                </span>
            </div>
        </div>
    )
}

export default SubTotalDetails
