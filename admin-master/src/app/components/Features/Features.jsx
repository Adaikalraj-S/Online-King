
import React, { useState, useEffect } from 'react';
import axios from '../../../../axios';
import AddFeature from './AddFeature';
import FeaturesTabel from './FeaturesTabel';
import { CircularProgress } from '@mui/material';

const Features = () => {
  const [featuresList, setFeaturesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/fetch-features');
      console.log(response.data.features, "dfg")
      setFeaturesList(response.data.features);
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  // const addFeature = async (newFeature) => {
  //   const formData = new FormData();
  //   for(let data in newFeature) {
  //     if(newFeature[data] !== null) {
  //       if(data === "image") {
  //         let newImage = newFeature[data][0].file;
  //         formData.append(data, newImage)
  //       }
  //       formData.append(data, newFeature[data])
  //     }
  //   }
  //   try {
  //     const response = await axios.post('/api/create-products-features', newFeature, {
  //       headers: {
  //         Authorization: localStorage.getItem("onlineKingToken"),
  //         "Content-Type": "multipart/form-data"
  //       }
  //     });
  //     fetchFeatures(); // Refresh the list after adding
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error adding feature:', error);
  //     return error;
  //   }
  // };

  const addFeature = async (newFeature) => {
    const formData = new FormData();
  
    // Append data to formData
    for (let key in newFeature) {
      if (newFeature[key] !== null) {
        if (key === "image") {
          // If it's an image, append the file object
          let newImage = newFeature[key][0].file;
          formData.append(key, newImage);
        } else {
          // Append other data
          formData.append(key, newFeature[key]);
        }
      }
    }
  
    try {
      const response = await axios.post('/api/create-products-features', formData, {
        headers: {
          Authorization: localStorage.getItem("onlineKingToken"),
          "Content-Type": "multipart/form-data"
          // No need to set Content-Type explicitly
        }
      });
  
      fetchFeatures(); // Refresh the list after adding
      //document.getElementById("img").src = "";
      setRefreshKey((prev) => prev + 1)
      return response.data;
    } catch (error) {
      console.error('Error adding feature:', error);
      return error;
    }
  };
  

  const editFeature = async (updatedFeature) => {
    try {
      const response = await axios.post(`/api/edit-products-features`, updatedFeature, {
        headers: {
          Authorization: localStorage.getItem("onlineKingToken"),
          "Content-Type": "multipart/form-data"
          
        }
      });
      fetchFeatures(); // Refresh the list after editing
      return response.data;
    } catch (error) {
      console.error('Error editing feature:', error);
      return null;
    }
  };

  const deleteFeature = async (id) => {
    try {
      const response = await axios.post(`/api/delete-products-features`, id, {
        headers: {
          Authorization: localStorage.getItem("onlineKingToken")
        }
      });
      fetchFeatures(); // Refresh the list after deletion
      return response.data;
    } catch (error) {
      console.error('Error deleting feature:', error);
      return null;
    }
  };

  const ToggleStatusFeature = async (id) => {
    try {
      const response = await axios.post(`/api/toggle-status-products-features`, id, {
        headers: {
          Authorization: localStorage.getItem("onlineKingToken")
        }
      });
      fetchFeatures(); // Refresh the list after toggling status
      return response.data;
    } catch (error) {
      console.error('Error toggling feature status:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  return (
    <div className='px-[20px] container mx-auto overflow-y-scroll'>
      <div className='py-[10px] flex flex-col space-y-5'>
        <div className='flex flex-col space-y-1'>
          <span className='text-[30px] text-[#101828] font-[500]'>Feature Setup</span>
          <span className='text-[#667085] font-[400] text-[16px]'>
            Effortlessly organize your product offerings with intuitive Feature Setup for a seamless and structured e-commerce experience.
          </span>
        </div>

        <AddFeature key={refreshKey} onSubmit={addFeature} />

        {loading ? (
          <p className='text-center'><CircularProgress/></p>
        ) : (
          <FeaturesTabel 
            onDelete={deleteFeature} 
            onEdit={editFeature} 
            featuresList={featuresList} 
            onToggle={ToggleStatusFeature}
          />
        )}
      </div>
    </div>
  );
};

export default Features;
