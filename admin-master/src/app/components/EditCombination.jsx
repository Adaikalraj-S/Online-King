"use client";
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  Chip,
  Checkbox,
} from "@mui/material";
import { getAttributes } from "../api";

const EditCombination = ({ combination, onEditCombination }) => {


  const transformCombinationData = (input) => {
    const attributeMap = {};

    // Loop through each combination
    input.forEach((item) => {
      item.attributes_combinations.forEach((attribute) => {
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

  const [allAttributes, setAllAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState({});
  const [data, setData] = useState({});

  // Update selected product attributes
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
      console.log(updatedAttributes, "updatedAttributes")
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

  const generateFieldData = (combinations) => {
    return combinations.map((combination) => {
      const fields = [
        { label: "price", name: `${combination}_price`, type: "text" },
        { label: "stock", name: `${combination}_stock`, type: "text" },
      ];

      return { combination, fields };
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

  const addedAttributeData = fieldData.map(combination => {
    const priceFieldName = `${combination.combination}_price`;
    const stockFieldName = `${combination.combination}_stock`;

    return {
      combinations: combination.combination.split('-').map((attribute, index) => {
        const attributeName = selectedAttribute.attributes.find(e => e.attribute_options.find(el => el == attribute))
        if (!attributeName) {
          return null;
        }
        const attributeId = allAttributes.find(e => e.attribute_name.trim().toLowerCase() == attributeName.attribute_name.trim().toLowerCase())
        return {
          attribute_id: attributeId ? attributeId.id : null,
          attribute_value: attribute
        };
      }),
      combination_name: combination.combination,
      price: data[priceFieldName],
      stock: data[stockFieldName]
    };
  });

    // Call the parent function with addedAttributeData whenever it changes
    useEffect(() => {
        console.log("reder-addEditArtt")
        if (addedAttributeData) {
            console.log(addedAttributeData, "send-attr")
          onEditCombination(addedAttributeData); // Send data to parent component
        }
      }, [data]);


  console.log(fieldData, "field-data");
  console.log(combinations, "comb");

  useEffect(() => {
    const fetchAttributes = async () => {
      const attr = await getAttributes();
      if (Array.isArray(attr)) {
        setAllAttributes(attr);
      }
    };
    fetchAttributes();

    // Set selected attributes based on combination
    setSelectedAttribute(transformCombinationData(combination));

    // Prepopulate field data with combination price/stock
    const combinationMaps = combination.reduce((obj, item) => {
      obj[`${item.combination}_price`] = item.price;
      obj[`${item.combination}_stock`] = item.stock;
      return obj;
    }, {});
    console.log(combinationMaps, "combination-map");
    setData(combinationMaps);
  }, []);

  return (
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
                  {/* Apply the key prop separately */}
                  <Checkbox color="primary" checked={selected} />
                  {option.attribute_name}
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
                    {attribute.attribute_options.map((option, optionIndex) => (
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
                    ))}
                  </div>
                  <FormControl fullWidth>
                    <span className="text-[10px] font-[500]">
                      Note: Enter{" "}
                      <span className="text-red-700">coma ( , )</span> to create
                      new {attribute.attribute_name}
                    </span>
                    <input
                      placeholder={`Enter ${attribute.attribute_name}`}
                      className="w-[100%] inputText focus-none outline-none !text-[14px] !text-[#354154]"
                      value={attribute.attribute_options.join(", ")}
                      // onChange={(event) => handleAttributeOptionChange(attributeIndex, event.target.value.split(',').map(option => option.trim()))}
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
                  <h3 className="w-[30%] font-[600]">{data1.combination}</h3>
                  {data1.fields.map((field, index) => (
                    <div key={index} className="flex flex-col w-[60%]">
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
  );
};

export default EditCombination;
