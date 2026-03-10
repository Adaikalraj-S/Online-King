
"use client"
import { Button } from '@mui/material'
import React from 'react'
import OrderSummary from './OrderSummary'

const ThirdStep = ({ activeStep, handleBack, handleNext }) => {
    return (
        <div className='w-full lg:flex lg:space-x-[30px] shadow-lg p-4'>
            <div className='lg:w-1/2 w-full flex flex-col justify-between'>
                {/* <div>
                    <h1 className='sm:text-2xl text-xl text-black font-medium mb-5'>Choose Payment</h1>
                    <div className='flex flex-col mb-6'>
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
                    </div>
                </div> */}
                <div className='text-right mt-5 flex justify-end gap-3'>
                    {activeStep !== 0 && (
                        <Button className='bg-[#487ced] px-[30px] py-[8px] hover:bg-[#487ced]/80 text-white rounded-md transition duration-300' onClick={handleBack}>Back</Button>
                    )}
                    <Button className='bg-[#487ced] px-[30px] py-[8px] hover:bg-[#487ced]/80 text-white rounded-md transition duration-300' variant="contained" onClick={handleNext}>
                        {activeStep === 2 ? 'Finish' : 'Next'}
                    </Button>
                </div>
            </div>
            <div className='flex-1'>
                <OrderSummary />
            </div>
        </div>
    )
}

export default ThirdStep
