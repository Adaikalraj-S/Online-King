import { Pagination, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import axios from '../../../../axios'
import React, { useCallback, useEffect, useState } from 'react'
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'
import { IoSearch } from 'react-icons/io5'
import { MdAdd, MdOutlineFileDownload } from 'react-icons/md'
import { useSnackbar } from '@/app/SnackbarProvider'
import { useRouter } from 'next/navigation'

const TransactionTable = ({ paymentType }) => {
    const router = useRouter()
    const { openSnackbar } = useSnackbar();
    const [transactionData, setTransactionData] = useState([])

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchTransactionData()
        }

        return () => { unmounted = true };
    }, [paymentType])

    const fetchTransactionData = useCallback(
        () => {
            axios.get(`/api/fetch-tansactions-admin?payment_type=${paymentType}`, {
                headers: {
                    Authorization: localStorage.getItem('onlineKingToken')
                }
            })
                .then((res) => {
                    if (res.data.status === 'success') {
                        setTransactionData(res.data.orders)
                    } else if (res.data.message === 'Session expired') {
                        openSnackbar(res.data.message, 'error');
                        router.push('/login')
                    }
                })
                .then(err => {
                    console.log(err)
                })
        },
        [paymentType],
    )


    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const totalRows = transactionData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [searchTransactionId, setSearchTransactionId] = useState('');

    const filteredRows = transactionData.filter((e) =>
        e.order_id.toLowerCase().includes(searchTransactionId.toLowerCase())
    );
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
    const paginatedRows = filteredRows.slice(startIndex, endIndex);


    const convertInRupee = (number) => {
        console.log(number);
        return number.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };


    function formatDateStamp(timestamp) {
        const date = new Date(timestamp);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: true
        };
        return date.toLocaleString('en-GB', options).replace(',', '');
    }

    function formatTimeStamp(timestamp) {
        const date = new Date(timestamp);
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleString('en-GB', options).replace(',', '');
    }

    return (
        <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
            <div className='flex items-center px-3 justify-between'>
                <div className='flex space-x-2 items-center'>
                    <span className='text-[18px] font-[500] text-[#101828]'>{paymentType} Transactions List</span>
                    <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{transactionData.length} Transactions</span>
                </div>
                <div className='flex items-center space-x-3 inputText w-[50%]'>
                    <IoSearch className='text-[20px]' />
                    <input
                        type='text'
                        className='outline-none focus-none !text-[14px] w-full'
                        placeholder='Search Transaction id'
                        value={searchTransactionId}
                        onChange={(e) => setSearchTransactionId(e.target.value)}
                    />
                </div>
            </div>

            {/* Table content here */}
            <Paper >
                <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow className='!bg-[#F9FAFB]'>
                                <TableCell>Sl No</TableCell>
                                <TableCell>Order Id</TableCell>
                                <TableCell>Payment Date</TableCell>
                                <TableCell>Payment Time</TableCell>
                                <TableCell>Total Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        {filteredRows.length > 0 ?
                            <TableBody>
                                {paginatedRows.map((row, i) => (
                                    <TableRow key={i} >
                                        <TableCell>{startIndex + i + 1}</TableCell>
                                        <TableCell>{row.order_id}</TableCell>
                                        <TableCell>{formatDateStamp(row.createdAt)}</TableCell>
                                        <TableCell>{formatTimeStamp(row.createdAt)}</TableCell>
                                        <TableCell>{convertInRupee(row.total_paid_amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            :
                            <TableRow>
                                <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No transactions found</TableCell>
                            </TableRow>
                        }
                    </Table>
                </TableContainer>
            </Paper>

            {filteredRows.length > rowsPerPage && (
                <div className='flex justify-center mt-3'>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handleChangePage}
                        shape="rounded"
                    />
                </div>
            )}
        </div>
    )
}

export default TransactionTable
