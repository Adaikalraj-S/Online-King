import React from 'react'
import recomended from "../../Asset/RecommendedForyouImage.svg"
import wishListText from "../../Asset/WishListText.svg"
import addtocart from "../../Asset/AddToCart.svg"
import rupee from "../../Asset/Rupee.svg"
import Image from 'next/image';


const CardComponent = () => {
  return (
    <>
      <div>

        <div className="py-7 max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2">
          <div className='rounded-lg border-solid border-2 border-gray w-80 shadow-lg' style={{ height: "28rem" }}>
            <div className=''>
              <Image src={recomended} alt="" className="bg-cover bg-center w-96" />
              {/* Card Images from Backend API */}
            </div>
            <div className=" flex-col px-4 py-2 gap-24">
              <h2 className='font-bold text-lg	'>Sony - Bluetooth Boom Headphone S1 Series </h2>
              <div className='flex gap-3 px-2'>
                <Image src={rupee} alt="Rupee" className="size-6" />
                <p>25,864.00</p>
                <div className='flex gap-1'>
                  <p className='line-through text-gray-500'>30,000</p>
                  <p className="text-green-600 text-sm">(15% off)</p>
                </div>
              </div>
              <div className='flex gap-7'>
                <Image src={addtocart} alt="" />
                <Image src={wishListText} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CardComponent
