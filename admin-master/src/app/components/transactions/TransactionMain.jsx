import React from 'react'
import TransactionIndex from './TransactionIndex'

const TransactionMain = () => {
  return (
    <div className='px-[20px] py-[10px] space-y-5 container mx-auto w-[100%] overflow-y-scroll'>
        <TransactionIndex/>
    </div>
  )
}

export default TransactionMain
