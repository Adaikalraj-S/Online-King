import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa'
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination, TextField } from '@mui/material';
import Image from 'next/image';
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdAdd } from 'react-icons/md';
import axios from '../../../axios';
import { getCategories, getProductBrands, getProducts, getSubCategories, getSuperSubCategories } from '../api';
import { Autocomplete, Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSnackbar } from '../SnackbarProvider';
import { IoClose } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2'
// import { useDialog } from '../context/DialogProvider';

const Discounts = () => {
  const { openSnackbar } = useSnackbar();
  // const {showDialog} = useDialog();
  const router = useRouter()

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchCategory()
      fetchProductBrands()
      fetchProducts()
      fetchDiscountsData()
    }

    return () => { unmounted = true };
  }, [])

  const [getAllCategories, setGetAllCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const fetchCategory = async () => {
    try {
      const categoryData = await getCategories();
      console.log(categoryData, "cat")
      setGetAllCategories(categoryData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  // ------------------------ Sub Category Data ----------------------------
  const [subCategoryData, setSubCategoryData] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  useEffect(() => {
    setSelectedSubCategory(null)
    document.getElementById('sub_category_id').value = ''
    if (selectedCategory) {
      fetchSubCategoryData(selectedCategory);
    }
  }, [selectedCategory]);


  const fetchSubCategoryData = useCallback(
    (selectedCategory) => {
      axios.get(`/api/fetch-subcategories?category_id=${selectedCategory}`, {
        headers: {
          Authorization: localStorage.getItem('onlineKingToken')
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            setSubCategoryData(res.data.subcategories || [])
          } else if (res.data.message === 'Session expired') {
            openSnackbar(res.data.message, 'error');
            router.push('/login')
          }
        })
        .catch(err => {
          console.log(err)
          if (err.response && err.response.data.statusCode === 400) {
            openSnackbar(err.response.data.message, 'error');
          }
        })
    },
    [],
  )

  // ----------------------------------------------Fetch Super Sub Category section Starts-----------------------------------------------------
  const [superSubCategoryData, setSuperSubCategoryData] = useState([])
  const [selectedSuperSubCategory, setSelectedSuperSubCategory] = useState(null)
  useEffect(() => {
    setSelectedSuperSubCategory(null)
    document.getElementById('super_sub_category_id').value = ''
    if (selectedSubCategory != null) {
      fetchSuperSubCategoryData(selectedSubCategory);
    }
  }, [selectedSubCategory]);
  
     
     const fetchSuperSubCategoryData = useCallback(
       (selectedSubCategory) => {
        if (selectedSubCategory == null) {
         return;
        }
          axios.get(`/api/fetch-supersubcategories?sub_category_id=${selectedSubCategory}`, {
           headers: {
             Authorization: localStorage.getItem('onlineKingToken')
           }
         })
           .then((res) => {
             if (res.data.code == 200) {
               setSuperSubCategoryData(res.data.superSubcategories)
             } else if (res.data.message === 'Session expired') {
               openSnackbar(res.data.message, 'error');
               router.push('/login')
             }
           })
           .catch(err => {
             console.log(err)
             if (err.response && err.response.data.statusCode === 400) {
               openSnackbar(err.response.data.message, 'error');
             }
           })
       },
       [],
     )
   
  // ----------------------------------------------Fetch Super Sub Category section Ends-----------------------------------------------------
  const [getAllProductBrands, setGetAllProductBrands] = useState([])
  const [selectedProductBrand, setSelectedProductBrand] = useState(null)
  const fetchProductBrands = async () => {
    try {
      const productBrandData = await getProductBrands();
      setGetAllProductBrands(productBrandData.brandNames);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const [getAllProducts, setGetAllProducts1] = useState([])

  useEffect(() => {
    if(!isEditable) {
    fetchProducts(selectedProductBrand, selectedCategory, selectedSubCategory, selectedSuperSubCategory);

    }
    if(isEditable) {
      let filterOptions = {}
      if(selectedProductBrand) {
        filterOptions.product_id = selectedProductBrand
      }
      if(selectedCategory) {
        filterOptions.category_id = selectedCategory
      }
      if(selectedSubCategory) {
        filterOptions.sub_category_id = selectedSubCategory
      }
      if(selectedSuperSubCategory) {
        filterOptions.super_sub_category_id = selectedSuperSubCategory
      }
      fetchProductsDetails(filterOptions)
    }
  }, [selectedProductBrand, selectedCategory, selectedSubCategory, selectedSuperSubCategory]);
      const [filteredProducts, setfilteredProducts] = useState([])

  const fetchProducts = useCallback(
    (brand, category, subcategory, superSubcategory) => {
      let queryParams = '';

      if (brand) {
        queryParams += `product_brand_id=${brand}&`;
      }
      if (category) {
        queryParams += `category_id=${category}&`;
      }
      if (subcategory) {
        queryParams += `sub_category_id=${subcategory}&`;
      }
      if (superSubcategory) {
        queryParams += `super_sub_category_id=${superSubcategory}&`;
      }
      
      axios.get(`/api/get-products?${queryParams}`, {
        headers: {
          Authorization: localStorage.getItem('onlineKingToken')
        }
      })
      .then((res) => {
        if (res.data.code == 200) {
          console.log(res.data.products, "products-from 02")
          setGetAllProducts1(res.data.products)
          console.log(res.data.products, "products-from 03")
          setfilteredProducts(res.data.products.filter(product => product.status))
        } else if (res.data.message === 'Session expired') {
          openSnackbar(res.data.message, 'error');
          router.push('/login')
        }
      })
      .catch(err => {
        console.log(err)
        if (err.response && err.response.data.statusCode === 400) {
          openSnackbar(err.response.data.message, 'error');
        }
      })
    },
    [],
  )

  // ----------------------------------------------Fetch discount data section Starts-----------------------------------------------------
  const [discountData, setDiscountData] = useState([])

  const fetchDiscountsData = useCallback(
    () => {
      axios.get('/api/get-all-discounts-admin', {
        headers: {
          Authorization: localStorage.getItem('onlineKingToken')
        }
      })
        .then((res) => {
          if (res.data.status === 'success') {
            setDiscountData(res.data.discounts)
          }
        })
        .then(err => {
          console.log(err)
        })
    },
    [],
  )

  // ----------------------------------------------Fetch discount data section Ends-----------------------------------------------------

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = discountData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = discountData.filter((e) =>
    e.discount_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRows.length);
  const paginatedRows = filteredRows.slice(startIndex, endIndex);


  // -------------------multiple product choose------------------------
  const [selectedProducts, setSelectedProducts] = useState([]);
  console.log("selectedProducts",selectedProducts)

  const handleProductChange = (event, value) => {
    setSelectedProducts(value);
    console.log("product value 222",value);
    setDiscountDataInput((prevData) => ({
      ...prevData,
      products: value.map((product) => ({ product_id: product.id })),
    }));
  };
  // -------------------multiple product choose------------------------


  //--------------------------add discounts section starts--------------------------------

  const [discountDataInput, setDiscountDataInput] = useState({
    discount_name: '',
    product_brand_id: '',
    category_id: 0,
    sub_category_id: 0,
    super_sub_category_id: 0,
    products: [],
    discount_type: '',
    discount: 0,
    min_amount: 0,
    max_amount: 0,
    start_date: '',
    expiry_date: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDiscountDataInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const reset = () => {
    // Resetting state values
    setDiscountDataInput({
      discount_name: '',
      product_brand_id: '',
      category_id: '',
      sub_category_id: '',
      super_sub_category_id: '',
      product_name: '',
      products: [],
      discount_type: '',
      discount: 0,
      min_amount: 0,
      max_amount: 0,
      start_date: '',
      expiry_date: '',
    });
  
    // Resetting file and image preview
    setImage(null);
    setShowImage(null);
    setSelectedProductBrand('');
          setSelectedCategory('');
          setSelectedSubCategory('');
          setSelectedSuperSubCategory('');
          setSelectedProducts([]);
  
    // Resetting the DOM elements
    document.getElementById('image').value = '';
  };
  
  // const reset = () => {

  //   setDiscountDataInput({
  //     discount_name: '',
  //     product_brand_id: 0,
  //     category_id: 0,
  //     sub_category_id: 0,
  //     super_sub_category_id: 0,
  //     products: [],
  //     discount_type: '',
  //     discount: 0,
  //     min_amount: 0,
  //     max_amount: 0,
  //     start_date: '',
  //     expiry_date: '',
  //   })

  //   document.getElementById('discount_name').value = ''
  //   document.getElementById('product_brand_id').value = ''
  //   document.getElementById('category_id').value = ''
  //   document.getElementById('sub_category_id').value = ''
  //   document.getElementById('super_sub_category_id').value = ''
  //   document.getElementById('discount').value = ''
  //   document.getElementById('min_amount').value = ''
  //   document.getElementById('max_amount').value = ''
  //   document.getElementById('start_date').value = ''
  //   document.getElementById('expiry_date').value = ''
  //   setImage(null);
  //   setShowImage(null)
  //   document.getElementById('image').value = ''
  // }

  // Image uploading section
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(file);
        setShowImage(e.target.result)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setShowImage(null)
    document.getElementById('image').value = ''
  };


  const addDiscount = () => {
    if (!discountDataInput.discount_name) {
      openSnackbar('Please Enter Discount Name', 'error');
      return
    }
    if (!image) {
      openSnackbar('Please Select Image', 'error');
      return
    }

    const formdata = new FormData()
    if (selectedProductBrand) {
      formdata.append('product_brand_id', selectedProductBrand)
    }

    if (selectedCategory) {
      formdata.append('category_id', selectedCategory)
    }

    if (selectedSubCategory) {
      formdata.append('sub_category_id', selectedSubCategory)
    }

    if (selectedSuperSubCategory) {
      formdata.append('super_sub_category_id', selectedSuperSubCategory)
    }

    if (selectedProducts.length > 0) {
      formdata.append('products', JSON.stringify(discountDataInput.products));
    }

    if (image) {
      formdata.append('image', image)
    }
    formdata.append('discount_name', discountDataInput.discount_name)
    formdata.append('discount_type', discountDataInput.discount_type)
    formdata.append('discount', discountDataInput.discount)
    formdata.append('min_amount', discountDataInput.min_amount)
    formdata.append('max_amount', discountDataInput.max_amount)
    formdata.append('start_date', discountDataInput.start_date)
    formdata.append('expiry_date', discountDataInput.expiry_date)

    console.log(formdata, "form-data")


    axios.post('/api/add-discounts', formdata, {
      headers: {
        Authorization: localStorage.getItem('onlineKingToken'),
        'Content-Type': 'multipart/form-data',
      }
    })
      .then(res => {
        console.log(res)
        if (res.data.status === 'success') {
          openSnackbar(res.data.message, 'success');
          fetchDiscountsData()
          setGetAllProducts1([])
          setDiscountDataInput({})
          reset()
          
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  //--------------------------add discounts section ends--------------------------------

  // -------------------------- status change section starts--------------------------------

  const handleSwitchChange = (id) => {
    axios.post(`/api/update-discount-status?discount_id=${id}`, {}, {
      headers: {
        Authorization: localStorage.getItem('onlineKingToken')
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          openSnackbar(res.data.message, 'success');
          fetchDiscountsData()
        } else {
          openSnackbar(res.data.message, 'error');
        }
      })
      .catch(err => {
        console.log(err)
      })
  };
  // -------------------------- status change section ends--------------------------------


  // --------------------------delete discounts section starts--------------------------------
  const deleteDiscount = (data) => {
    Swal.fire({
      title: "Delete",
      text: `Do you want to Delete this ${data.discount_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Delete it"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/delete-discount?discount_id=${data.id}`, {}, {
          headers: {
            Authorization: localStorage.getItem('onlineKingToken')
          }
        })
          .then(res => {
            if (res.data.status === 'success') {
              openSnackbar(res.data.message, 'success');
              fetchDiscountsData()
            } else {
              openSnackbar(res.data.message, 'error');
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  };
  // --------------------------delete discounts section ends--------------------------------


  // --------------------------edit discounts section starts--------------------------------
  const [isEditable, setIsEditable] = useState(false)
  const [editData, setEditData] = useState({})
  const [editProductDiscountAssociations, setEditProductDiscountAssociations] = useState([])
  const [selectedOptions, setSelectedOptions] = useState([]);
  console.log(editData)

  const handleEdit =  (data) => {
    console.log(data, "edit-data")
    const {product_brand_id, category_id, sub_category_id, super_sub_category_id} = data
    // fetchCategoryData(Number(data.category_id))
    fetchSubCategoryData(data.category_id)
    fetchSuperSubCategoryData(data.sub_category_id || null)
    fetchProductsDetails({product_brand_id, category_id, sub_category_id, super_sub_category_id})
    const products = data.product_discount_associations.map(e => {
      console.log(e, "productnae")
      return {
        product_id: e.product_id,
        product_name: e.product.product_name
      }
    })
    setEditData(data)
    
    setSelectedOptions(products)
   
    setIsEditable(true)
  }

  const fetchProductsDetails = async (filter = {}) => {
    try {
      const res = await axios.get("/api/get-products", {
        params: filter,
        headers: {
          Authorization: localStorage.getItem('onlineKingToken')
        }
      });
      
      const filterProductsOptions = res.data.products.map((item) => (
        {
          product_name: item.product_name,
          product_id: item.id,
          product_discount_associations: item.product_discount_associations

        }
      ))
     // Filter products where any association's product_id matches the product's id
        const selectFilterValue = filterProductsOptions.filter((item) => 
        item?.product_discount_associations?.some((association) => association?.product_id === item?.product_id)
        );
      console.log(filterProductsOptions, "products-from 01")
      setEditProductDiscountAssociations(filterProductsOptions)
      setSelectedOptions(selectFilterValue)
      //return res.data;
    } catch (error) {
      console.error('Error fetching products details:', error.message);
      return null; // Return null or handle the error as needed
    }
  }
  

  const handleProductBrandChange = (e) => {
    const selectedBrand = e.target.value;
  
    // Reset the other fields
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSelectedSuperSubCategory('');
    setSelectedProducts([]);
  
    // Update the selected product brand
    setSelectedProductBrand(selectedBrand);
  };
  const handleCategoryChange = (e) => {
    const selectedBrand = e.target.value;
  
    // Reset the other fields
    setSelectedSubCategory('');
    setSelectedSuperSubCategory('');
    setSelectedProducts([]);
  
    // Update the selected product brand
    setSelectedCategory(selectedBrand);
  };
  const handleSubCategoryChange = (e) => {
    const selectedBrand = e.target.value;
  
    // Reset the other fields
    setSelectedSuperSubCategory('');
    setSelectedProducts([]);
  
    // Update the selected product brand
    setSelectedSubCategory(selectedBrand);
  };
  const handleSuperSubCategoryChange = (e) => {
    const selectedBrand = e.target.value;
  
    // Reset the other fields
    setSelectedProducts([]);
  
    // Update the selected product brand
    setSelectedSuperSubCategory(selectedBrand);
  };







  const resetButton = () => {
   handleCancel();
  }

  const handleSave = () => {
    saveEditOffer()
  }

  const handleCancel = () => {
    setIsEditable(false)
    setEditData({})
  }

  function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const handleEditOffer = (e) => {
    const {name, value} = e.target;
    switch (name) {
      case "category_id":
        setSelectedCategory(value)
        break;
        case "sub_category_id":
          setSelectedSubCategory(value)
          break;
          case "super_sub_category_id":
            setSelectedSuperSubCategory(value)
            break;
            case "product_brand_id":
              setSelectedProductBrand(value)
              break
    
      default:
        break;
    }
    setEditData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // const saveEditOffer = async () => {
  //  const {createdAt,product_id, updatedAt,deletedAt,category,product_brand,product_discount_associations,status,sub_category,super_sub_category,id, ...rest} = editData
  //   console.log("save", rest)
  //   const productsPayload = JSON.stringify(selectedOptions)
  //   const editDiscountPayload = {
  //     discount_id: id,
  //     image: image,
  //     products: productsPayload,
  //     ...rest
  //   }
  //   console.log("save", editDiscountPayload)
  //   try {
  //     const res = await axios.post("/api/edit-discounts", editDiscountPayload, {
  //       headers: {
  //         "Content-Type": "multipart/form-data"
  //       }
  //     });
  //     console.log(res.data, "sdfdsfkfs")
  //     if(res.data.status === "success") {
  //       console.log(res.data, "edit-discount-data")
  //       openSnackbar(res.data.message, "success")
  //       setIsEditable(false);
  //       fetchDiscountsData();
  //     }
  //   } catch (error) {
  //     console.log(error, "could not edit data")
  //   }
   
  // }

  const saveEditOffer = async () => {
    try {
      // Destructure and exclude unnecessary fields from editData
      const {
        createdAt,
        updatedAt,
        deletedAt,
        category,
        product_brand,
        product_discount_associations,
        status,
        sub_category,
        super_sub_category,
        id,
        image:prviousImagePath,
        ...rest
      } = editData;
  
      console.log("save", rest.product_brand_id);
  
      // Prepare products payload
      const productsPayload = JSON.stringify(selectedOptions);
  
      // Prepare the edit discount payload
      const editDiscountPayload = new FormData();
      editDiscountPayload.append("discount_id", id);
      if(showImage) {
        editDiscountPayload.append("image", image);
      }
     
      editDiscountPayload.append("products", productsPayload);
  
      // Append rest of the fields to the FormData if they have a value and are valid
  Object.keys(rest).forEach((key) => {
    const value = rest[key];
    if (value !== undefined && value !== null && value !== '') {
      // For numeric fields, ensure they are valid numbers
      if (['product_brand_id', 'category_id', 'sub_category_id', 'super_sub_category_id', 'discount', 'min_amount', 'max_amount'].includes(key)) {
        if (!isNaN(value)) {
          editDiscountPayload.append(key, value);
        }
      } else if(key !== "image") {
        editDiscountPayload.append(key, value);
      }
    }
  });
  
      console.log("save", editDiscountPayload);
  
      // Make the axios request
      const res = await axios.post("/api/edit-discounts", editDiscountPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem('onlineKingToken')
        }
      });
  
      console.log(res.data, "response data");
  
      if (res.data.status === "success") {
        console.log(res.data, "edit-discount-data");
        openSnackbar(res.data.message, "success");
        setIsEditable(false);
        fetchDiscountsData();

      }
    } catch (error) {
      console.error("Error editing discount:", error.response?.data || error.message);
      openSnackbar("Could not edit discount. Please try again.", "error");
    }
  };
  

  const editProductChange = (event, value, reason, details) => {
    console.log(value,reason, details ,"edit-value")
    setSelectedOptions(value)
  }

  return (
    <div className='px-[20px]  container mx-auto overflow-y-scroll'>
      {!isEditable ?
        <div className=' py-[10px] flex flex-col space-y-5'>
          <div className='flex flex-col space-y-1'>
            <span className='text-[30px] text-[#101828] font-[500]'>Offers Setup</span>
            <span className='text-[#667085] font-[400] text-[16px]'>Effortless Discount Management for Admin Efficiency.</span>
          </div>

          <div className='grid grid-cols-3 gap-[10px]'>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Offer Name </span>
              <input type='text' placeholder='Discount title' id='discount_name' className='inputText' name='discount_name' value={discountDataInput.discount_name}
                onChange={handleInputChange} />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Product Brands </span>
              <select name='product_brand_id' id='product_brand_id' value={selectedProductBrand} onChange={handleProductBrandChange}>
                <option value=''>Select Product brand Here</option>
                {getAllProductBrands && getAllProductBrands.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.brand_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Category </span>
              <select name='category_id' id='category_id' value={selectedCategory} onChange={handleCategoryChange}>
                <option value=''>Select category  Here</option>
                {getAllCategories && getAllCategories.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.category_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Sub Category </span>
              <select name='sub_category_id' id='sub_category_id' value={selectedSubCategory} onChange={handleSubCategoryChange}>
                <option value=''>Select Sub category Type Here</option>
                {subCategoryData && subCategoryData.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.sub_category_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Super Sub Category </span>
              <select name='super_sub_category_id' id='super_sub_category_id' value={selectedSuperSubCategory} onChange={handleSuperSubCategoryChange}>
                <option value=''>Select Super sub category Here</option>
                {superSubCategoryData && superSubCategoryData.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.super_sub_category_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Product </span>
              {/* <select name='category_id' >
                <option>Select Coupon Type Here</option>
              </select> */}
              <FormControl fullWidth>
                <Autocomplete
                  multiple

                  options={filteredProducts}
                  getOptionLabel={(options) => options.product_name}
                  value={selectedProducts}
                  onChange={handleProductChange}
                  renderOption={(props, option, { selected }) => (
                    <option {...props}>
                      <Checkbox color="primary" checked={selected} />
                      {option.product_name}
                    </option>
                  )}
                  style={{ width: '100%' }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Products"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Discount Type </span>
              <select name='discount_type' id='discount_type' onChange={handleInputChange} value={discountDataInput.discount_type}>
                <option>Select Coupon Type Here</option>
                <option>amount</option>
                <option>percent</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Discount Amount </span>
              <input type='text' placeholder='0' className='inputText' id='discount' name='discount' onChange={handleInputChange} value={discountDataInput.discount} />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Minimum Purchase </span>
              <input type='text' placeholder='0' className='inputText' id='min_amount' name='min_amount' onChange={handleInputChange} value={discountDataInput.min_amount} />
            </div>
            {
              discountDataInput.discount_type === "percent" &&
              <div className='flex flex-col space-y-1 w-full'>
              <span>Maximum Discount </span>
              <input type='text' placeholder='0' className='inputText' id='max_amount' name='max_amount' onChange={handleInputChange} value={discountDataInput.max_amount} />
            </div>
            }
           
            <div className='flex flex-col space-y-1 w-full'>
              <span>Start Date </span>
              <input type='Date' placeholder='Horn' className='inputText' id='start_date' name='start_date' onChange={handleInputChange} value={discountDataInput.start_date} />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Expiry Date </span>
              <input type='Date' placeholder='Horn' className='inputText' id='expiry_date' name='expiry_date' onChange={handleInputChange} value={discountDataInput.expiry_date} />
            </div>

          </div>
          <div className='flex items-end gap-[10px]'>
            <div className='flex flex-col space-y-1 '>
              <span>Offer Image</span>
              <input type='file' accept='image/*' id='image' onChange={handleImageChange} />
            </div>

            {showImage && (
              <div className="relative bg-[#D8C7B6] rounded-[8px]">
                <img src={showImage} alt='Uploaded Preview' width={100} className='rounded-[8px] h-[60px] !w-[60px]' />
                <span onClick={handleRemoveImage} className="absolute top-[-15px] right-0 bg-transparent text-black cursor-pointer">
                  <IoClose />
                </span>
              </div>
            )}
          </div>

          <div className='flex items-center gap-[24px] justify-end'>
            <span className='resetButton' onClick={reset}>Reset</span>
            <span className='submitButton' onClick={addDiscount}>Submit</span>
          </div>


          <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
            <div className='flex items-center px-3 justify-between'>
              <div className='flex space-x-2 items-center'>
                <span className='text-[18px] font-[500] text-[#101828]'>Offers</span>
                <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{discountData.length} Offers</span>
              </div>
              <div className='flex items-center space-x-3 inputText w-[50%]'>
                <IoSearch className='text-[20px]' />
                <input
                  type='text'
                  className='outline-none focus-none w-full'
                  placeholder='Search here'
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
                      <TableCell style={{ minWidth: 100 }}>Sl No</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Title</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Offer Image</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Product Brand</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Category Name</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Discount Type</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Discount</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Maximum</TableCell>
                      <TableCell style={{ minWidth: 250 }}>Duration</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Status</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Change Status</TableCell>
                      <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
                      <TableCell style={{ minWidth: 50 }}>Edit</TableCell>
                    </TableRow>
                  </TableHead>
                  {filteredRows.length > 0 ?
                    <TableBody>
                      {paginatedRows.map((row, i) => (
                        <TableRow key={row.id} >
                          <TableCell>{startIndex + i + 1}</TableCell>
                          <TableCell>
                            {row.discount_name}
                          </TableCell>
                          <TableCell>
                            <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image}`} width={50} height={50} alt={row.category?.category_name} className='rounded-[8px]' />
                          </TableCell>
                          <TableCell>
                            {row.product_brand?.brand_name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {row.category?.category_name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {row.discount_type}
                          </TableCell>
                          <TableCell>
                            {row.discount}
                          </TableCell>
                          <TableCell>
                            {row.max_amount}
                          </TableCell>
                          <TableCell>
                            {row.start_date && row.expiry_date ? (
                              `${formatDate(row.start_date)} - ${formatDate(row.expiry_date)}`
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                          <TableCell>
                            {row.status === true ? (
                              new Date() > new Date(new Date(row.expiry_date).setDate(new Date(row.expiry_date).getDate() + 1)) ? (
                                <div className='flex items-center gap-[5px] py-[5px] bg-gray-200 rounded-[16px] justify-center'>
                                  <Image src="/images/expired.svg" height={10} width={10} alt='expired' />
                                  <span className='text-gray-500 text-[12px] font-[500]'>Expired</span>
                                </div>
                              ) : (
                                <div className='flex items-center gap-[5px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center'>
                                  <Image src="/images/active.svg" height={10} width={10} alt='active' />
                                  <span className='text-[#027A48] text-[12px] font-[500]'>Active</span>
                                </div>
                              )
                            ) : (
                              <div className='flex items-center gap-[5px] py-[5px] bg-red-200 rounded-[16px] justify-center'>
                                <Image src="/images/inactive.svg" height={10} width={10} alt='inactive' />
                                <span className='text-red-500 text-[12px] font-[500]'>Inactive</span>
                              </div>
                            )}
                          </TableCell>

                          <TableCell>
                            <Switch
                              checked={row.status === true}
                              onChange={() => handleSwitchChange(row.id)}
                              inputProps={{ 'aria-label': 'controlled' }}
                              sx={{
                                '& .MuiSwitch-thumb': {
                                  backgroundColor: row.status === true ? '#CFAA4C' : '',
                                },
                                '& .Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: '#CFAA4C',
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell ><FaRegTrashAlt className='cursor-pointer' onClick={() => deleteDiscount(row)} /></TableCell>
                          <TableCell><FaEdit className='cursor-pointer' onClick={() => handleEdit(row)} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    :
                    <TableRow>
                      <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No Discounts found</TableCell>
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

        </div>
        :
        <div className=' py-[10px] flex flex-col space-y-5'>
          <div className='flex flex-col space-y-1'>
            <span className='text-[30px] text-[#101828] font-[500]'>Discount Edit</span>
            <span className='text-[#667085] font-[400] text-[16px]'>Effortless Discount Management for Admin Efficiency.</span>
          </div>

          <div className='grid grid-cols-3 gap-[10px]'>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Name </span>
              <input type='text' placeholder='Horn' className='inputText' onChange={handleEditOffer} value={editData.discount_name} name='discount_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Brands </span>
              <select name='product_brand_id' id='edit_product_brand_id' onChange={handleEditOffer} value={editData.product_brand_id} >
                <option value="">Select Product brand Here</option>
                {getAllProductBrands && getAllProductBrands.map((e, i) =>
                  <option key={i} value={e.id}>{e.brand_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Category </span>
              <select name='category_id' id='category_id' value={editData?.category_id || ''} onChange={handleEditOffer}>
                <option value=''>Select category  Here</option>
                {getAllCategories && getAllCategories.map((e, i) =>
                  <option key={i} value={e.id}>{e.category_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Sub Category </span>
              <select name='sub_category_id' id='sub_category_id' value={editData?.sub_category_id || ''} onChange={handleEditOffer}>
                <option value=''>Select Sub category Type Here</option>
                {subCategoryData && subCategoryData.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.sub_category_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Super Sub Category </span>
              <select name='super_sub_category_id' id='super_sub_category_id' value={editData?.super_sub_category_id || ''} onChange={handleEditOffer}>
                <option value=''>Select Super sub category Here</option>
                {superSubCategoryData && superSubCategoryData.filter(e => e.status).map((e, i) =>
                  <option key={i} value={e.id}>{e.super_sub_category_name}</option>
                )}
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
  <span>Product </span>
  {
    editProductDiscountAssociations.length > 0 ? (
      <FormControl fullWidth>
        {/* <span>{JSON.stringify(selectedOptions)}</span> */}
       
        <Autocomplete
          multiple
          options={editProductDiscountAssociations}
          getOptionLabel={(option) => option.product_name}
          value={selectedOptions}
          onChange={(event, value, reason, details) => editProductChange(event, value, reason, details)}
          isOptionEqualToValue={(option, value) => option.product_id === value.product_id}
          renderOption={(props, option, { selected }) => (
            <li key={option.id} {...props}>
              <Checkbox color="primary" checked={selected}/>
              {option.product_name}
            </li>
          )}
          style={{ width: '100%' }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Products"
              variant="outlined"
            />
          )}
        />
      </FormControl>
    ) : (
      <p>No products available for selection.</p>
    )
  }
</div>

            <div className='flex flex-col space-y-1 w-full'>
                <span>Discount Type </span>
                <select name='discount_type' value={editData.discount_type || ''} onChange={handleEditOffer} >
                    <option value=''>Select Discount Type Here</option>
                    <option value='amount'>Amount</option>
                    <option value="percent">Percent</option>
                </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
                <span>Discount Amount </span>
                <input type='text' placeholder='Discount Amount' className='inputText' id='discount' name='discount'  value={editData.discount || ''} onChange={handleEditOffer} />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
                <span>Minimum Purchase </span>
                <input type='text' placeholder='Minimum Purchase' className='inputText' id='min_amount' name='min_amount'  value={editData.min_amount || ''} onChange={handleEditOffer} />
            </div>
            {
              editData.discount_type === "percent" &&

              <div className='flex flex-col space-y-1 w-full'>
              <span>Maximum Discount </span>
              <input type='text' placeholder='Maximum Discount' className='inputText' id='max_amount' name='max_amount'  value={editData.max_amount || ''} onChange={handleEditOffer} />
          </div>
            }
           

            <div className='flex flex-col space-y-1 w-full'>
                <span>Start Date </span>
                <input type='Date' placeholder='Start Date' className='inputText' id='start_date' name='start_date'  value={editData.start_date ? new Date(editData.start_date).toISOString().substr(0, 10) : ''} onChange={handleEditOffer}/>
            </div>

            <div className='flex flex-col space-y-1 w-full'>
                <span>Expiry Date </span>
                <input type='Date' placeholder='Expiry Date' className='inputText' id='expiry_date' name='expiry_date'  value={editData.expiry_date ? new Date(editData.expiry_date).toISOString().substr(0, 10) : ''}  onChange={handleEditOffer}/>
            </div>
          </div>

          <div className='flex items-end gap-[10px]'>
            <div className='flex flex-col space-y-1 '>
              <span>Offer Image</span>
              <input type='file' accept='image/*' id='image' onChange={handleImageChange} />
            </div>

            <div className="relative bg-[#D8C7B6] rounded-[8px]">
                <img src={!showImage ?` ${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${editData.image}`: showImage} alt='Uploaded Preview' width={100} className='rounded-[8px] h-[60px] !w-[60px]' />
                <span onClick={handleRemoveImage} className="absolute top-[-15px] right-0 bg-transparent text-black cursor-pointer">
                  <IoClose />
                </span>
              </div>
          </div>

          <div className='flex items-center gap-[24px] justify-end'>
            <span className='resetButton' onClick={resetButton}>Back</span>
            <span className='submitButton' onClick={saveEditOffer}>Submit</span>
          </div>
        </div>
      }
    </div>
  )
}

export default Discounts