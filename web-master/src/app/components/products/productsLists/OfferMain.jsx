import HeaderMain from '@/app/HomePage/HeaderMain'
import Hero from '@/app/HomePage/Hero'
import React from 'react'
import OfferListMain from './OfferListMain'
import BreadCrumbs from '../../utils/BreadCrumbs'
import HighRatedProducts from '../highrated/HighRatedProducts'

const OfferMain = ({params , convertInRupee}) => {
  return (
    <>
        <BreadCrumbs pageName={params.product_name}/>

        <OfferListMain params={params} convertInRupee={convertInRupee}/>

        <HighRatedProducts params={params} convertInRupee={convertInRupee}/>
    </>
  )
}

export default OfferMain
