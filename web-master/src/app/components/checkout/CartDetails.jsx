"use client"
import React from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const CartDetails = ({ cartData, finalPrice, convertInRupee }) => {
    return (
        <div>
            <TableContainer component={Paper} >
                <Table aria-label="product table">
                    <TableHead >
                        <TableRow>
                            <TableCell >Product</TableCell>
                            <TableCell >Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cartData.map((product) => (
                            <TableRow key={product.id} >
                                <TableCell className='!text-slate-500'>{product.product.product_name}</TableCell>
                                <TableCell className='!text-slate-500'>{convertInRupee(product.unitPrice)}</TableCell>
                                <TableCell align="center" className='!text-slate-500'>{product.quantity}</TableCell>
                                <TableCell align="right" className='!text-slate-500'>{convertInRupee(product.itemTotal)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default CartDetails
