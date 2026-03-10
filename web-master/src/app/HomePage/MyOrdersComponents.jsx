import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, Grid, DialogContent, DialogContentText, DialogActions, Button, Stepper, Step, StepLabel } from '@mui/material';
import { IoMdClose } from "react-icons/io";
import { FiDownload } from "react-icons/fi";
import axios from "../../../axios";
import Link from 'next/link';
import { useSnackbar } from '../SnackBarProvider';
import OrderCancelDialog from '../components/PopUpDialog/OrderCancelDialog';


const MyOrdersComponents = ({ orders, fetchOrders }) => {
    const {openSnackbar} = useSnackbar();


    function formatDate(apiTimestamp) {
        const date = new Date(apiTimestamp);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }


    const [activeTab, setActiveTab] = useState('pending');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false)
    const [cancelOrderDialog, setOrderCancelDialog] = useState(false)
    const [cancelOrderId, setCancelOrderId] = useState(null)
    console.log("selectedOrder",selectedOrder);
    const setOrerCalcelDilogMain = () => {
        setOrderCancelDialog(false)
        setSelectedOrder(null)
        fetchOrders()
        setActiveTab('cancelled')
    }

    const filterOrdersByStatus = (status) => {
        return orders.filter(order => order?.order_status?.status_name?.toLowerCase() === status.toLowerCase());
    };

    let filteredOrders;
    switch (activeTab) {
        case 'confirmed':
            filteredOrders = orders.filter(order => ['confirmed','packaging', 'out for delivery', "order ready for pickup", "Cancelled By Customer"].includes(order?.order_status?.status_name.toLowerCase()));
            break;
        case "cancelled":
            filteredOrders = orders.filter((order) =>
                ['cancellation approved by kardify', 'Cancelled By Customer', 'Cancelled By Onlineking'].includes(order?.order_status?.status_name)
            );
            console.log(filteredOrders, "filtered-orders");
            break;
            
        default:
            filteredOrders = filterOrdersByStatus(activeTab);
            break;
    }

    const handleViewOrder = (order) => {
        console.log(order, 'order---')
        setSelectedOrder(order);
        //downloadInvoice(order.id)
    };

    const handleCloseDialog = () => {
        setSelectedOrder(null);
    };

    const downloadInvoice = (orderId) => {
        let token = localStorage.getItem('onlineKingWebToken')
        let url = `api/download-invoice`

        axios.post(url,
            {
                order_id: orderId
            }, 
            {
            headers: {
                Authorization: token
            },
            responseType: 'blob' // Important for handling binary data
        })
        .then((res) => {
            // if (res.status === 200) {
            //     console.log(res.data, 'INVOICE');
            // } else {
            //     console.error('Unexpected response status:', res.status);
            // }
             // create file link in browser's memory
             
    const href = URL.createObjectURL(res.data);

    // create "a" HTML element with href to file & click
    const link = document.createElement('a');
    link.href = href;
    link.download = `Invoice-${orderId}.pdf`; // Suggested filename for the download
    //link.setAttribute('download', 'file.pdf'); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
        })
        .catch((err) => {
            if (err.response) {
                // Server responded with a status other than 2xx
                console.error('Error response from server:', err.response.data);
            } else if (err.request) {
                // Request was made but no response was received
                console.error('No response received:', err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', err.message);
            }
        });
    }

    const handleCancelOrder = (orderID) => {



        console.log(orderID, "orderId")
        setOrderCancelDialog(true)
        setCancelOrderId(orderID)
        // setLoading(true)
        // axios.post('/api/order-status-update', {
        //     order_id: orderID,
        //     order_status_id: 9
        // })
        //     .then(res => {
        //         console.log(res)
               
        //         openSnackbar(res.data.message, 'success');
        //         setLoading(false)
        //         setSelectedOrder(null);
        //         fetchOrders()
               
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })
    }

    console.log(activeTab,"activetab")

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">My Orders</h2>
            <div className="flex justify-evenly items-center">
                <button className={`mr-4 ${activeTab === 'pending' ? 'text-blue-500 font-bold' : ''}`} onClick={() => setActiveTab('pending')}>Pending</button>
                <button className={`mr-4 ${activeTab === 'confirmed' ? 'text-blue-500 font-bold' : ''}`} onClick={() => setActiveTab('confirmed')}>Order Status</button>
                <button className={`mr-4 ${activeTab === 'Delivered' ? 'text-blue-500 font-bold' : ''}`} onClick={() => setActiveTab('Delivered')}>Completed</button>
                <button className={`mr-4 ${activeTab === 'cancelled' ? 'text-blue-500 font-bold' : ''}`} onClick={() => setActiveTab('cancelled')}>Cancelled</button>
                <button className={`${activeTab === 'returned' ? 'text-blue-500 font-bold' : ''}`} onClick={() => setActiveTab('returned')}>Returned</button>
            </div>
            <div className="mt-4">
                {filteredOrders.length > 0 && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Order Date</TableCell>
                                    <TableCell>Total Paid Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>View</TableCell>
                                    <TableCell>Download Invoice</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredOrders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.order_id}</TableCell>
                                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                                        <TableCell>₹{order.total_paid_amount}</TableCell>
                                        <TableCell>
                                        {
                                            order.order_status.status_name === "Cancelled By Customer" 
                                            ? "Cancelled By Me" 
                                            : order.order_status.status_name === "Cancel By Kardify" 
                                            ? "Cancelled by Kardify" 
                                            : order.order_status.status_name
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <span className='cursor-pointer hover:text-blue-500 font-[600]' onClick={() => handleViewOrder(order)}>View</span>
                                        </TableCell>
                                        <TableCell>
                                            {/* <span onClick={() => downloadInvoice(order.id)} className='lg:text-2xl flex items-center justify-center text-center cursor-pointer hover:text-blue-500  sm:text-xl '>
                                                <FiDownload/>
                                            </span> */}
                                            <Link href={`/invoices/${order.id}`} target='_blank' className='lg:text-2xl flex items-center justify-center text-center cursor-pointer hover:text-blue-500 sm:text-xl'>
                                            <FiDownload/>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                {filteredOrders.length === 0 && (
                    <div className="flex items-center justify-center h-48">
                        <p>No orders found for {activeTab} status.</p>
                    </div>
                )}
            </div>


            <Dialog open={selectedOrder !== null} onClose={handleCloseDialog} fullScreen>
                <DialogTitle className='flex justify-between items-center'>
                    Order Details/{selectedOrder?.order_id}
                    <IoMdClose className='cursor-pointer' onClick={handleCloseDialog} />
                </DialogTitle>
                <DialogContent dividers >
                    <DialogContentText className='container mx-auto'>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product Image</TableCell>
                                                <TableCell>Product Name</TableCell>
                                                <TableCell>MRP</TableCell>
                                                <TableCell>Discount</TableCell>
                                                <TableCell>Unit Price</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                {/* <TableCell>Reason</TableCell> */}
                                                {/* {activeTab === 'cancelled' && (
                                                    <TableCell>Reason</TableCell>
                                                )} */}

                                                
                                                <TableCell>Total Price</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedOrder && selectedOrder.order_details.map(product => (
                                                <>
                                                {/* <div>{JSON.stringify(product)}</div> */}
                                                <TableRow key={product.id}>
                                                    <TableCell>
                                                        <div className='flex items-center'>
                                                            <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${product?.product?.images?.[0]?.image_url}`} alt={product.product.product_name} style={{ width: '100px', height: '100px', marginRight: '10px' }} />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {product?.product_description}
                                                    </TableCell>
                                                    <TableCell>₹ {product?.unit_price ? (Number(product.unit_price) * Number(product.quantity ? product.quantity : 1)) : 0}</TableCell>
                                                    <TableCell>
                                                        {/* {product.product.discount_type === "amount" ? (
                                                            <>
                                                                ₹{(product.product.default_price - product.product.discount).toFixed(2)}
                                                                <span className="text-[#bbb8b8] font-[500] text-[13px] line-through">
                                                                    ₹{product.product.default_price}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                ₹{(product.product.default_price * (1 - product.product.discount / 100)).toFixed(2)}
                                                                <span className="text-[#bbb8b8] font-[500] text-[13px] line-through">
                                                                    ₹{product.product.default_price}
                                                                </span>
                                                            </>
                                                        )} */}
                                                        ₹ {product.discount ? product.discount : 0}
                                                    </TableCell>
                                                    <TableCell>
                                                        {/* ₹{(product.quantity * product.product.default_price).toFixed(2)} */}
                                                        ₹{product.unit_price ? product.unit_price : 0}
                                                    </TableCell>
                                                    <TableCell>
                                                        {product.quantity ? product.quantity : 0}
                                                    </TableCell>
                                                    {/* <TableCell>
                                                        {product.rejected_reason}
                                                    </TableCell> */}
                                                    <TableCell>
                                                        {/* ₹{(product.quantity * product.product.default_price).toFixed(2)} */}
                                                        ₹{product.total_amount ? product.total_amount : 0}
                                                    </TableCell>
                                                </TableRow>
                                                </>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </Grid>
                            <Grid item xs={12}>
                                {/* <span>Total Paid Amount{selectedOrder?.total_paid_amount}</span> */}
                                <TableContainer component={Paper}
                                >
                                    <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Total Product Amount</TableCell>
                                            <TableCell>Total Shipping Amount</TableCell>
                                            <TableCell>Total Discount  Amount</TableCell>
                                            {
                                                selectedOrder?.payment_via === "Razorpay" || selectedOrder?.payment_via === "PhonePe"?
                                                <TableCell>Total Paid Amount</TableCell>:
                                                <TableCell>Total COD</TableCell>
                                            }
                                           

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                       <TableRow>
                                        <TableCell>
                                            {selectedOrder?.total_product_amount}
                                        </TableCell>
                                        <TableCell>
                                            {
                                               
                                                selectedOrder?.total_shipping_amount
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {selectedOrder?.total_discount_amount && (selectedOrder?.total_discount_amount).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {selectedOrder?.total_paid_amount}
                                        </TableCell>
                                       </TableRow>
                                        </TableBody>  
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12}>

                            {
                                selectedOrder && selectedOrder.order_status_id <= 3 ? (
                                    <div className="flex justify-end py-[20px]">
                                    <button disabled={loading}  onClick={() => handleCancelOrder(selectedOrder?.id)} className="cursor-pointer bg-red-500 text-white px-[15px] py-[8px] rounded hover:bg-red-600 hover:text-white transition duration-300 ease-in">
                                        {
                                            loading ?
                                           " Please wait.."
                                           :  "Cancel Order"
                                        }
                                       
                                    </button>
                                    </div>
                                )  : null
                                }

                               
                                    
                                
                                    {filteredOrders.map((product, index)=>{
                                        <div key={product.id}>
                                        <h2>{product.rejected_reason}</h2>
                                        </div>
                                    })
                                }
                            
                                    
                                <div className='flex flex-col py-[20px] space-y-3'>
                                    {
                                        selectedOrder?.order_status.status_name?.toLowerCase() === "cancel by kardify"?
                                        <div className='w-full border border-slate-200 rounded p-4'>
                                            <h4 className='text-xl text-red-400'>Cancellation Reason</h4>
                                            <p className='text-slate-400 text-xl'>{selectedOrder?.rejected_reason}</p>
                                        </div>
                                        :null
                                    }
                                <h3>Order Status Logs:</h3>
                                        <Stepper activeStep={selectedOrder ? selectedOrder.order_status_logs.length - 1 : 0} alternativeLabel>
                                        {/* {selectedOrder && selectedOrder.order_status_logs.map((log, index) => (
                                            <Step key={index}>
                                                
                                                <StepLabel>{log.order_status.status_name === "Cancelled By Customer" ? 
                                                "Cancelled by Me" :
                                                log.order_status.status_name === "Cancelled By Customer" ?
                                                 : log.order_status.status_name}</StepLabel>
                                            </Step>
                                        ))} */}
                                        {selectedOrder && selectedOrder.order_status_logs.sort((a, b) => a.id - b.id).map((log, index) => (
                                            <Step key={index}>
                                                <StepLabel>
                                                    {log.order_status.status_name === "Cancelled By Customer" ? 
                                                    "Cancelled by Me" : 
                                                    log.order_status.status_name === "Cancel By Kardify" ? 
                                                    "Cancelled by Kardify" : 
                                                    log.order_status.status_name}
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </div>
                                <OrderCancelDialog 
                                status={cancelOrderDialog} 
                                onConfirm={setOrerCalcelDilogMain} 
                                orderId={cancelOrderId}
                                />
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MyOrdersComponents
