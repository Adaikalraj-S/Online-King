"use client"
import useProductStore from '@/app/storeContext/store'
import { useSnackbar } from "@/app/SnackBarProvider";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextareaAutosize, TextField } from '@mui/material'

import React, { useState } from 'react'

const OrderCancelDialog = ({status, onConfirm, orderId}) => {
    const {updateOrderStatus, fetchUserOrder} = useProductStore();
    const { openSnackbar } = useSnackbar();

    const [cancellationReason, setCancellationReason] = useState("");
    const [error, setError] = useState(false)

    const handleSubmit = async () => {
        if(!cancellationReason) {
            setError(true)
            return
        }
        const res = await updateOrderStatus({order_id:orderId, cancellation_reason: cancellationReason, order_status_id:9})
        console.log(res);
        if(res.status === "success") {
            openSnackbar(res.message, "success");
            fetchUserOrder({}, openSnackbar)
            onConfirm(false)
        } else {
            openSnackbar(res.message, "error");
            onConfirm(false)
        }
    }

    const handleChange = (e) => {
        setCancellationReason(e.target.value)
        setError(false)

    }

  return (
    <Dialog
    open={status}
    onClose={() => onConfirm(false)}
    aria-labelledby="cancel-order-dialog-title"
    aria-describedby="cancel-order-dialog-description"
  >
    <DialogTitle className='bg-green-600 font-bold text-white p-4' id="cancel-order-dialog-title">Cancel Order</DialogTitle>
    <DialogContent>
      <DialogContentText className='text-black mt-2' id="cancel-order-dialog-description">
        Are you sure you want to cancel this order?

      </DialogContentText>
      <DialogContentText id="cancel-order-dialog-description">
       <input 
       className='border border-[#AFAFAF] p-2 mt-2 rounded w-full focus:border-green-500 focus:outline-none transition-all duration-200'
       value={cancellationReason} 
       onChange={handleChange}
       name="cancellation_reason"
       placeholder='Cancellation Reason'
       />
       {error && <span className='text-red-500 text-sm'>Cancellation Reason is Required!</span>}

      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <button className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded' onClick={() => onConfirm(false)} >
        No
      </button>
      <button
        onClick={handleSubmit}
       className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'

      >
        Yes
      </button>
    </DialogActions>
  </Dialog>
  )
}

export default OrderCancelDialog