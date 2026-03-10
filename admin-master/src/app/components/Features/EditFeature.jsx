import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';
import { useSnackbar } from '../../SnackbarProvider';
import UploadImage from '../UploadImage/UploadImage';

const CustomEditor = dynamic(() => import('../../custom-editor'), { ssr: false });

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

const EditFeature = ({editData, dialog, onUpdate, handleEditDialog}) => {

    const { openSnackbar } = useSnackbar();

    const [editFeatureData, setEditFeatureData] = useState(editData)
    const [loading, setLoading] = useState(false);
    const [editImage, setEditImage] = useState([{
      url: editData.image_url
    }])


    const handleEditFeature = (e) => {

        if(!e.target) {
            setEditFeatureData((prev) => ({
                ...prev,
                ["feature_description"]: e
            }))
        } else {
            const {name, value} = e.target;

            console.log(name,value, "dsfgh")
    
            setEditFeatureData((prev) => ({
                ...prev,
                [name]: value
            }))
        }
       
    }

    const saveEditFeature = async () => {
        console.log(editFeatureData, "form-feature");

        const editPayload = new FormData()

        editPayload.append("id", parseInt(editFeatureData.id))
        editPayload.append("feature_name", editFeatureData.feature_name)
        editPayload.append("feature_description", editFeatureData.feature_description)
        if(editFeatureData.image) {
        editPayload.append("image", editFeatureData.image)

        }

       
        const res = await onUpdate(editPayload)
        if(res.status === "success") {
            setLoading(false)
            openSnackbar(res.message, "success")
            handleEditDialog()
        } else {
            openSnackbar(res.message, "error")
            setLoading(false)
        }
    }

    const handleEditImage = (data) => {
      console.log(data, "img-dats");
      setEditFeatureData((prev) => ({
        ...prev,
        image: data[0].file
      }))
    }

  return (
    <div>
         <BootstrapDialog
          onClose={handleEditDialog}
          aria-labelledby="customized-dialog-title"
          open={dialog}
          fullWidth
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Edit Feature
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleEditDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <div className='flex flex-col space-y-2'>
              <span className='text-[#344054] text-[14px] font-[500]'>Feature Name</span>
              <input type='text' value={editFeatureData.feature_name} className='inputText' placeholder='Ex: Free Delivery' name='feature_name' onChange={handleEditFeature} />
            </div>

            <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Feature Description</span>
                  <CustomEditor name='feature_description' initialData={editFeatureData.feature_description} onChange={handleEditFeature} />
            </div>

            {/* <div className='flex flex-col space-y-2 py-5'>
              <span className='text-[#344054] text-[14px] font-[500]'>Choose Category Image</span>
              <input type='file' accept='image/*' onChange={handleImageChangeEdit} />
            </div> */}

            {/* {editData && (
              <div className="relative rounded-[8px]">
                <img src={showImageEdit || `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${editData.image_url}`} alt='Uploaded Preview' width='100' className='rounded-[8px]' />
                <span onClick={handleRemoveImageEdit} className={`absolute top-[-15px] bg-transparent text-black cursor-pointer ${!showImageEdit ? 'hidden' : 'block'}`}>
                  <IoClose />
                </span>
              </div>
            )} */}
            <UploadImage initialImages={editImage} onImagesChange={handleEditImage}/>
          </DialogContent>
          <DialogActions className='justify-between'>
            <span onClick={handleEditDialog} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
              Cancel
            </span>
            <span autoFocus onClick={!loading ? saveEditFeature : null} className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70'>
              Save Changes
            </span>
          </DialogActions>
        </BootstrapDialog>
    </div>
  )
}

export default EditFeature