import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import OfferCards from './OfferCards';
import { Pagination } from '@mui/material';
import useProductStore from '@/app/storeContext/store';
import axios from 'axios'; // Adjust the path based on your folder structure

const OfferListMain = ({ params, convertInRupee }) => {
  const { slug } = params;
//   console.log("params",params);
//   console.log("discount_id",discount_id);
//   console.log("params.slug",params.slug);
  const { offer_name } = decodeURIComponent(params.offer_name);
  
  const [offerDate, setOfferDate] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const rowsPerPage = 8;

  // Fetch offer data
  const fetchOfferData = useCallback((discount_id) => {
    axios.get(`http://localhost:4000/api/get-all-discounts-like-offer?discount_id=${discount_id}`)
      .then((res) => {
        if (res.data.code === 200) {
          setOfferDate(res.data.discounts[0].product_discount_associations);
          console.log("res.data.discounts.product_discount_associations",res.data.discounts.product_discount_associations);
        } else if (res.data.message === 'Session expired') {
          // Handle session expired case
          console.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
          // Handle error case
        }
      });
  }, []);

  useEffect(() => {
    fetchOfferData(slug);
    console.log("fetchOfferData",fetchOfferData);
  }, [slug]);                           

  // Filtering and pagination logic
  const filteredRows = offerDate.filter((e) =>
    e.product?.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
console.log("filteredRows",filteredRows);
  const totalRows = filteredRows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
  const paginatedRows = filteredRows.slice(startIndex, endIndex);
  console.log("paginatedRows",paginatedRows);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className='py-3 px-14'>
      <div className='grid gap-7 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4'>
        {paginatedRows.length === 0 && <p>No offers found.</p>}
        {paginatedRows.map((product) => (
          <Link key={product.id} href={`/ProductDetails/${product?.product?.id}`}>
            <div className="border border-transparent hover:border-black transition-all rounded-3xl">
              <OfferCards actualData={product} convertInRupee={convertInRupee} />
            </div>
          </Link>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-left mt-3">
          <Pagination count={totalPages} page={page} onChange={handleChangePage} shape="rounded" />
        </div>
      )}
    </div>
  );
}

export default OfferListMain;
