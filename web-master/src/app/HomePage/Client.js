// import React from 'react';
// import dell from "../Asset/DEll.svg";
// import cisco from "../Asset/cisco.svg";
// import lanix from "../Asset/Lanix.svg";
// import microsoft from "../Asset/Microsoft.svg";
// import ps from "../Asset/PS.svg";
// import samsung from "../Asset/samsung.svg";
// import oracle from "../Asset/oracle.svg";
// import Image from 'next/image';

// const Client = () => {
//   return (
//     <div className='flex flex-col py-2 px-8 font-fontNew'>
//       <div className='items-center py-8'>
//       <h1 className='   py-2 mt-3 text-[60px] text-center lowercase font-bold '><span className='text-[#000] capitalize'>Our</span> <span className='text-[#3fd4b4] capitalize'>Clie</span>nts</h1>
//          </div>
//       <div className='flex flex-col bg-[#F28F8F] py-6 gap-8 rounded-xl px-4 md:px-8'>
//         <div className='grid grid-cols-2 sm:grid-cols-4j lg:grid-cols-4 gap-4 justify-items-center'>
//           <Image src={dell} alt="Dell" />
//           <Image src={microsoft} alt="Microsoft" />
//           <Image src={lanix} alt="Lanix" />
//           <Image src={ps} alt="Ps" />
//         </div>
//         <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 gap-4 justify-items-center'>
//           <Image src={samsung} alt="Samsung" />
//           <Image src={cisco} alt="Cisco" />
//           <Image src={oracle} alt="Oracle" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Client;
"use client";
import React from "react";
import dell from "../Asset/DEll.svg";
import cisco from "../Asset/cisco.svg";
import lanix from "../Asset/Lanix.svg";
import microsoft from "../Asset/Microsoft.svg";
import ps from "../Asset/PS.svg";
import samsung from "../Asset/samsung.svg";
import oracle from "../Asset/oracle.svg";
import Image from "next/image";

const Client = () => {
  return (
    <div className="flex flex-col py-2 px-8 font-fontNew">
      <div className="items-center py-8">
        <h1 className="py-2 mt-3 text-[60px] text-center lowercase font-bold">
          <span className="text-[#000] capitalize">Our</span>{" "}
          <span className="text-[#3fd4b4] capitalize">Clie</span>nts
        </h1>
      </div>
      <div className="flex flex-col bg-[#F28F8F] py-6 gap-8 rounded-xl px-4 md:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 justify-items-center">
          <Image src={dell} alt="Dell" width={100} height={100} />
          <Image src={microsoft} alt="Microsoft" width={100} height={100} />
          <Image src={lanix} alt="Lanix" width={100} height={100} />
          <Image src={ps} alt="Ps" width={100} height={100} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 gap-4 justify-items-center">
          <Image src={samsung} alt="Samsung" width={100} height={100} />
          <Image src={cisco} alt="Cisco" width={100} height={100} />
          <Image src={oracle} alt="Oracle" width={100} height={100} />
        </div>
      </div>
    </div>
  );
};

export default Client;
