"use client"

import React, { useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import Image from 'next/image';
import EditFeature from './EditFeature';
import { useSnackbar } from '../../SnackbarProvider';

const FeaturesTabel = ({featuresList, onEdit, onToggle, onDelete}) => {
    const { openSnackbar } = useSnackbar();

const [page, setPage] = useState(1);
const rowsPerPage = 10;
// const totalRows = featuresList.length;
// const totalPages = Math.ceil(totalRows / rowsPerPage);
 
const totalRows = featuresList ? featuresList.length : 0;
const totalPages = Math.ceil(totalRows / rowsPerPage);

const [filterFeatures, setFilterFeatures] = useState(featuresList)
const [searchQuery, setSearchQuery] = useState("");
const [editDialog, setEditDialog] = useState(false)
const [editData, setEditData] = useState({})

  const filteredRows = filterFeatures.filter((e) =>
    e.feature_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

//function for handling tabel operation

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const deleteFeature = async (data) => {
    const payload = {
        feature_id: data.id
    }
   const res = await onDelete(payload)
   console.log(res, "feature-id")

   if(res.status === "success") {
    openSnackbar(res.message, "success")
   } else {
    openSnackbar(res.message, "error")
   }

  }

  const handleSwitchChange = async (id) => {
    const payload = {
        feature_id: id
    }
    const res = await onToggle(payload);
    if(res.status === "success") {
        openSnackbar(res.message, "success")
       } else {
        openSnackbar(res.message, "error")
       }
  }

  const handleEdit = (editData) => {
    console.log(editData, "edit-feature")
    setEditDialog(true)
    setEditData(editData)
  }

  return (
    <div className='flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]'>
    <div className='flex items-center justify-between'>
      <div className='flex space-x-2 items-center'>
        <span className='text-[18px] font-[500] text-[#101828]'>Features Table</span>
        <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{filterFeatures.length} Features</span>
      </div>
      <div className='flex items-center space-x-3 inputText w-[50%]'>
        <IoSearch className='text-[20px]' />
        <input
          type='text'
          className='outline-none focus-none w-full'
          placeholder='Search Feature Name here'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>

    {/* Table content here */}
    <Paper >
      <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow className='!bg-[#F9FAFB]'>
              {/* Define your table header columns */}
              <TableCell style={{ minWidth: 80 }}>Sl No</TableCell>
              <TableCell style={{ minWidth: 150 }}>Feature Image</TableCell>
              <TableCell style={{ minWidth: 200 }}>Feature Name</TableCell>
              <TableCell style={{ minWidth: 50 }}>Status</TableCell>
              <TableCell style={{ minWidth: 50 }}>Change Status</TableCell>
              <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
              <TableCell style={{ minWidth: 50 }}>Edit</TableCell>
            </TableRow>
          </TableHead>
          {filteredRows.length > 0 ?
            <TableBody>
              {paginatedRows.map((row, i) => (
                <TableRow key={i} >
                  <TableCell>{startIndex + i + 1}</TableCell>
                  <TableCell>
                    <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image_url}`} width={50} height={50} alt={row.feature_name} className='rounded-[8px]' />
                    {/* <Image
                      width={1000}
                      height={1000}
                      src={row.image_url}
                      alt="image"
                      className="max-w-[80px] max-h-[80px] object-contain"
                      /> */}
                  </TableCell>
                  <TableCell>{row.feature_name}</TableCell>
                  <TableCell >
                    {row.status ?
                      <div className='flex items-center gap-[5px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center'>
                        <Image src="/images/active.svg" height={10} width={10} alt='active' />
                        <span className='text-[#027A48] text-[12px] font-[500]'>Active</span>
                      </div> :
                      <div className='flex items-center gap-[5px] py-[5px] bg-red-200 rounded-[16px] justify-center'>
                        <Image src="/images/inactive.svg" height={10} width={10} alt='active' />
                        <span className='text-red-500 text-[12px] font-[500]'>Inactive</span>
                      </div>
                    }
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={row.status}
                      onChange={() => handleSwitchChange(row.id)}
                      inputProps={{ 'aria-label': 'controlled' }}
                      sx={{
                        '& .Mui-checked + .MuiSwitch-track': {
                          backgroundColor: row.status ? '#CFAA4C' : '',
                        },
                        '& .MuiSwitch-thumb': {
                          backgroundColor: row.status ? '#CFAA4C' : '',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell ><FaRegTrashAlt className='cursor-pointer' onClick={() => deleteFeature(row)} /></TableCell>
                  <TableCell><FaEdit className='cursor-pointer' onClick={() => handleEdit(row)} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
            :
            <TableRow>
              <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No product found</TableCell>
            </TableRow>
          }
        </Table>
      </TableContainer>
    </Paper>

    {
        editDialog &&
        <EditFeature editData={editData} dialog={editDialog} handleEditDialog={() => setEditDialog(!editDialog)} onUpdate={onEdit}/>
    }

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

export default FeaturesTabel