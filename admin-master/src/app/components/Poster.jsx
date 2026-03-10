import React, { useState, useEffect, useRef } from "react";
import axios from "../../../axios"; // Adjust with your API service instance
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";


const Poster = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]); // State for uploaded images
  const fileInputRef = useRef(null);
  // Fetch uploaded images
  const fetchUploadedImages = async () => {
    try {
      const response = await axios.get("/api/get-offer-images");
      setUploadedImages(response.data.offer_images || []);
    } catch (error) {
      console.error("Failed to fetch uploaded images:", error.message);
    }
  };

  // Fetch images on component mount
  useEffect(() => {
    fetchUploadedImages();
  }, []);

  // Handle file selection
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Only JPEG, PNG, or GIF files are allowed.");
      return;
    }

    const maxSizeInMB = 5;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setErrorMessage(`File size must be less than ${maxSizeInMB}MB.`);
      return;
    }
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));

    setErrorMessage(null);

};

  // Handle image upload
  const handleUpload = async () => {
    if (!image) {
      setErrorMessage("Please select an image to upload.");
      return;
    }

    const token = typeof window !== "undefined" && localStorage.getItem("onlineKingToken");
    if (!token) {
      setErrorMessage("You must be logged in to upload an image.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.post(
        "/api/add-offer-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      setSuccessMessage(response.data.message || "Image uploaded successfully!");
      setImage(null);
      setPreviewUrl(null);
      fetchUploadedImages();
      if (fileInputRef.current) fileInputRef.current.value = "";
      // Refresh the table after upload
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to upload the image. Please try again."
      );
    } finally {
      setIsUploading(false);
     
    }
  };

 

  const deleteBanner = (data) => {
    Swal.fire({
      title: "Delete",
      text: `Do you want to Delete this Poster?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            '/api/delete-offer-image', 
            {
                id : data.id
            },
            {
              headers: {
                Authorization: localStorage.getItem("onlineKingToken"),
              },
            }
          )
          .then((res) => {
            if (res.data.code == 200) {
                fetchUploadedImages();
              openSnackbar(res.data.message, "success");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };






  return (
    <div className="p-5 bg-gray-100 min-h-screen overflow-scroll   w-full" >
      <div className="w-full  bg-white p-5 rounded-lg shadow-md mb-5 align-left"  >
        <h1 className="text-2xl font-bold text-center mb-2">Add Coupon Image</h1>
        <div className="flex p-1 flex-col gap-3">
          <label className="font-medium text-gray-700">
            Upload Image
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="images"
            accept="image/*"
            onChange={handleFileInput}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-4 w-16 h-16 object-cover rounded-md shadow-md"
            />
          )}
        </div>
        <button
          onClick={handleUpload}
          className={`mt-5 w-full py-2 px-4 text-white font-bold rounded-md ${
            isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-3 text-center">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm mt-3 text-center">{successMessage}</p>
        )}
      </div>

      {/* Table for uploaded images */}
      <div className="w-full h-[500px] overflow-scroll  bg-white p-6  rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-5">Uploaded Images</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">SI</th>
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Delete</th>
             
            </tr>
          </thead>
          <tbody>
            {uploadedImages.length > 0 ? (
              uploadedImages.map((img, index) => (
                <tr key={img.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border h-auto center border-gray-300 px-4 py-2">
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${img.image_url}`}
                      alt={`Offer ${index + 1}`}
                      className="w-[200px] m-2 h-auto object-cover rounded-md"
                    />
                  </td>
                  <td className="flex  justify-center   px-4 py-4">
                    <MdDelete onClick={()=> deleteBanner(img)} className="text-[30px]" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No images uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Poster;
