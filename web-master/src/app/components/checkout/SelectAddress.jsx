"use client"
import useUserStore from '@/app/storeContext/userStore';
import { RadioGroup } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { FaRegEdit, FaTrash } from 'react-icons/fa'
import { useSnackbar } from '@/app/SnackBarProvider';


const SelectAddress = ({onSelectAddress}) => {
    const { fetchUserAddress, userAddress , defaultSelectedAddress,handleAddressDelete, handleAddressEdit, setShippingAddress, setisFormeditable } = useUserStore();
    const { openSnackbar } = useSnackbar();


    const [selected, setSelected] = useState(null);

    useEffect(() => {
        
        fetchUserAddress();
    }, []);

    const handleAddressChange = (address) => {
        setSelected(address);
        onSelectAddress(address);
    };
    
    useEffect(() => {
        
        if (selected == null && defaultSelectedAddress?.id) {
            setSelected(defaultSelectedAddress.id);
            onSelectAddress(defaultSelectedAddress.id);
        }
    }, [defaultSelectedAddress]);


    const handleDelete = async (id) => {
        const res = await handleAddressDelete({address_id:id}, openSnackbar)
        console.log(res, "data-adres")

    };

    const handleEdit = (id) => {
        console.log(id, "id")
        const addressToEdit = userAddress.find(address => address.id === id);  // Find the address by ID
        if (addressToEdit) {
          console.log(addressToEdit, "addressToEdit")
         const  shippingAddress = {
            address_id: addressToEdit.id,
            fullname:addressToEdit.fullname ,
            mobile: addressToEdit.mobile,
            email: addressToEdit.email,
            add_type: addressToEdit.add_type,
            add1: addressToEdit.add1,
            add2: addressToEdit.add2,
            gst_no: addressToEdit.gst_no,
            landmark: addressToEdit.landmark,
            city: addressToEdit.city,
            state: addressToEdit.state,
            pincode: addressToEdit.zipcode,
            country: addressToEdit.country,
          }
           setShippingAddress(shippingAddress);
          setisFormeditable(true);
          // Pass the address to be edited to the `handleAddressEdit` function, which could open a modal or a form
        //   handleAddressEdit(addressToEdit, openSnackbar);  
        }
      };

    return (
        <>
            {userAddress && userAddress.length > 0 ?
                <div className="space-y-8">
                    <div className="w-full rounded-2xl space-y-2.5 ">
                        <RadioGroup
                            className="space-y-5 pb-[20px]"
                            value={selected}
                            onChange={(id) => handleAddressChange(id)}
                        >
                            <RadioGroup.Label className="space-y-10 font-[600]">
                                Select Shipping Address
                            </RadioGroup.Label>
                            <div className="space-y-2 space-y-scroll p-[10px]  h-[300px] overflow-y-scroll">
                                {userAddress &&
                                    userAddress.map((e, i) => (
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
                                                                <RadioGroup.Label
                                                                    as="p"
                                                                    className={`font-medium  ${checked
                                                                        ? "text-white"
                                                                        : "text-gray-900"
                                                                        }`}
                                                                >
                                                                    <span className="uppercase font-bold">
                                                                        {e.add_type}
                                                                    </span>
                                                                    <br />
                                                                </RadioGroup.Label>
                                                                <RadioGroup.Description
                                                                    as="span"
                                                                    className={`inline ${checked
                                                                        ? "text-white font-[600]"
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
                                                                {/* <FaRegEdit className="z-9 text-[15px] opacity-70 hover:opacity-90" /> */}
                                                                <FaTrash
                                                                    onClick={() => handleDelete(e.id)}
                                                                    className={`z-9 text-[15px] opacity-70 hover:text-red-500`}
                                                                />
                                                                 <FaRegEdit
                                                                    onClick={() =>handleEdit(e.id)}
                                                                    className={`z-9 text-[15px] opacity-70 hover:text-red-500`}
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
                    <p>No shipping address found</p>
                </div>
            }
        </>
    )
}

export default SelectAddress
