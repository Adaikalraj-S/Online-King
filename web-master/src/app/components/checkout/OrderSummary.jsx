"use client"
import useProductStore from '@/app/storeContext/store';

import React, { useEffect, useState } from 'react'
import CartDetails from './CartDetails';
import { SiRazorpay } from 'react-icons/si';
import Phonepe from '../../Asset/PhonepeNew.svg';
import Image from 'next/image';
import TotalPriceWithCoupon from './TotalPriceWithCoupon';
import SubTotalDetails from './SubTotalDetails';
import useCouponStore from '@/app/storeContext/couponStore';
import usePaymentStore from '@/app/storeContext/paymentStore';
import { useRouter } from 'next/navigation';
import useUserStore from '@/app/storeContext/userStore';



const OrderSummary = ({cartData, useShippingForBilling, selectedAddressId, selectedBillingAddressId, openSnackbar, type }) => {
    const router = useRouter()
    const { fetchUserAddress, userAddress } = useUserStore();
    const { totalPrice,totalMRP,PreOrderTotalMrp, PreOrderTotalPrice  } = useProductStore()
    const { coupons, fetchCoupons, checkCouponApplicability, message, discountedPrice } = useCouponStore()
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const {initiateRazorpayPayment,createRazorPayOrder, initiatePhonePePayment , placeOrder,razorPayData, phonePayData} = usePaymentStore()
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Razorpay');
    const [address, setAddress] = useState(null)
    useEffect(() => {
        fetchUserAddress()
        setAddress(userAddress.find(e => e.id))
    }, [selectedAddressId])
    const validateStep = async () => {
        if (!selectedAddressId) {
            openSnackbar('Please select a shipping address.', 'error');
            return false;
        }
        if (!selectedBillingAddressId && !useShippingForBilling) {
            openSnackbar('Please select a billing address.', 'error');
            return false;
        }
        
        else {
            if(selectedPaymentMethod === 'Razorpay'){
                console.log(totalPrice, "total-price")
                const razorOrderId = await createRazorPayOrder(appliedCoupon ? discountedPrice : type ? PreOrderTotalPrice : totalPrice)
                

                    const result =  await initiateRazorpayPayment(appliedCoupon ? discountedPrice : type ? PreOrderTotalPrice : totalPrice, razorOrderId.id)
                    console.log(result, "result-razor")
             
                if (!razorOrderId) {
                    return false;
                }else{
                    console.log(razorPayData, "razor-pay-data")
                    placeOrder(cartData , appliedCoupon ? discountedPrice : type ? PreOrderTotalPrice : totalPrice , appliedCoupon ? appliedCoupon.id : null , selectedAddressId ,useShippingForBilling, selectedBillingAddressId , selectedPaymentMethod , result.razorpay_payment_id, result.razorpay_order_id, result.razorpay_signature, openSnackbar , router,type ? PreOrderTotalMrp : totalMRP, type ? "pre_order" : null) 
                }
            }else if(selectedPaymentMethod === 'PhonePe'){

                //openSnackbar('PhonePe payment is under development', 'error');
                const data = await placeOrder(
                    cartData , 
                    appliedCoupon ? discountedPrice : totalPrice , 
                    appliedCoupon ? appliedCoupon.id : null , 
                    selectedAddressId ,
                    useShippingForBilling, 
                    selectedBillingAddressId , 
                    selectedPaymentMethod , 
                    null ,
                    null,
                    openSnackbar , 
                    router,
                    type ? Number(PreOrderTotalMrp) : Number(totalMRP), 
                    type ? "pre_order" : null
                ) 
                if (data.status == 'success') {
                    console.log('OrderSummary.jsx @ Line 58:', data);
    
                    //Uncomment for the phone pay function and go to the usePaymentStore to check the function
                    await initiatePhonePePayment(appliedCoupon ? discountedPrice : type ? PreOrderTotalPrice : totalPrice, address.fullname, address.mobile, `${new Date().getTime()}-${data.order.id}`)
                    // console.log(result, "resut");
                    // if (!result) {
                    //     return false;
                    // } else {
                    //     window.location.href = result.instrumentResponse.redirectInfo.url
                    //     // placeOrder(cartData , appliedCoupon ? discountedPrice : totalPrice , appliedCoupon ? appliedCoupon.id : null , selectedAddressId ,useShippingForBilling, selectedBillingAddressId , selectedPaymentMethod , result.razorpay_payment_id , openSnackbar , router,totalMRP) 
                    // }
                } else {
                    openSnackbar('Something went wrong.', 'error');
                }
            }
            return true;
        }
    };

    const convertInRupee = (number) => {
        return number?.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const finalPrice = (defaultPrice, discount, discountType) => {
        if (discountType === "percent") {
            return convertInRupee(defaultPrice - (defaultPrice * (discount / 100)));
        }
        else if (discountType === 'amount') {
            return convertInRupee(defaultPrice - discount);
        } else {
            throw new Error('Invalid discount type');
        }
    }


    

    const handlePaymentChange = (e) => {
        setSelectedPaymentMethod(e.target.value);
    };

    return (
        <>
            <h1 className='sm:text-2xl text-xl text-black font-medium mb-5'>Order Estimate</h1>

            <div className='py-4'>
                <CartDetails cartData={cartData} finalPrice={finalPrice} convertInRupee={convertInRupee}/>
            </div>

            <div className='py-4'>
                <TotalPriceWithCoupon
                    totalPrice={type ? PreOrderTotalPrice : totalPrice}
                    coupons={coupons}
                    fetchCoupons={fetchCoupons}
                    checkCouponApplicability={checkCouponApplicability}
                    message={message}
                    discountedPrice={discountedPrice}
                    appliedCoupon={appliedCoupon}
                    setAppliedCoupon={setAppliedCoupon}
                    convertInRupee={convertInRupee}
                />
            </div>

            <div className='lg:w-1/2 w-full flex flex-col justify-between'>
                {/* <div>{JSON.stringify(address)}</div> */}
                <div>
                    <h1 className='sm:text-2xl text-xl text-black font-medium mb-5'>Choose Payment</h1>
                    <div className='flex flex-col mb-6'>
                        <label className='flex items-center mb-4'>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Razorpay"
                                checked={selectedPaymentMethod === 'Razorpay'}
                                onChange={handlePaymentChange}
                                className='mr-3'
                            />
                            <SiRazorpay className='w-8 h-6 mr-2 text-[#6822CC]' />
                            <span>Razorpay</span>
                        </label>
                        <label className='flex items-center mb-4'>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="PhonePe"
                                checked={selectedPaymentMethod === 'PhonePe'}
                                onChange={handlePaymentChange}
                                className='mr-3'
                            />
                            <Image src={Phonepe} alt="PhonePe" className='w-8 h-8 mr-2' />
                            <span>PhonePe</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className='py-4'>
                <SubTotalDetails cartData={cartData} totalPrice={type ? PreOrderTotalPrice : totalPrice} discountedPrice={discountedPrice} appliedCoupon={appliedCoupon} convertInRupee={convertInRupee} />
            </div>

            

            <button onClick={validateStep} className='py-[10px] w-full bg-[#45b348] text-white font-bold hover:shadow-lg transition duration-300'>
                Place Order
            </button>
        </>
    )
}

export default OrderSummary
