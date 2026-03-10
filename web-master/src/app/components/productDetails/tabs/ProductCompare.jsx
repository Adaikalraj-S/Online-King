import React from 'react'

const products = [
    {
        name: 'Product 1',
        image: 'https://via.placeholder.com/150',
        description: 'Description for product 1',
        price: '29.99',
    },
    {
        name: 'Product 2',
        image: 'https://via.placeholder.com/150',
        description: 'Description for product 2',
        price: '39.99',
    },
    {
        name: 'Product 3',
        image: 'https://via.placeholder.com/150',
        description: 'Description for product 3',
        price: '49.99',
    },
    {
        name: 'Product 4',
        image: 'https://via.placeholder.com/150',
        description: 'Description for product 4',
        price: '59.99',
    },
];

const ProductCompare = () => {

    return (
        <div className="py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product, index) => (
                    <div key={index} className="bg-white border rounded-lg p-4 text-center shadow-md">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
                        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <p className="text-lg font-bold text-green-600">{product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductCompare
