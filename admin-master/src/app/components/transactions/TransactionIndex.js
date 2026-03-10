import React, { useState } from 'react'
import TransactionTable from './TransactionTable'

const TransactionIndex = () => {
    const [paymentType, setPaymentType] = useState('PhonePe');
    const handleOrderStatusChange = newOrderStatus => {
        setPaymentType(newOrderStatus);
    };
    return (
        <>
            <div className=' py-[10px] flex flex-col space-y-5'>
                <div className='flex flex-col space-y-1'>
                    <span className='text-[30px] text-[#101828] font-[500]'>Transaction List</span>
                    <span className='text-[#667085] font-[400] text-[16px]'>Simplify product management and presentation with Product Setup, ensuring a streamlined and visually compelling e-commerce storefront.</span>
                </div>
            </div>


            <div className='grid grid-cols-2 gap-4 text-center'>
                {['PhonePe', 'Razorpay'].map(status => {
                    return (
                        <div
                            key={status}
                            className={`px-[24px] py-[12px] rounded-[8px] ${paymentType === status ? 'bg-[#CFAA4C]' : 'bg-[#F9FAFB]'}  text-[${paymentType === status ? '#fff' : 'black'}] text-[14px] cursor-pointer`}
                            onClick={() => handleOrderStatusChange(status)}
                        >
                            <div className='flex justify-between items-center'>
                                <span>{status}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <TransactionTable paymentType={paymentType}/>
        </>
    )
}

export default TransactionIndex
