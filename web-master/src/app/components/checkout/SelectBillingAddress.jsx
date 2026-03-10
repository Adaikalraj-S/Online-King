"use client"
import useUserStore from '@/app/storeContext/userStore';
import { RadioGroup } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { FaRegEdit, FaTrash } from 'react-icons/fa';

const SelectBillingAddress = ({ onSelectBillingAddress }) => {
    const { fetchUserBillingAddress, userBillingAddress, defaultBillingSelectedAddress } = useUserStore();


    const [selected, setSelected] = useState(null);


    useEffect(() => {
        fetchUserBillingAddress();
    }, [fetchUserBillingAddress]);

    useEffect(() => {
        if (selected == null &&  defaultBillingSelectedAddress?.id) {
            setSelected(defaultBillingSelectedAddress.id);
            onSelectBillingAddress(defaultBillingSelectedAddress.id);
        }
    }, [defaultBillingSelectedAddress, onSelectBillingAddress, selected]);

    const handleAddressChange = (address) => {
        setSelected(address);
        onSelectBillingAddress(address);
    };
    
    // useEffect(() => {
    //     if (selected == null && defaultBillingSelectedAddress?.id) {
    //         setSelected(defaultBillingSelectedAddress.id);
    //         onSelectBillingAddress(defaultBillingSelectedAddress.id);
    //     }
    // }, [defaultBillingSelectedAddress, onSelectBillingAddress, selected]);

    return (
        <>
            {userBillingAddress && userBillingAddress.length > 0 ?
                <div className="space-y-8">
                    <div className="w-full rounded-2xl space-y-2.5 ">
                        <RadioGroup
                            className="space-y-5 pb-[20px]"
                            value={selected}
                            onChange={(id) => handleAddressChange(id)}
                        >
                            <RadioGroup.Label className="space-y-10 font-[600]">
                                Select Billing Address
                            </RadioGroup.Label>
                            <div className="space-y-2 space-y-scroll p-[10px]  h-[300px] overflow-y-scroll">
                                {userBillingAddress &&
                                    userBillingAddress.map((e, i) => (
                                        <RadioGroup.Option
                                            key={i}
                                            value={e.id}
                                            className={({ active, checked }) =>
                                                `${active ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-[#45b348]" : ""}
                                            ${checked ? "bg-[#45b348] bg-opacity-75 text-black" : "bg-white"} relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                                            }
                                        >
                                            {({ active, checked }) => (
                                                <>
                                                    <div className="flex w-full items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className="text-sm">
                                                                <RadioGroup.Description
                                                                    as="span"
                                                                    className={`inline ${checked
                                                                        ? "text-slate-600 font-[600]"
                                                                        : "text-gray-500"
                                                                        }`}
                                                                >
                                                                    <span>{e.fullname}</span> <br />
                                                                    <span>{e.mobile}</span>
                                                                    <br />
                                                                    <span>{e.add1}</span> ,{" "}
                                                                    <span>{e.add2}</span> <br />
                                                                    <span>{e.area}</span> ,{" "}
                                                                    <span>{e.landmark}</span> ,{" "}
                                                                    <span>{e.city}</span> <br />
                                                                    <span>{e.state}</span> ,{" "}
                                                                    <span>{e.zipcode}</span>, <br/>
                                                                    <span>{e?.gst_no ? `Gst No:- ${e?.gst_no}` : null}</span>

                                                                </RadioGroup.Description>
                                                            </div>
                                                        </div>
                                                        {checked && (
                                                            <div className="shrink-0 text-white flex items-center gap-[10px]">
                                                                <FaRegEdit className="z-9 text-[15px] opacity-70 hover:opacity-90" />
                                                                <FaTrash
                                                                    onClick={() =>
                                                                        handleAddressDelete(e.id)
                                                                    }
                                                                    className="z-9 text-[15px] opacity-70 hover:opacity-90"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </RadioGroup.Option>
                                    ))}
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                :
                <div className='w-full text-center py-10'>
                    <p>No billing address found</p>
                </div>
            }
        </>
    )
}

export default SelectBillingAddress
