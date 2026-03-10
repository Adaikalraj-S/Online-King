import useProductStore from '@/app/storeContext/store';
import React, { useEffect } from 'react'

const Recomended = ({ params }) => {
    const { recommendedProducts, fetchRecomendedProduct } = useProductStore();

    useEffect(() => {
        fetchRecomendedProduct(params)
    }, [fetchRecomendedProduct])
    return (
        <>
            {recommendedProducts?.length > 0 && (
                <h1 className="font-bold text-4xl">Recommended for you</h1>
            )}
        </>
    )
}

export default Recomended
