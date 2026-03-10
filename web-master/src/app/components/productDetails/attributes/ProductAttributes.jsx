"use client"
import React, { useState, useEffect } from 'react';

const ProductAttributes = ({ attributes, onAttributeChange }) => {
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (Array.isArray(attributes) && attributes.length > 0) {
            let initialSelection = {};
            let foundAvailableCombination = false;
            for (let product of attributes) {
                if (Array.isArray(product.attributes_combinations) && product.attributes_combinations.length > 0) {
                    for (let attr of product.attributes_combinations) {
                        if (!initialSelection[attr.product_attribute.attribute_name]) {
                            initialSelection[attr.product_attribute.attribute_name] = attr.attribute_value;
                        }
                    }
                    if (product.stock > 0) {
                        foundAvailableCombination = true;
                        break;
                    } else {
                        initialSelection = {};
                    }
                }
            }
            if (!foundAvailableCombination) {
                const firstProduct = attributes[0];
                firstProduct.attributes_combinations.forEach(attr => {
                    initialSelection[attr.product_attribute.attribute_name] = attr.attribute_value;
                });
            }
            setSelectedAttributes(initialSelection);
            onAttributeChange(initialSelection);
        }
    }, [attributes, onAttributeChange]);

    const handleAttributeClick = (type, value) => {

        const updatedAttributes = {
            ...selectedAttributes,
            [type]: value,
        };

        const selectedCombination = attributes.find(product => {
            return product.attributes_combinations.every(attr => {
                return updatedAttributes[attr.product_attribute.attribute_name] === attr.attribute_value;
            });
        });

        if (selectedCombination && selectedCombination.stock === 0) {
            setErrorMessage(`Out of Stock.`);
            setTimeout(() => setErrorMessage(''), 2000);
            setSelectedAttributes(updatedAttributes);
            console.log(updatedAttributes, "selected-aatributes")
            onAttributeChange(updatedAttributes); 
        } else {
            setSelectedAttributes(updatedAttributes);
            onAttributeChange(updatedAttributes);
        }
    };

    const getUniqueAttributes = type => {
        if (!Array.isArray(attributes)) return [];

        const allAttributes = attributes.reduce((acc, product) => {
            if (product && Array.isArray(product.attributes_combinations)) {
                const filteredAttributes = product.attributes_combinations
                    .filter(attr => attr.product_attribute.attribute_name === type)
                    .map(attr => attr.attribute_value);
                return acc.concat(filteredAttributes);
            }
            return acc;
        }, []);
        return [...new Set(allAttributes)];
    };

    const renderAttributeOptions = type => {
        const uniqueAttributes = getUniqueAttributes(type);
        return uniqueAttributes.map(value => (
            <button
                key={value}
                className={`attribute-button ${selectedAttributes[type] === value ? 'selected' : ''}`}
                onClick={() => handleAttributeClick(type, value)}
            >
                {value}
            </button>
        ));
    };

    const getAllAttributeTypes = () => {
        if (!Array.isArray(attributes)) return [];

        const allAttributes = attributes.reduce((acc, product) => {
            if (product && Array.isArray(product.attributes_combinations)) {
                const attributeNames = product.attributes_combinations.map(
                    attr => attr.product_attribute.attribute_name
                );
                return acc.concat(attributeNames);
            }
            return acc;
        }, []);
        return [...new Set(allAttributes)];
    };

    return (
        <div className="attributes-selector">
            {getAllAttributeTypes().map(type => (
                <div key={type} className="attribute-group">
                    <h4>{type}</h4>
                    <div className="attribute-options">
                        {renderAttributeOptions(type)}
                    </div>
                </div>
            ))}
            {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}
        </div>
    );
};

export default ProductAttributes;




// Another Way
// import React, { useState, useEffect } from 'react';

// const ProductAttributes = ({ attributes, onAttributeChange }) => {
//     const [selectedAttributes, setSelectedAttributes] = useState({});
//     const [initialSelection, setInitialSelection] = useState({});
//     const [errorMessage, setErrorMessage] = useState('');

//     useEffect(() => {
//         if (Array.isArray(attributes)) {
//             const initialSelection = {};
//             attributes.forEach(product => {
//                 if (Array.isArray(product.attributes_combinations) && product.attributes_combinations.length > 0) {
//                     product.attributes_combinations.forEach(attr => {
//                         if (!initialSelection[attr.product_attribute.attribute_name]) {
//                             initialSelection[attr.product_attribute.attribute_name] = attr.attribute_value;
//                         }
//                     });
//                 }
//             });
//             setSelectedAttributes(initialSelection);
//             setInitialSelection(initialSelection);
//             onAttributeChange(initialSelection);
//         }
//     }, [attributes, onAttributeChange]);

//     const handleAttributeClick = (type, value) => {
//         const updatedAttributes = {
//             ...selectedAttributes,
//             [type]: value,
//         };

//         const selectedCombination = attributes.find(product => {
//             return product.attributes_combinations.every(attr => {
//                 return updatedAttributes[attr.product_attribute.attribute_name] === attr.attribute_value;
//             });
//         });

//         if (selectedCombination && selectedCombination.stock === 0) {
//             setErrorMessage(`Out of Stock.`);
//             setTimeout(() => setErrorMessage(''), 2000);
//             setSelectedAttributes(initialSelection); 
//             onAttributeChange(initialSelection);
//         } else {
//             setSelectedAttributes(updatedAttributes);
//             onAttributeChange(updatedAttributes);
//         }
//     };

//     const getUniqueAttributes = type => {
//         if (!Array.isArray(attributes)) return [];

//         const allAttributes = attributes.reduce((acc, product) => {
//             if (product && Array.isArray(product.attributes_combinations)) {
//                 const filteredAttributes = product.attributes_combinations
//                     .filter(attr => attr.product_attribute.attribute_name === type)
//                     .map(attr => attr.attribute_value);
//                 return acc.concat(filteredAttributes);
//             }
//             return acc;
//         }, []);
//         return [...new Set(allAttributes)];
//     };

//     const renderAttributeOptions = type => {
//         const uniqueAttributes = getUniqueAttributes(type);
//         return uniqueAttributes.map(value => (
//             <button
//                 key={value}
//                 className={`attribute-button ${selectedAttributes[type] === value ? 'selected' : ''}`}
//                 onClick={() => handleAttributeClick(type, value)}
//             >
//                 {value}
//             </button>
//         ));
//     };

//     const getAllAttributeTypes = () => {
//         if (!Array.isArray(attributes)) return [];

//         const allAttributes = attributes.reduce((acc, product) => {
//             if (product && Array.isArray(product.attributes_combinations)) {
//                 const attributeNames = product.attributes_combinations.map(
//                     attr => attr.product_attribute.attribute_name
//                 );
//                 return acc.concat(attributeNames);
//             }
//             return acc;
//         }, []);
//         return [...new Set(allAttributes)];
//     };

//     return (
//         <div className="attributes-selector">
//             {getAllAttributeTypes().map(type => (
//                 <div key={type} className="attribute-group">
//                     <h4>{type}</h4>
//                     <div className="attribute-options">
//                         {renderAttributeOptions(type)}
//                     </div>
//                 </div>
//             ))}
//             {errorMessage && <div className="text-red-500">{errorMessage}</div>}
//         </div>
//     );
// };

// export default ProductAttributes;