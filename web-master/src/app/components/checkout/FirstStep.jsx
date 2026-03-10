import React, { useEffect, useRef, useState } from 'react'
import FormAddress from './FormAddress';
import { Button } from '@mui/material';
import OrderSummary from './OrderSummary';
import SelectAddress from './SelectAddress';
import useUserStore from '@/app/storeContext/userStore';
import { useSnackbar } from '@/app/SnackBarProvider';
import SelectBillingAddress from './SelectBillingAddress';

const FirstStep = ({ cartData ,cartCount,type}) => {
    
    const { openSnackbar } = useSnackbar();
 

    const {
        shippingAddress,
        billingAddress,
        setShippingAddress,
        setBillingAddress,
    } = useUserStore();

    const [useShippingForBilling, setUseShippingForBilling] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedBillingAddressId, setSelectedBillingAddressId] = useState(null);

    const handleAddressChange = (formType, field, value) => {
        if (formType === 'Shipping') {
            setShippingAddress((prev) => ({ ...prev, [field]: value }));
            if (useShippingForBilling) {
                setBillingAddress((prev) => ({ ...prev, [field]: value }));
            }
        } else {
            setBillingAddress((prev) => ({ ...prev, [field]: value }));
        }
    };
    
    const handleCheckboxChange = () => {
        setUseShippingForBilling((prev) => !prev);
        if (!useShippingForBilling) {
            setBillingAddress(shippingAddress);
        }
    };
    console.log(shippingAddress, "shippingAddress");

    return (
        <>
            <div className='w-full lg:flex lg:space-x-[30px] shadow-lg p-4'>
                <div className={cartData ? 'lg:w-1/2 w-full' : "w-full"}>

                    <SelectAddress onSelectAddress={setSelectedAddressId}/>

                    <hr className='my-4' />

                    <FormAddress formType='Shipping' address={shippingAddress} onChange={handleAddressChange} />

                    <div className='flex items-center mb-4'>
                        <input
                            type="checkbox"
                            id="useShippingForBilling"
                            checked={useShippingForBilling}
                            onChange={handleCheckboxChange}
                            className='mr-2 cursor-pointer'
                        />
                        <label htmlFor="useShippingForBilling" className='text-gray-600 text-[13px] cursor-pointer'>Use Shipping Address for Billing</label>
                    </div>

                    <hr className='my-4' />

                    {!useShippingForBilling && <SelectBillingAddress onSelectBillingAddress={(id) => setSelectedBillingAddressId(id)} />}

                    {!useShippingForBilling && <FormAddress formType='Billing' address={billingAddress} onChange={handleAddressChange} />}
                </div>
                <div className={cartData ? `flex-1 sticky top-10 h-full` : ''}>
                    {
                        cartData ?
                        <OrderSummary type={type} cartData={cartData} useShippingForBilling={useShippingForBilling} selectedAddressId={selectedAddressId} selectedBillingAddressId={selectedBillingAddressId} openSnackbar={openSnackbar}/>:null
                    }
                   
                </div>
                
            </div>
        </>
    )
}

export default FirstStep
