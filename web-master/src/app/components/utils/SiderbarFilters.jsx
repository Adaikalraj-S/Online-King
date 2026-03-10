"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Checkbox,
  TextField,
  Autocomplete,
  Box,
  Slider,
  Typography,
} from "@mui/material";
import useProductStore from "@/app/storeContext/store";
import { values } from "lodash";

const SidebarFilter = ({ filters, onFilterChange, product_type = null }) => {
  const {
    fetchCategoryData,
    categoryData,
    subCategoryData,
    brands,
    superSubCategoryData,
    priceRangeProduct,
    setPriceRangeProduct,
    fetchSubCategoryData,
  } = useProductStore();
const [loading, setLoading] = useState(true);

  const [priceSlider, setPriceSlider] = useState([]);

  const intervalIdRef = useRef(null)

  useEffect(() => {
    console.log("effect-run")
    setPriceSlider(priceRangeProduct)

    setLoading(false)
    return () => {
      if (intervalIdRef.current) {
        clearTimeout(intervalIdRef.current);
      }
    };
  },[priceRangeProduct])
  useEffect(() => {
    setLoading(true)
    fetchCategoryData()
    console.log('222', categoryData);
    setLoading(false)
  },[filters])

  console.log(priceSlider, "sl")

  // Handle individual filter change and notify the parent component
  const handleFilterChange = (key) => (event, newValue) => {
    console.log(key, newValue, "side222");

    onFilterChange(
      key,
      newValue.map((e) => e.id)
    ); // Pass the filter change up to the parent
  };

  // Handle price range change and notify the parent component
  const handlePriceRangeChange = (key) => (event, newValue) => {
    console.log(newValue, "value=price",key);
    //setPriceRangeProduct(newValue);
    setPriceSlider(newValue);

  // Clear the existing timeout if there is one
  if (intervalIdRef.current) {
    clearTimeout(intervalIdRef.current);
  }

  // Set a new timeout
  intervalIdRef.current = setTimeout(() => {
    onFilterChange("priceRange", newValue);
  }, 3000);
    
  };

  console.log(filters, "dfu", "cat", categoryData);

  return (
    <div className="md:w-64 w-full shadow-lg rounded-lg p-4">
    {(!loading) ? (
      <>
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          {/* Category Filter */}
          <Box mb={2}>
            <Autocomplete
              multiple
              fullWidth
              // disabled={product_type != null}
              options={categoryData || []}
              getOptionLabel={(option) => option?.category_name}
              isOptionEqualToValue={(option, value) => option.id === value}
              value={categoryData.filter((option) => filters.category_id.includes(option.id))} // Use the parent filters prop
              // isOptionEqualToValue={(option,value) => option.id === value?.find(option.id)}
              onChange={handleFilterChange("category_id")}
              renderOption={(props, option, { selected }) => (
                <li key={option.id} {...props}>
                  <Checkbox checked={selected} />
                  {option.category_name}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Categories" variant="outlined" />
              )}
            />
          </Box>

          {/* Sub-Category Filter */}
          <Box mb={2}>
            <Autocomplete
              multiple
              fullWidth
              options={subCategoryData}
              getOptionLabel={(option) => option.sub_category_name}
              value={filters.selectedSubCategories} // Use the parent filters prop
              onChange={handleFilterChange("sub_category_id")}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} />
                  {option.sub_category_name}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Sub-Categories" variant="outlined" />
              )}
            />
          </Box>

          {/* Super Sub-Category Filter */}
          <Box mb={2}>
            <Autocomplete
              multiple
              fullWidth
              options={superSubCategoryData}
              getOptionLabel={(option) => option.super_sub_category_name}
              value={filters.selectedSuperSubCategories} // Use the parent filters prop
              onChange={handleFilterChange("super_sub_category_id")}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} />
                  {option.super_sub_category_name}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Super Sub-Categories"
                  variant="outlined"
                />
              )}
            />
          </Box>

          {/* Brands Filter */}
          <Box mb={2}>
            <Autocomplete
              multiple
              fullWidth
              options={brands}
              getOptionLabel={(option) => option.brand_name}
              value={filters.selectedBrands} // Use the parent filters prop
              onChange={handleFilterChange("product_brand_id")}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} />
                  {option.brand_name}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Brands" variant="outlined" />
              )}
            />
          </Box>

          {/* Price Range Filter */}
          <Box mb={2}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={priceSlider}
              onChange={handlePriceRangeChange("priceRange")}
              min={priceRangeProduct[0]}
              max={priceRangeProduct[1]}
              valueLabelDisplay="auto"
            />
            
            <Box display="flex" justifyContent="space-between">
              <span>{`₹${priceRangeProduct[0]}`}</span>
              <span>{`₹${priceRangeProduct[1]}`}</span>
            </Box>
          </Box>
      </>
    ) : (
      <>
        <div className="">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="animate-pulse bg-gray-300 w-full w-full shadow-lg rounded-lg p-4 h-[400px]" />
        </div>
      </>
    )}
    </div>
  );
};

export default SidebarFilter;
