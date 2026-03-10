"use client"
import React, { useState } from 'react'
import Description from './tabs/Description';
import RatingsReview from './tabs/RatingsReview';
import Faq from './tabs/Faq';
import ProductCompare from './tabs/ProductCompare';

const TabsDetails = ({ params , data}) => {
  const [activeTab, setActiveTab] = useState('tab1');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <div>
  <div className="tabs md:p-10 p-4 flex flex-col gap-3 md:flex md:flex-row md:gap-4 md:items-center"> {/* Added flex and space-x-4 for horizontal spacing */}
    <button
      onClick={() => handleTabClick('tab1')}
      className={`rounded-lg border-solid border-2 border-gray md:w-52 md:h-28 px-12 w-full py-6 hover:bg-[#45B348] hover:text-white ${activeTab === 'tab1' ? 'bg-[#45B348] text-white' : ''}`}
    >
      Description
    </button>
    <button
      onClick={() => handleTabClick('tab2')}
      className={`rounded-lg border-solid border-2 border-gray md:w-52 md:h-28 px-12 w-full py-6 hover:bg-[#45B348] hover:text-white ${activeTab === 'tab2' ? 'bg-[#45B348] text-white' : ''}`}
    >
      Ratings & Reviews
    </button>
    <button
      onClick={() => handleTabClick('tab3')}
      className={`rounded-lg border-solid border-2 border-gray md:w-52 md:h-28 px-12 w-full py-6 hover:bg-[#45B348] hover:text-white ${activeTab === 'tab3' ? 'bg-[#45B348] text-white' : ''}`}
    >
      FAQ&apos;s
    </button>
    {/* Optionally include the fourth button as needed */}
    {/* <button
      onClick={() => handleTabClick('tab4')}
      className={`rounded-lg border-solid border-2 border-gray w-52 h-28 hover:bg-[#45B348] hover:text-white ${activeTab === 'tab4' ? 'bg-[#45B348] text-white' : ''}`}
    >
      Product Compare
    </button> */}
  </div>
  
  <div className="tab-content gap-4 mt-6"> {/* Added mt-6 to give some space between buttons and content */}
    {activeTab === 'tab1' && (
      <div>
        <Description params={params} data={data} />
      </div>
    )}
    {activeTab === 'tab2' && (
      <div>
        <RatingsReview params={data.id} customerReviews={data?.CustomerReviews || []} />
      </div>
    )}
    {activeTab === 'tab3' && (
      <div>
        <Faq params={params} data={data} />
      </div>
    )}
    {activeTab === 'tab4' && (
      <div>
        <ProductCompare params={params} />
      </div>
    )}
  </div>
</div>

  )
}

export default TabsDetails
