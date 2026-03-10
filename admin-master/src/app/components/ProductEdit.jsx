import {
  Autocomplete,
  Checkbox,
  Chip,
  FormControl,
  TextField,
} from "@mui/material";
import axios from "../../../axios";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { useSnackbar } from "../SnackbarProvider";
import { EditAttributes } from "@mui/icons-material";
import EditCombination from "./EditCombination";
import { getAttributes, getFeatures } from "../api";

const CustomEditor = dynamic(() => import("../custom-editor"), { ssr: false });

const ProductEdit = ({
  editData,
  setEditData,
  setIsEditable,
  productBrandData,
  fetchProduct,
}) => {
  // useEffect(() => {
  //   if (editData.category_id) {
  //     setSelectedCategory(editData.category_id);
  //     fetchSubCategoryData(editData.category_id);
  //   }
  // }, [editData.category_id]);

  const { openSnackbar } = useSnackbar();
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [superSubCategoryData, setSuperSubCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedSuperSubCategory, setSelectedSuperSubCategory] =
    useState(null);
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  //image handlling state
  const fileInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [deletedImageList, setDeletedImageList] = useState([]);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  //Edit combination state
  const [allAttributes, setAllAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState({});
  const [data, setData] = useState({});

  console.log(editData, "editData");

  const [getEditProductData, setGetEditProductData] = useState({
    product_name: "",
    product_desc: "",
    product_brand_id: "",
    category_id: "",
    sub_category_id: "",
    super_sub_category_id: "",
    exchange_policy: "",
    minimum_order: "",
    default_price: "",
    stock: "",
    discount_type: "",
    discount: "",
    tax_type: "",
    tax_rate: "",
    quantity: "",
    has_warranty: "",
    weight: "",
    warranty: "",
  });

  const [editEditorData, setEditEditorData] = useState("");

  // Load initial data
  useEffect(() => {
    fetchCategory();
    if (editData.category_id) {
      setSelectedCategory(editData.category_id);
      fetchSubCategoryData(editData.category_id);
    }

    if (editData.sub_category_id) {
      setSelectedSubCategory(editData.sub_category_id);
      fetchSuperSubCategoryData(editData.sub_category_id);
    }
    if (editData.super_sub_category_id) {

      setSelectedSuperSubCategory(editData.super_sub_category_id);
    }

    if(editData.features_associations) {
      setSelectedFeatures(editData.features_associations.map((item) => item.feature))
    }

    //if (editData.atributes) setSelectedAttribute(() => [...editData.atributes]);

    setGetEditProductData({
      product_name: editData.product_name,
      product_desc: editData.product_desc,
      product_brand_id: editData.product_brand_id,
      minimum_order: editData.minimum_order,
      default_price: editData.default_price,
      stock: editData.stock,
      discount_type: editData.discount_type,
      discount: editData.discount,
      pre_order_stock: editData.pre_order_stock,
      tax_type: editData.tax_type,
      tax_rate: editData.tax_rate,
      quantity: editData.quantity,
      weight: editData.weight,
      warranty: editData.warranty,
      has_exchange_policy: editData.has_exchange_policy,
      exchange_policy: editData.exchange_policy,
      has_cancellaton_policy: editData.has_cancellaton_policy,
      cancellation_policy: editData.cancellation_policy,
      pre_order_availability: editData.pre_order_availability,
      pre_order_limit:editData.pre_order_limit,
      pre_order_stock:editData.pre_order_stock,
      estd_pre_order_processing_time: editData.estd_pre_order_processing_time

    });

    const fetchAttributes = async () => {
      const attr = await getAttributes();
      if (Array.isArray(attr)) {
        setAllAttributes(attr);
      }
    };
    fetchAttributes();

    const fetchFeatures = async () => {
      const feature = await getFeatures();
      if (Array.isArray(feature)) {
        console.log(feature, "feature");
        setFeatures(feature);
      }
    };
    fetchFeatures();
    // Set selected attributes based on combination
    setSelectedAttribute(
      transformCombinationData(editData.product_attributes_associations)
    );

    // Prepopulate field data with combination price/stock
    const combinationMaps = editData.product_attributes_associations.reduce(
      (obj, item) => {
        if(editData.pre_order_availability) {
          obj[`${item.combination}_price`] = item.price;
          obj[`${item.combination}_stock`] = item.stock;
          obj[`${item.combination}_pre_order_stock`] = item.pre_order_stock;
          obj[`${item.combination}_pre_order_limit`] = item.pre_order_limit;

          return obj;
        } else {
          obj[`${item.combination}_price`] = item.price;
          obj[`${item.combination}_stock`] = item.stock;
          return obj;
        }
       
      },
      {}
    );
    console.log(combinationMaps, "combination-map");
    setData(combinationMaps);
  }, []);



  const handleEditEditorChange = (data) => {
    console.log("description-data", data);
    setEditEditorData(data);
    getEditProductData.product_desc = data;
  };
  const handleEditExchEditorChange = (data) => {
    console.log("description-data", data);
    // setEditEditorData(data);
    getEditProductData.exchange_policy = data;
  };

  // Fetch categories, subcategories, and super subcategories
  const fetchCategory = async () => {
    try {
      const response = await axios.get("/api/fetch-categories", {
        headers: { Authorization: localStorage.getItem("onlineKingToken") },
      });
      setCategoryData(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategoryData = useCallback(async (categoryId) => {
    try {
      const response = await axios.get(
        `/api/fetch-subcategories?category_id=${categoryId}`,
        {
          headers: { Authorization: localStorage.getItem("onlineKingToken") },
        }
      );
      setSubCategoryData(response.data.subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  }, []);

  const fetchSuperSubCategoryData = useCallback(async (subCategoryId) => {
    try {
      const response = await axios.get(
        `/api/fetch-supersubcategories?sub_category_id=${subCategoryId}`,
        {
          headers: { Authorization: localStorage.getItem("onlineKingToken") },
        }
      );
      setSuperSubCategoryData(response.data.superSubcategories);
    } catch (error) {
      console.error("Error fetching super subcategories:", error);
    }
  }, []);

  // Image handling
  // const handleFileChange = (event) => {
  //     const files = Array.from(event.target.files);
  //     const imageDataUrls = files.map((file) => URL.createObjectURL(file));
  //     setNewImages((prevImages) => [...prevImages, ...imageDataUrls]);
  // };

  // const handleImageRemove = (index) => {
  //     setEditData((prevData) => {
  //         const updatedImages = prevData.images.filter((_, i) => i !== index);
  //         return { ...prevData, images: updatedImages };
  //     });
  // };

  const handleButtonClick = () => {
    console.log(uploadedImages, "uploadedImafes--------");
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    const newImages = [...images];

    console.log(uploadedImages, "uploaded-Images----");

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        newImages.push(file);
        setUploadedImages((prevImages) => [...prevImages, e.target.result]);
        setImages(newImages);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (index) => {
    const removeImageList = deletedImageList;
    removeImageList.push(editData.images[index].id);
    setDeletedImageList(removeImageList);

    // console.log(index, 'index-------')
    setEditData((prevData) => {
      const updatedImages = prevData.images.filter((_, i) => i !== index);
      return { ...prevData, images: updatedImages };
    });
    console.log(editData, "editData");
  };

  //Image handling end

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    fetchSubCategoryData(e.target.value);
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
    fetchSuperSubCategoryData(e.target.value);
  };

  const getData = (e) => {
    const { value, name } = e.target;
    setGetEditProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  // const getEditCombinationData = (data) => {
  //     setGetEditProductData((prev) => ({ ...prev, combinations: data }));
  // };

  //edit attributes logic----------

  const transformCombinationData = (input) => {
    const attributeMap = {};

    // Loop through each combination
    input.forEach((item) => {
      item.attributes_combinations.sort((a, b) => b.attribute_id - a.attribute_id).forEach((attribute) => {
        const attributeName = attribute.product_attribute.attribute_name;
        const attributeValue = attribute.attribute_value;

        // If the attribute name doesn't exist in the map, initialize it
        if (!attributeMap[attributeName]) {
          attributeMap[attributeName] = new Set();
        }

        // Add the attribute value to the set
        attributeMap[attributeName].add(attributeValue);
      });
    });

    // Convert the map to the desired format (attribute_name and attribute_options)
    const attributes = Object.keys(attributeMap).map((attributeName) => ({
      attribute_name: attributeName,
      attribute_options: Array.from(attributeMap[attributeName]),
    }));

    return { attributes };
  };

  const handleProductChange = (evt, value) => {
    setSelectedAttribute({
      attributes: value.map((product) => ({
        attribute_name: product.attribute_name,
        attribute_options: [],
      })),
    });
  };

  const handleInputChange = (event, attributeIndex) => {
    const { value } = event.target;
    setSelectedAttribute((prevData) => {
      const updatedAttributes = [...prevData.attributes];
      updatedAttributes[attributeIndex].attribute_options = value
        .split(",")
        .map((option) => option.trim());
      return { ...prevData, attributes: updatedAttributes };
    });
  };

  const handleDeleteOption = (attributeIndex, option) => {
    setSelectedAttribute((prevData) => {
      const updatedAttributes = [...prevData.attributes];
      updatedAttributes[attributeIndex].attribute_options = updatedAttributes[
        attributeIndex
      ].attribute_options.filter((item) => item !== option);
      console.log(updatedAttributes, "updatedAttributes");
      return { ...prevData, attributes: updatedAttributes };
    });
  };

  const generateCombinations = (attributes) => {
    const combinations = [];
    const attributeOptions = attributes
      ? attributes.map((attr) => attr.attribute_options)
      : [];

    const generate = (index, combination) => {
      if (index === attributes?.length) {
        combinations.push(combination.join("-"));
        return;
      }
      if (
        Array.isArray(attributeOptions[index]) &&
        attributeOptions[index].length > 0
      ) {
        for (const option of attributeOptions[index]) {
          generate(index + 1, [...combination, option]);
        }
      }
    };

    generate(0, []);
    return combinations;
  };

  // const generateFieldData = (combinations) => {
  //   return combinations.map((combination) => {
  //     const fields = [
  //       { label: "price", name: `${combination}_price`, type: "text" },
  //       { label: "stock", name: `${combination}_stock`, type: "text" },
  //     ];

  //     return { combination, fields };
  //   });
  // };

  const generateFieldData = (combinations) => {
    return combinations.map((combination) => {
      if(getEditProductData.pre_order_availability) {
        const fields = [
          { label: "price", name: `${combination}_price`, type: "text" },
          { label: "stock", name: `${combination}_stock`, type: "text" },
          { label: "pre order stock", name: `${combination}_pre_order_stock`, type: "text" },
          { label: "Pre Order Limit", name: `${combination}_pre_order_limit`, type: "text" },
        ];
  
        return { combination, fields };
      } else {
        const fields = [
          { label: "price", name: `${combination}_price`, type: "text" },
          { label: "stock", name: `${combination}_stock`, type: "text" },
        ];
  
        return { combination, fields };
      }
     
    });
  };

  const onChange = (fieldName, value) => {
    setData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const combinations = generateCombinations(selectedAttribute.attributes);
  const fieldData = generateFieldData(combinations);

  const addedAttributeData = fieldData.map((combination) => {
    const priceFieldName = `${combination.combination}_price`;
    const stockFieldName = `${combination.combination}_stock`;

    const preOrderLimit = getEditProductData.pre_order_availability && `${combination.combination}_pre_order_limit`;


    return {
      combinations: combination.combination
        .split("-")
        .map((attribute, index) => {
          const attributeName = selectedAttribute.attributes.find((e) =>
            e.attribute_options.find((el) => el == attribute)
          );
          if (!attributeName) {
            return null;
          }
          const attributeId = allAttributes.find(
            (e) =>
              e.attribute_name.trim().toLowerCase() ==
              attributeName.attribute_name.trim().toLowerCase()
          );
          return {
            attribute_id: attributeId ? attributeId.id : null,
            attribute_value: attribute,
          };
        }),
      combination_name: combination.combination,
      price: data[priceFieldName],
      stock: data[stockFieldName],
      pre_order_limit: preOrderLimit ? data[preOrderLimit] : undefined

    };
  });

  //edit attributes logic end

  const updateProduct = () => {
    const formData = new FormData();

    // Helper function to conditionally append data if it's not null/undefined
    const appendIfValid = (key, value) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    };

    appendIfValid("product_id", editData.id);
    appendIfValid(
      "product_name",
      getEditProductData.product_name || editData.product_name
    );
    appendIfValid("product_desc", getEditProductData.product_desc || editData.product_desc);
    appendIfValid("cancellation_policy", getEditProductData.cancellation_policy || editData.cancellation_policy);

    appendIfValid("exchange_policy", getEditProductData.exchange_policy || editData.exchange_policy);

    if(getEditProductData.pre_order_availability) {
      appendIfValid("pre_order_availability", getEditProductData.pre_order_availability)

      appendIfValid("pre_order_stock", getEditProductData.pre_order_stock)
      appendIfValid("pre_order_limit", getEditProductData.pre_order_limit)
      appendIfValid("estd_pre_order_processing_time", getEditProductData.estd_pre_order_processing_time)


    } else {
      appendIfValid("pre_order_availability", getEditProductData.pre_order_availability)

    }
    appendIfValid(
      "product_brand_id",
      getEditProductData.product_brand_id || editData.product_brand_id
    );
    appendIfValid("category_id", selectedCategory || editData.category_id);
    appendIfValid(
      "sub_category_id",
      selectedSubCategory || editData.sub_category_id
    );
    appendIfValid(
      "super_sub_category_id",
      selectedSuperSubCategory || editData.super_sub_category_id
    );
    appendIfValid(
      "minimum_order",
      getEditProductData.minimum_order || editData.minimum_order
    );
    appendIfValid(
      "default_price",
      getEditProductData.default_price || editData.default_price
    );
    appendIfValid("stock", getEditProductData.stock || editData.stock);
    appendIfValid(
      "discount_type",
      getEditProductData.discount_type || editData.discount_type
    );
    appendIfValid("discount", getEditProductData.discount || editData.discount);
    appendIfValid("tax_type", getEditProductData.tax_type || editData.tax_type);
    appendIfValid("tax_rate", getEditProductData.tax_rate || editData.tax_rate);
    appendIfValid("quantity", getEditProductData.quantity || editData.quantity);
    appendIfValid("warranty", getEditProductData.warranty || editData.warranty);
    appendIfValid("weight", getEditProductData.weight || editData.weight);
    
    if(selectedFeatures.length > 0) {
      const features = JSON.stringify(selectedFeatures)
      appendIfValid("features_associations", features)
    }

    // Append combinations if they exist and are not empty
    // if (getEditProductData.combinations && getEditProductData.combinations.length > 0) {
    //     formData.append("combinations", JSON.stringify(getEditProductData.combinations));
    // }

    if (
      addedAttributeData.filter((e) => e.combinations.filter((el) => el).length)
        .length > 0
    ) {
      const combinationsDataString = JSON.stringify(addedAttributeData);

      appendIfValid("combinations", combinationsDataString);
    }

    appendIfValid("image_count", images.length);

    if (deletedImageList.length) {
      appendIfValid("removeData", JSON.stringify(deletedImageList));
    }

    images.forEach((image, index) => {
      appendIfValid(`image_${index + 1}`, image);
    });

    axios
      .post("/api/edit-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("onlineKingToken"),
        },
      })
      .then((res) => {
        if (res.data.status === "success") {
          openSnackbar(res.data.message, "success");
          setIsEditable(false);
          fetchProduct();
        } else {
          openSnackbar(res.data.message, "error");
        }
      })
      .catch((err) => {
        console.error(err);
        openSnackbar("Failed to update product.", "error");
      });
  };

  // formData.append(
  //   "product_type",
  //   getEditProductData.product_type
  //     ? getEditProductData.product_type
  //     : editData.product_type
  // );

  const handleBack = () => {
    setEditData({});
    setIsEditable(false);
  };



  



  const handleFeatureChange = (event, newValue) => {
    setSelectedFeatures(newValue);
    console.log("newValue", newValue);
  };

  return (
    <>
      <div className=" py-[10px] flex flex-col space-y-5">
        <div className="flex flex-col space-y-1">
          <span className="text-[30px] text-[#101828] font-[500]">
            Edit Product
          </span>
          <span className="text-[#667085] font-[400] text-[16px]">
            Introduce new items effortlessly with the Add New Product feature in
            the admin application for a dynamic and up-to-date online store.
          </span>
        </div>
      </div>

      <div className="flex justify-between gap-[30px]">
        <div className="flex flex-col  border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]">
          <span className="text-[18px] font-[600]">Edit Product</span>
          <div className="flex flex-col space-y-1">
            <span className="text-[14px] text-[#344054] font-[500]">
              Product Name
            </span>
            <input
              type="text"
              className="outline-none focus-none inputText !text-[14px]"
              value={getEditProductData.product_name}
              placeholder="Add new product name"
              name="product_name"
              onChange={getData}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[14px] text-[#344054] font-[500]">
              Description
            </span>
            <CustomEditor
              initialData={getEditProductData.product_desc}
              name="product_desc"
              onChange={handleEditEditorChange}
            />
          </div>
          
          <div className="flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]">
            <span className="text-[18px] font-[600]">
              Product Features Info
            </span>
            <Autocomplete
              multiple
              options={features}
              value={selectedFeatures}
              getOptionLabel={(option) => option?.feature_name}
              isOptionEqualToValue={(option, value) =>
                option?.id === value?.id
              }
              
              onChange={(e, value) => handleFeatureChange(e, value)}
              renderOption={(props, option, { selected }) => {
                const { key, ...rest } = props;
                return (
                  <li key={key} {...rest}>
                    {" "}
                    {/* Apply the key prop separately */}
                    <Checkbox color="primary" checked={selected} />
                    {option.feature_name}
                  </li>
                );
              }}
              style={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Features"
                  variant="outlined"
                />
              )}
            />
          </div>
         
        </div>
        <div className="flex flex-col border space-y-3 border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]">
          <span className="text-[18px] font-[600]">Category & Brand Set-up</span>
          <div className="flex flex-col space-y-1">
            <span className="text-[14px] text-[#344054] font-[500]">
              Select Main Category
            </span>
            <select
              className="!text-[14px]"
              id="edit_category_id"
              name="edit_category_id"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Choose Category</option>
              {categoryData &&
                categoryData
                  .filter((e) => e.status)
                  .map((e, i) => (
                    <option key={i} value={e.id}>
                      {e.category_name}
                    </option>
                  ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[14px] text-[#344054] font-[500]">
              Select Sub Category
            </span>
            <select
              className="!text-[14px]"
              id="edit_sub_category_id"
              name="edit_sub_category_id"
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
            >
              {/* <option value=''>Choose Sub Category</option> */}
              {subCategoryData &&
                subCategoryData
                  .filter((e) => e.status)
                  .map((e, i) => (
                    <option key={i} value={e.id}>
                      {e.sub_category_name}
                    </option>
                  ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[14px] text-[#344054] font-[500]">
              Select Super Sub Category
            </span>
            <select
              className="!text-[14px]"
              id="edit_super_sub_category_id"
              name="super_sub_category_id"
              value={selectedSuperSubCategory}
              onChange={(e) => setSelectedSuperSubCategory(e.target.value)}
            >
              <option value="">Choose Super Sub Category</option>
              {superSubCategoryData &&
                superSubCategoryData
                  .filter((e) => e.status)
                  .map((e, i) => (
                    <option key={i} value={e.id}>
                      {e.super_sub_category_name}
                    </option>
                  ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[14px] text-[#344054] font-[500]">
              {" "}
              Product Brand Name
            </span>
            <select
              className="!text-[14px]"
              name="product_brand_id"
              value={getEditProductData.product_brand_id}
              onChange={getData}
            >
              <option>Choose Product Brand</option>
              {productBrandData &&
                productBrandData
                  .filter((e) => e.status)
                  .map((e, i) => (
                    <option key={i} value={e.id}>
                      {e.brand_name}
                    </option>
                  ))}
            </select>
          </div>
          {/* <div className="flex flex-col space-y-1">
            <span className="text-[14px] text-[#344054] font-[500]">
              Maximum Order Quantity
            </span>
            <input
              type="text"
              className="outline-none focus-none inputText !text-[14px]"
              value={getEditProductData.minimum_order}
              placeholder="Ex: 05"
              name="minimum_order"
              onChange={getData}
            />
           
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[14px] text-[#344054] font-[500]">
              Product Weight{" "}
              <span className="text-red-500 font-[400] text-[12px]">
                (1.5kg = 1.5 & 1kg = 1 & 500gm = 0.5)
              </span>{" "}
              in this format
            </span>
            <input
              type="text"
              className="outline-none focus-none inputText !text-[14px]"
              value={getEditProductData.weight}
              placeholder="Ex: 05"
              name="weight"
              onChange={getData}
            />
          </div> */}
           <div className="flex flex-col border space-y-3 border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]">
                  <span className="text-[18px] font-[600]">
                    Pre Order Set-up
                  </span>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <span className="text-[14px] text-[#344054] font-[500]">
                        Pre Order Availability
                      </span>
                      <input
                        type="checkbox"
                        checked={getEditProductData.pre_order_availability} // This should now reflect the updated state
                        className="outline-none focus:outline-none p-2"
                        name="pre_order_availability"
                        onChange={(e) => setGetEditProductData((prev) => ({...prev, [e.target.name]:e.target.checked}))} // Updates state on change
                      />
                    </div>

                    {getEditProductData.pre_order_availability && (
                      <>
                        <span className="text-[14px] text-[#344054] font-[500]">
                          Pre Order Limit Per User
                        </span>
                        <input
                          type="text"
                          className="outline-none focus-none inputText !text-[14px]"
                          placeholder="Ex: 05"
                          value={getEditProductData.pre_order_limit}
                          name="pre_order_limit"
                          onChange={getData}
                        />
                        <span className="text-[14px] text-[#344054] font-[500]">
                          Pre Order Stock
                        </span>
                        <input
                          type="text"
                          className="outline-none focus-none inputText !text-[14px]"
                          placeholder="Ex: 05"
                          value={getEditProductData.pre_order_stock}
                          name="pre_order_stock"
                          onChange={getData}
                        />

                        <span className="text-[14px] text-[#344054] font-[500]">
                          Estimated Processing Duration
                        </span>
                        <input
                          type="text"
                          className="outline-none focus-none inputText !text-[14px]"
                          placeholder="Ex: 05"
                          value={getEditProductData.estd_pre_order_processing_time}
                          name="estd_pre_order_processing_time"
                          onChange={getData}
                        />
                      </>
                    )}
                  </div>
                </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-[30px]">
        <div className="flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]">
          <span className="text-[18px] font-[600]">Product Image</span>
          <div className="flex flex-col items-center justify-center text-[16px]">
            <div className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full">
              <div className="text-[40px]">
                <FaCloudUploadAlt />
              </div>
              <header className="text-[10px] font-semibold">
                Drag & Drop to Upload File
              </header>
              <span className="mt-2 text-[10px] font-bold">OR</span>
              <button
                className="text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300"
                onClick={handleButtonClick}
              >
                Click to Upload
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
            </div>
            <div className="flex flex-wrap items-center mt-3">
              {/* Render existing images */}
              {editData.images.map((imageDataUrl, index) => (
                <div key={index} className="p-2 relative">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${imageDataUrl.image_url}`}
                    alt={`Uploaded ${index + 1}`}
                    className="max-w-[80px] max-h-[80px]"
                  />
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    onClick={() => handleImageRemove(index)}
                  >
                    <FaTimes className="text-[10px]" />
                  </button>
                </div>
              ))}
              {/* Render newly added images */}
              {uploadedImages.map((imageDataUrl, index) => (
                <div key={index} className="p-2 relative">
                  <img
                    src={imageDataUrl}
                    className="max-w-[80px] max-h-[80px]"
                  />
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    onClick={() =>
                      setUploadedImages((prevImages) =>
                        prevImages.filter((_, i) => i !== index)
                      )
                    }
                    //onClick={() => console.log(index, 'index')}
                  >
                    <FaTimes className="text-[10px]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]">
          <span className="text-[18px] font-[600]">Price Info</span>
          <div className="flex items-center justify-between gap-[10px]">
            <div className="flex flex-col space-y-1 w-full">
              <span className="text-[14px] text-[#344054] font-[500]">
                Default Unit Price
              </span>
              <input
                type="text"
                className="outline-none focus-none inputText !text-[14px]"
                value={getEditProductData.default_price}
                placeholder="Price of product (in rupees)"
                name="default_price"
                onChange={getData}
              />
            </div>
            <div className="flex flex-col space-y-1 w-full">
              <span className="text-[14px] text-[#344054] font-[500]">
                Product Stock
              </span>
              <input
                type="text"
                className="outline-none focus-none inputText !text-[14px]"
                placeholder="stock"
                value={getEditProductData.stock}
                name="stock"
                onChange={getData}
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-[10px]">
            <div className="flex flex-col space-y-1 w-full">
              <span className="text-[14px] text-[#344054] font-[500]">
                Discount Type
              </span>
              <select
                className="!text-[14px] outline-none focus-none"
                name="discount_type"
                value={getEditProductData.discount_type}
                onChange={getData}
              >
                <option value="0">Select Discount Type</option>
                <option value="percent">Percent</option>
                <option value="amount">Amount</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1 w-full">
              <span className="text-[14px] text-[#344054] font-[500]">
                Discount
              </span>
              <input
                type="text"
                className="outline-none focus-none inputText !text-[14px]"
                value={getEditProductData.discount}
                placeholder="0"
                name="discount"
                onChange={getData}
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-[10px]">
            <div className="flex flex-col space-y-1 w-full">
              <span className="text-[14px] text-[#344054] font-[500]">
                Tax Type
              </span>
              {/* <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Add new product name' /> */}
              <select
                className="!text-[14px] outline-none focus-none"
                name="tax_type"
                value={getEditProductData.tax_type}
                onChange={getData}
              >
                <option value="0">Select Tax Type</option>
                <option value="percent">Percent</option>
                {/* <option value='amount'>Amount</option> */}
              </select>
            </div>
            <div className="flex flex-col space-y-1 w-full">
              <span className="text-[14px] text-[#344054] font-[500]">
                Tax rate
              </span>
              <input
                type="text"
                className="outline-none focus-none inputText !text-[14px]"
                placeholder="0"
                value={getEditProductData.tax_rate}
                onChange={getData}
                name="tax_rate"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between gap-[30px]">
      <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Net Quantity and warranty info</span>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Net Quantity</span>
                  <input type='text' value={getEditProductData.quantity} className='outline-none focus-none inputText !text-[14px]' placeholder='06' name='quantity' onChange={getData} />
                </div>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Warranty</span>
                  <input type='text' value={getEditProductData.warranty} className='outline-none focus-none inputText !text-[14px]' name='warranty' placeholder='06' onChange={getData} />
                </div>
                <div className='flex items-end gap-[10px]'>
                  {/* <div className='flex items-center gap-[20px] justify-between w-full'>
                    <span className='px-[10px] py-[10px] rounded-[8px] border border-[#D0D5DD] w-full text-center text-[16px] font-[600] bg-[#fff] cursor-pointer'>No</span>
                    <span className='px-[10px] py-[10px] rounded-[8px] text-[#fff] w-full text-center text-[16px] font-[600] bg-[#CFAA4C] hover:opacity-80 cursor-pointer'>Yes, there is</span>
                  </div> */}
                </div>
              </div>
        <div className="flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]">
          <span className="text-[18px] font-[600]">Product Details Description</span>
          <div className="flex flex-col space-y-1">
            <span className="text-[14px] text-[#344054] font-[500]">
              Description
            </span>
            <CustomEditor
              initialData={getEditProductData.exchange_policy}
              name="exchange_policy"
              className="outline-none focus-none inputText !text-[14px] h-[190px]"
              placeholder="Add description"
              onChange={handleEditExchEditorChange}
            />
          </div>
          {/* <CustomEditor
              initialData={getEditProductData.product_desc}
              name="product_desc"
              onChange={handleEditEditorChange}
            /> */}
        </div>
        {/* <div className="flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]">
          <span className="text-[18px] font-[600]">Cancellation Policy</span>
          <div className="flex flex-col space-y-1">
            <span className="text-[14px] text-[#344054] font-[500]">
              Description
            </span>
            <textarea
              name="cancellation_policy"
              className="outline-none focus-none inputText !text-[14px] h-[190px]"
              value={getEditProductData.cancellation_policy}
              placeholder="Add description"
              onChange={getData}
            />
          </div>
        </div> */}
      </div>

      {/* <EditCombination 
            onEditCombination={getEditCombinationData} 
            combination={editData.product_attributes_associations}
            /> */}
      {/* Edit Combination features */}
      <div className="flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]">
        <span className="text-[18px] font-[600]">Attribute</span>
        <div className="flex flex-col space-y-3 w-full">
          <span className="text-[14px] text-[#344054] font-[500]">
            Attributes
          </span>
          <FormControl fullWidth>
            <Autocomplete
              disabled
              multiple
              options={allAttributes}
              getOptionLabel={(option) => option.attribute_name}
              value={selectedAttribute.attributes || []}
              isOptionEqualToValue={(option, value) =>
                option.attribute_name === value.attribute_name
              }
              onChange={handleProductChange}
              renderOption={(props, option, { selected }) => {
                const { key, ...rest } = props; // Extract the `key` prop
                return (
                  <li key={key} {...rest}>
                    {" "}
                    
                    <Checkbox color="primary" checked={selected} />
                    {option.attribute_name}-{option.id}
                  </li>
                );
              }}
              style={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Attributes"
                  variant="outlined"
                />
              )}
            />
          </FormControl>
          {selectedAttribute.attributes &&
            Array.isArray(selectedAttribute.attributes) &&
            selectedAttribute.attributes.map((attribute, attributeIndex) => (
              <>
                <div
                  key={attributeIndex}
                  className="flex items-end space-y-2 mt-2"
                >
                  <span className="text-[14px] text-[#344054] font-[500] w-[20%]">
                    {attribute.attribute_name}
                  </span>

                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {attribute.attribute_options.map(
                        (option, optionIndex) => (
                          <Chip
                            key={`${attributeIndex}-${option}`}
                            label={option}
                            onDelete={() =>
                              handleDeleteOption(attributeIndex, option)
                            }
                            variant="outlined"
                            sx={{
                              backgroundColor: "#cfaa4d",
                              color: "white",
                              borderColor: "#cfaa4d",
                              "&:hover": {
                                backgroundColor: "#b9912d",
                                color: "white",
                              },
                              "& .MuiChip-deleteIcon": {
                                color: "white",
                                "&:hover": {
                                  color: "#ffffffbf",
                                },
                              },
                            }}
                          />
                        )
                      )}
                    </div>
                    <FormControl fullWidth>
                      <span className="text-[10px] font-[500]">
                        Note: Enter{" "}
                        <span className="text-red-700">coma ( , )</span> to
                        create new {attribute.attribute_name}
                      </span>
                      <input
                        placeholder={`Enter ${attribute.attribute_name}`}
                        className="w-[100%] inputText focus-none outline-none !text-[14px] !text-[#354154]"
                        value={attribute.attribute_options.join(", ")}
                        onChange={(event) =>
                          handleInputChange(event, attributeIndex)
                        }
                      />
                    </FormControl>
                  </div>
                </div>
              </>
            ))}
          {fieldData &&
            fieldData.map((data1) => (
              <div
                key={data1.combination}
                className="flex items-end text-[#354154] font-[500] text-[14px] space-x-3"
              >
                {data1.combination !== "" ? (
                  <>
                    <h3 className="w-[20%] font-[600]">{data1.combination}</h3>
                    {data1.fields.map((field, index) => (
                      <div key={index} className="flex flex-col w-[30%]">
                        <label>{field.label}</label>
                        <input
                          className="inputText outline-none focus-none !text-[14px]"
                          placeholder={
                            field.label === "price"
                              ? "Enter Price"
                              : field.label === "stock"
                              ? "Enter Stock"
                              : "Enter Value"
                          }
                          type={field.type}
                          name={field.name}
                          value={data[field.name]}
                          onChange={(e) => onChange(field.name, e.target.value)}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <span className="text-center text-[12px] font-[500] w-full">
                    Choose Attributes For The Combination
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="flex items-center gap-[30px] justify-end">
        <span
          className="px-[38px] py-[10px] rounded-[8px] border border-[#D0D5DD] text-[16px] text-[#344054] font-[600] cursor-pointer"
          onClick={handleBack}
        >
          Back to product list
        </span>
        <span
          className="px-[38px] py-[10px] rounded-[8px] text-[16px] text-[#fff] font-[600] bg-[#CFAA4C] hover:opacity-80 cursor-pointer"
          onClick={updateProduct}
        >
          Update Product
        </span>
      </div>
    </>
  );
};
export default ProductEdit;
