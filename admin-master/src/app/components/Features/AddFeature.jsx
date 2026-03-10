"use client"
import { IoClose } from "react-icons/io5";
import React, { useState } from 'react'
import dynamic from 'next/dynamic';
import { useSnackbar } from '../../SnackbarProvider';
import UploadImage from "../UploadImage/UploadImage";

const CustomEditor = dynamic(() => import('../../custom-editor'), { ssr: false });

const AddFeature = ({onSubmit, onReset}) => {
    const { openSnackbar } = useSnackbar();
    const [featurePayload, setFeaturePayload] = useState({
        feature_name:"",
        feature_description: "",
        image: null
    })
    const [loading, setLoading] = useState(false)
    const [clearImage, setClearImage] = useState([])

// handle the input field value
    const handleChange = (e) => {

       

        if(!e.target) {
            console.log(e, "editorr")
            setFeaturePayload((prev) => ({
                ...prev,
                ["feature_description"]: e
            }))
        } else {
            const {name, value} = e.target
            console.log(value,name, "dsfghj")
            setFeaturePayload((prev) => ({
                ...prev,
                [name]: value
            }))
        }
        
       
    }

// submit the data
const handleAddFeature = async () => {
    setLoading(true)
    console.log(featurePayload, "feature-payload")
    const res = await onSubmit(featurePayload)
    if(res.status === "success") {
        setLoading(false)
        openSnackbar(res.message, "success")
        handleReset()
    } else {
        openSnackbar(res.message, "error")
        setLoading(false)
    }
}

const handleReset = () => {
    setFeaturePayload({
        feature_name:"",
        feature_description: "",
        image: null
    })
}

const onImageUpload = (file) => {
  console.log(file,"upload-image");

  setFeaturePayload((prev) => ({
    ...prev,
    image: file
  }))

  setClearImage([])

}

  return (
    <div>
         <div className='flex justify-between items-center gap-[10px]'>

            <div className='flex flex-col space-y-1 w-full'>
              <span>Feature Name *</span>
              <input type='text' placeholder='Ex: Free Delivery' id='feature_name' className='inputText' name='feature_name' value={featurePayload.feature_name} onChange={handleChange} />

              <div className='flex flex-col space-y-1'>
                  <span>Feature Description</span>
                  <CustomEditor initialData={featurePayload.feature_description} name='feature_description' onChange={handleChange} />
            </div>
            </div>

           

            {/* <div className='flex flex-col space-y-1 w-full'>
              <span>Category Image *</span>
              <input id="image" type='file' accept='image/*' onChange={handleImageChange} />
            </div> */}
            <UploadImage initialImages={[]} onImagesChange={onImageUpload}/>

            {/* {showImage && (
              <div className="relative bg-[#D8C7B6] rounded-[8px]">
                <img src={showImage} alt='Uploaded Preview' width='200' className='rounded-[8px]' />
                <span onClick={handleRemoveImage} className="absolute top-[-15px] right-0 bg-transparent text-black cursor-pointer">
                  <IoClose />
                </span>
              </div>
            )} */}
          </div>

          <div className='flex items-center gap-[24px] justify-end mt-4'>
            <span className='resetButton' onClick={handleReset}>Reset</span>
            <span className='submitButton' onClick={!loading ? handleAddFeature : null}>Submit</span>
          </div>
    </div>
  )
}

export default AddFeature