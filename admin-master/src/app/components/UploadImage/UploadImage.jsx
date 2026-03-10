

"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";

const UploadImage = ({ initialImages = [], onImagesChange }) => {

  console.log(initialImages, "edit-image")
    
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileList, setFileList] = useState(initialImages);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(false)

  const countRef = useRef(0)
console.log("renering", countRef.current + 1)
  // useDropzone hook for drag-and-drop and click functionality
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => processFiles(acceptedFiles),
    multiple: true, // Allow multiple file uploads
  });

  useEffect(() => {
    if(initialImages.length > 0 && selectedFiles.length === 0) {
      setUploadedImage(true)
    } else {
      setUploadedImage(false)
    }
  },[initialImages, selectedFiles])

  const processFiles = (files) => {
    // Convert FileList to array if needed
    const filesArray = Array.isArray(files) ? files : Array.from(files);
    const validatedFiles = [];

    filesArray.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setFileError("File should be an image");
      } else if (file.size > 1024 * 1024 * 25) {
        setFileError("File max size is 24MB");
      } else {
        validatedFiles.push(file);
      }
    });

    if (validatedFiles.length > 0) {
      setSelectedFiles(validatedFiles);
      setFileError(null); // Clear error if valid files are selected
    }

    // Clear the input value after processing files to allow re-uploading
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (selectedFiles.length > 0) {
      const newFileList = selectedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        file
      }));

      setFileList((prevList) => [
        ...prevList,
        ...newFileList.filter(
          (file) => !prevList.some((item) => item.name === file.name)
        ),
      ]);

      if (onImagesChange) {
        onImagesChange(newFileList);
      }
    }
  }, [selectedFiles]);

  const removeFromList = (index) => {
    setFileList((currState) => {
      const newList = currState.filter((_, i) => i !== index);
      return newList;
    });
    setSelectedFiles([]); // Reset selected files to allow re-uploading
  };


  return (
    <div className="flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]">
      <span className="text-[18px] font-[600]">Product Image</span>
      <div className="flex flex-col items-center justify-center text-[16px]">
        <div
          {...getRootProps()}
          className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full"
        >
          <div className="text-[40px]">
            <FaCloudUploadAlt />
          </div>
          <header className="text-[10px] font-semibold">
            Drag & Drop to Upload File
          </header>
          <span className="mt-2 text-[10px] font-bold">OR</span>
          <button
            className="text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300"
            onClick={() => fileInputRef.current?.click()} // Open file picker on click
          >
            Click to Upload
          </button>
          <input
            {...getInputProps()}
            ref={fileInputRef}
            id="img"
            className="hidden" // Hide input but make it clickable
            onChange={(e) => processFiles(e.target.files)} // Handle file selection
          />
        </div>

        {/* Error message display */}
        {fileError && <p className="text-red-500">{fileError}</p>}

        <div className="flex flex-wrap items-center mt-3">
          {fileList.map((file, index) => (
            <div key={index} className="p-2 relative">
              <img
                src={uploadedImage ? `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${file.url}`:file.url}
                alt={file.name}
                id="img"
                className="max-w-[80px] max-h-[80px]"
              />
              {/* <Image
              width={1000}
              height={1000}
              src={file.url}
              alt="image"
              className="max-w-[80px] max-h-[80px] object-contain"
              /> */}
              <button
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                onClick={() => removeFromList(index)}
              >
                <FaTimes className="text-[10px]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadImage;




