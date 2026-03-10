"use client";
import React, { useState } from "react";

const FeaturesComponent = ({ features }) => {
  if (!features || features.length === 0) {
    return null;
  }

  const [isExpanded, setIsExpanded] = useState(false);

  //console.log(featureDescription, "fe")
  const maxLength = 10; // Maximum characters to display initially

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="overflow-x-auto feature-container py-4">
      <div className="flex gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="shadow-lg rounded-lg overflow-y-auto flex-shrink-0 flex flex-col justify-between p-2 bg-white"
          >
            {feature.feature?.image_url && (
              <div className="flex justify-center items-center">
                <img
                  className="w-12 h-12 object-contain"
                  src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${feature.feature?.image_url}`}
                  alt={feature.feature?.feature_name}
                />
              </div>
            )}
            <div className="flex flex-col items-center text-center">
              <h3 className="font-semibold text-xs text-gray-800 mb-1">
                {feature.feature?.feature_name}
              </h3>
              {/* <div 
                className=" text-gray-600 line-clamp-2" style={{fontSize:'14px'}}
                dangerouslySetInnerHTML={{ __html: feature.feature?.feature_description }}
              /> */}
              {/* <div className="text-gray-600" style={{ fontSize: "14px" }}>
                <div
                  className="line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: isExpanded
                      ? feature.feature?.feature_description
                      : feature.feature?.feature_description.substring(
                          0,
                          maxLength
                        ),
                  }}
                />
                {feature.feature?.feature_description.length > maxLength && (
                  <span
                    onClick={toggleExpand}
                    className="text-blue-500 hover:underline cursor-pointer mt-2"
                  >
                    {isExpanded ? " View Less" : " View More"}
                  </span>
                )}
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesComponent;
