import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Rating } from '@mui/material';
import Image from 'next/image';
import axios from '../../../axios';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '../SnackbarProvider';

const ReviewsTable = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { openSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('/api/get-reviews-by-admin-on-products');
                if (response.data.status === 'success') {
                    setReviews(response.data.data);
                } else {
                    openSnackbar('Failed to fetch reviews', 'error');
                }
            } catch (error) {
                openSnackbar('An error occurred while fetching reviews', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [openSnackbar]);

    const handleApprove = async (reviewId) => {
        try {
            const response = await axios.post('/api/accept-review-admin', { reviewId },{
              headers: {
                Authorization: localStorage.getItem('onlineKingToken'),
              }
            });
            if (response.data.status === 'success') {
                setReviews((prevReviews) => 
                    prevReviews.map((review) => 
                        review.id === reviewId ? { ...review, status: 'approved' } : review
                    )
                );
                openSnackbar('Review approved successfully', 'success');
            } else {
                openSnackbar('Failed to approve review', 'error');
            }
        } catch (error) {
            openSnackbar('An error occurred while approving the review', 'error');
        }
    };

    const handleDecline = async (reviewId) => {
        try {
            const response = await axios.post('/api/decline-review-admin', { reviewId },{
              headers: {
                Authorization: localStorage.getItem('onlineKingToken'),
              }
            });
            if (response.data.status === 'success') {
                setReviews((prevReviews) => 
                    prevReviews.map((review) => 
                        review.id === reviewId ? { ...review, status: 'declined' } : review
                    )
                );
                openSnackbar('Review declined successfully', 'success');
            } else {
                openSnackbar('Failed to decline review', 'error');
            }
        } catch (error) {
            openSnackbar('An error occurred while declining the review', 'error');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='px-[20px] container mx-auto overflow-y-scroll'>
            <div className='py-[10px] flex flex-col space-y-5'>
                <div className='flex flex-col space-y-1'>
                    <span className='text-[30px] text-[#101828] font-[500]'>Reviews</span>
                </div>
            </div>
            <div className='flex flex-col space-y-5 border border-[#EAECF0] rounded-[8px] p-[10px]'>
                <div className='flex items-center px-3 justify-between'>
                    <div className='flex space-x-2 items-center'>
                        <span className='text-[18px] font-[500] text-[#101828]'>Reviews list</span>
                        <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{reviews.length} reviews</span>
                    </div>
                </div>

                <Paper>
                    <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                        <Table stickyHeader aria-label="sticky table" sx={{ border: '1px solid #e0e0e0' }}>
                            <TableHead>
                                <TableRow className='!bg-[#F9FAFB]'>
                                    <TableCell style={{ border: '1px solid #e0e0e0' }}>SI No</TableCell>
                                    <TableCell style={{ border: '1px solid #e0e0e0' }}>User Name</TableCell>
                                    <TableCell style={{ border: '1px solid #e0e0e0' }}>Review Images</TableCell>
                                    <TableCell style={{ border: '1px solid #e0e0e0' }}>Product Name</TableCell>
                                    <TableCell style={{ border: '1px solid #e0e0e0' }}>Review Heading</TableCell>
                                    <TableCell style={{ border: '1px solid #e0e0e0' }}>Review Content</TableCell>
                                    <TableCell style={{ border: '1px solid #e0e0e0' }}>Rating Given</TableCell>
                                    <TableCell style={{ border: '1px solid #e0e0e0' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reviews.length > 0 ? reviews.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell style={{ border: '1px solid #e0e0e0' }}>{index + 1}</TableCell>
                                        <TableCell style={{ border: '1px solid #e0e0e0' }}>{row.user}</TableCell>
                                        <TableCell style={{ border: '1px solid #e0e0e0' }}>
                                            <div className="flex flex-wrap gap-2">
                                                {row.images.length > 0 ? row.images.map((image, imgIndex) => (
                                                    <Image key={imgIndex} src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${image}`} alt={`Review Image ${imgIndex + 1}`} width={50} height={50} className='rounded-lg' />
                                                )) : (
                                                    <span>No Images</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell style={{ border: '1px solid #e0e0e0' }}>{row.product_name}</TableCell>
                                        <TableCell style={{ border: '1px solid #e0e0e0' }}>{row.review_heading}</TableCell>
                                        <TableCell style={{ border: '1px solid #e0e0e0' }}>{row.review_text}</TableCell>
                                        <TableCell style={{ border: '1px solid #e0e0e0' }}>
                                            <Rating name="read-only" value={row.review_stars} readOnly />
                                        </TableCell>
                                        <TableCell style={{ border: '1px solid #e0e0e0' }}>
                                            {row.status === 'pending' ? (
                                                <div className='flex items-center gap-[15px]'>
                                                    <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center cursor-pointer' onClick={() => handleApprove(row.id)}>
                                                        <span className='text-[#027A48] text-[12px] font-[500]'>Approve</span>
                                                    </div>
                                                    <div className='flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center cursor-pointer' onClick={() => handleDecline(row.id)}>
                                                        <span className='text-red-500 text-[12px] font-[500]'>Decline</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className={`text-[12px] font-[500] ${row.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className='text-center text-[15px] font-bold'>No Reviews found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        </div>
    );
};

export default ReviewsTable;
