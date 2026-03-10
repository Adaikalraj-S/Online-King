// "use client"
// import { Accordion, AccordionDetails, AccordionSummary, Drawer, ListItem } from "@mui/material";
// import Image from "next/image";
// import React, { useEffect } from "react";
// import { AiOutlineClose } from "react-icons/ai";
// import logo from "../../Asset/OnlineKingLogo.svg";
// import useProductStore from "@/app/storeContext/store";
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Link from "next/link";

// const SideNavbar = ({ openSidebar, onCloseSidebar }) => {

//     const {fetchCategoryData,categoryData} = useProductStore();

//     useEffect(() => {
//         fetchCategoryData()
//     },[])

//   return (
//     <div>
//       <Drawer
//         anchor={"left"}
//         open={openSidebar}
//         onClose={onCloseSidebar}
//         sx={{
//           width: "75%",
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: "75%",
//             boxSizing: "border-box",
//           },
//         }}
//       >
//         <div className="w-full flex items-center justify-between p-3">
//           <div>
//             <Image
//               width={1000}
//               height={1000}
//               src={logo}
//               alt="logo"
//               className="md:cursor-pointer w-12 md:w-16 object-contain"
//             />
//           </div>
//           <span onClick={onCloseSidebar} className="text-2xl">
//             <AiOutlineClose />
//           </span>
//         </div>
//         <p className="p-3 font-bold">All Categories</p>
//         {/* Accordian for showing content */}
//     <div>
//       {categoryData?.length > 0 &&
//         categoryData.map((category) => (
//           <div className="space-y-2" key={category.id}>
//             {/* Check if category has sub-categories */}
//             {category.sub_categories?.length > 0 ? (
//               <Accordion className="bg-[#45B348] text-white">
//                 <AccordionSummary
//                   expandIcon={<ExpandMoreIcon />}
//                   aria-controls={`panel-${category.id}-content`}
//                   id={`panel-${category.id}-header`}
//                 >
//                   {category.category_name}
//                 </AccordionSummary>
                
//                 <AccordionDetails>
//                   {/* Iterate over Sub-Categories */}
//                   {category.sub_categories.map((subCategory) => (
//                     <div key={subCategory.id}>
//                       {subCategory.super_sub_categories?.length > 0 ? (
//                         <Accordion>
//                           <AccordionSummary
//                             expandIcon={<ExpandMoreIcon />}
//                             aria-controls={`panel-${subCategory.id}-content`}
//                             id={`panel-${subCategory.id}-header`}
//                           >
//                             {subCategory.sub_category_name}
//                           </AccordionSummary>
//                           <AccordionDetails>
//                             {/* Iterate over Super-Sub-Categories */}
//                             {subCategory.super_sub_categories.map((superSubCategory) => (
//                               <Link key={superSubCategory.id} href={`/super-sub-category/${superSubCategory.id}/${superSubCategory.super_sub_category_name}`}>
//                                 <p className="block pl-6 hover:text-green-500">
//                                   {superSubCategory.super_sub_category_name}
//                                 </p>
//                               </Link>
//                             ))}
//                           </AccordionDetails>
//                         </Accordion>
//                       ) : (
//                         // Direct link if no super-sub-categories
//                         <Link href={`/sub-category/${subCategory.id}/${subCategory.sub_category_name}`}>
//                           <p className="block pl-4 hover:text-green-500">
//                             {subCategory.sub_category_name}
//                           </p>
//                         </Link>
//                       )}
//                     </div>
//                   ))}
//                 </AccordionDetails>
//               </Accordion>
//             ) : (
//               // Direct link if no sub-categories
//               <div className="w-full rounded-lg py-2">

//               <Link className="block px-4 border shadow-lg bg-[#45B348] text-white" href={`/category/${category.id}/${category.category_name}`}>
//                 <p className="py-4">{category.category_name}</p>
//               </Link>
//               </div>
             
//             )}
//           </div>
//         ))}
//     </div>
//       </Drawer>
//     </div>
//   );
// };

// export default SideNavbar;


"use client";

import React, { useEffect, useState } from "react";
import { Drawer, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";
import useProductStore from "@/app/storeContext/store";
import logo from "../../Asset/OnlineKingLogo.svg";

const SideNavbar = ({ openSidebar, onCloseSidebar }) => {
  const { fetchCategoryData, categoryData } = useProductStore();
  const [openAccordions, setOpenAccordions] = useState({});

  // Fetch categories on mount
  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  const toggleAccordion = (id) => {
    setOpenAccordions((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <Drawer
      anchor="left"
      open={openSidebar}
      onClose={onCloseSidebar}
      sx={{
        "& .MuiDrawer-paper": {
          width: "75%",
          boxSizing: "border-box",
          backgroundColor: "#f8f8f8",
          color: "#333",
        },
      }}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between p-4 bg-[#45B348] text-white">
        <Image
          width={1000}
          height={1000}
          src={logo}
          alt="logo"
          className="w-12 md:w-16 object-contain"
        />
        <span onClick={onCloseSidebar} className="text-2xl cursor-pointer">
          <AiOutlineClose />
        </span>
      </div>

      <p className="p-4 text-lg font-semibold">All Categories</p>

      {/* Categories */}
      <div className="p-2 space-y-2">
        {categoryData?.map((category) => (
          <div key={category.id} className="rounded-lg shadow-md">
            {category.sub_categories?.length > 0 ? (
              <Accordion
                expanded={openAccordions[category.id] || false}
                onChange={() => toggleAccordion(category.id)}
                className="bg-white text-black"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className="bg-[#45B348] text-white hover:bg-green-600"
                >
                  <Link
                    href={`/category/${category.id}/${encodeURIComponent(category.category_name)}`}
                    className="text-lg font-semibold flex items-center justify-between gap-1 group-hover:text-primary"
                  >
                    <p className="capitalize">{category.category_name}</p>
                  </Link>
                </AccordionSummary>
                <AccordionDetails>
                  {category.sub_categories.map((subCategory) => (
                    <div key={subCategory.id}>
                      {subCategory.super_sub_categories?.length > 0 ? (
                        <Accordion
                          className="bg-gray-100 text-black"
                          expanded={openAccordions[subCategory.id] || false}
                          onChange={() => toggleAccordion(subCategory.id)}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <p className="capitalize">
                              {subCategory.sub_category_name}
                            </p>
                          </AccordionSummary>
                          <AccordionDetails>
                            {subCategory.super_sub_categories.map(
                              (superSubCategory) => (
                                <Link
                                  key={superSubCategory.id}
                                  href={`/super-sub-category/${superSubCategory.id}/${superSubCategory.super_sub_category_name}`}
                                >
                                  <p className="pl-6 py-1 hover:text-green-600">
                                    {superSubCategory.super_sub_category_name}
                                  </p>
                                </Link>
                              )
                            )}
                          </AccordionDetails>
                        </Accordion>
                      ) : (
                        <Link
                          href={`/sub-category/${subCategory.id}/${subCategory.sub_category_name}`}
                        >
                          <p className="pl-4 py-1 hover:text-green-600">
                            {subCategory.sub_category_name}
                          </p>
                        </Link>
                      )}
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
            ) : (
              <Link
                href={`/category/${category.id}/${category.category_name}`}
                className="block bg-[#45B348] text-white px-4 py-2 hover:bg-green-600"
              >
                {category.category_name}
              </Link>
            )}
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default SideNavbar;

