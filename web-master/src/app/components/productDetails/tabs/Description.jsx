import React from 'react'

const Description = ({data}) => {
  console.log("rDescriptionData",data);
  // const { 
  //   // product_desc, 
  //   exchange_policy 
  // } = data;

  return (
    <div className='py-2 px-4'>
      {/* <div>{JSON.stringify(data?.exchange_policy)}</div> */}
      <div
        className="p-4"
        dangerouslySetInnerHTML={{
          __html: data?.exchange_policy ? data?.exchange_policy : '',
        }}
      />
      {/* <div className='listStyle ul' dangerouslySetInnerHTML={{ __html: product_desc }} /> */}
      {/* {data?.exchange_policy ? data?.exchange_policy : ''} */}
    </div>
  )
}

export default Description
