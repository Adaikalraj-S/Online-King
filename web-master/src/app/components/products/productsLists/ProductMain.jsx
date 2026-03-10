import HeaderMain from '@/app/HomePage/HeaderMain'
import Hero from '@/app/HomePage/Hero'
import React from 'react'
import ProductListMain from './ProductListMain'
import BreadCrumbs from '../../utils/BreadCrumbs'
import HighRatedProducts from '../highrated/HighRatedProducts'

const ProductMain = ({params , convertInRupee}) => {
  return (
    <>
        <BreadCrumbs pageName={params.product_name}/>

        <ProductListMain params={params} convertInRupee={convertInRupee}/>

        <HighRatedProducts params={params} convertInRupee={convertInRupee}/>
    </>
  )
}

export default ProductMain
