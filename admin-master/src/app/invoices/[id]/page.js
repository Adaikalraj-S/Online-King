"use client";
import React, { useEffect, useCallback, useState } from "react";
import { FaDownload } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import axios from "../../../../axios";import {
  downloadPDF 
} from './generatePdf'

const Page = ({ params }) => {
  const [orderDetail, setOrderDetail] = useState([]);
  console.log("orderDetail", orderDetail[0]?.order_id);
  useEffect(() => {
    fetchOrders();
  }, []);

  const Address = ({ address = {} }) => {
    console.log(address, "addresss");
    if (address === null) {
      return (
        <div>
          <p>Online King</p>
          {/* <p>1st Floor, No 31, CCR Building,</p>
          <p> Kalinga Rao Road, Mission Road, Bengaluru, Bengaluru Urban,</p> */}

          <p className="">
            <span>Bengaluru</span>
            <span> 560027 </span>
            <span>Karnataka </span>
          </p>
          <p>Contact: 8792957268 </p>
        </div>
      );
    }
    return (
      <>
        <div>
          <h2  className="font-bold">Shipping Address:</h2>
          <p className="text-sm">
            <strong>{address?.shipping_address?.fullname}</strong>
          </p>
          <p>{address?.shipping_address?.add1}</p>
          <p>{address?.shipping_address?.add2}</p>
          {address?.shipping_address?.landmark && (
            <p>
              <span>Landmark: </span>
              {address?.shipping_address?.landmark}
            </p>
          )}
          <p>
            <span>{address?.shipping_address?.city} </span>
            <span> {address?.shipping_address?.zipcode} </span>
            <span>{address?.shipping_address?.state} </span>
          </p>
          {address?.shipping_address?.gst_no && (
            <p>
              <strong>GST: </strong>
              {address?.shipping_address?.gst_no}
            </p>
          )}
        </div>
        <div>
          <h2 className="font-bold">Billing Address:</h2>
          <p className="text-sm">
            <strong>{address?.billing_address?.fullname}</strong>
          </p>
          <p>{address?.billing_address?.add1}</p>
          <p>{address?.billing_address?.add2}</p>
          {address?.billing_address?.landmark && (
            <p>
              <span>Landmark: </span>
              {address?.billing_address?.landmark}
            </p>
          )}
          <p>
            <span>{address?.billing_address?.city} </span>
            <span> {address?.billing_address?.zipcode} </span>
            <span>{address?.billing_address?.state} </span>
          </p>
          {address?.billing_address?.gst_no && (
            <p>
              <strong>GST: </strong>
              {address?.billing_address?.gst_no}
            </p>
          )}
        </div>
        </>
    );
  };

  const fetchOrders = useCallback(() => {
    axios
      .get(`/api/fetch-orders-admin?id=${decodeURIComponent(params.id)}`, {
        headers: {
          Authorization: localStorage.getItem("onlineKingToken"),
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          console.log(res.data.orders, "order--");
          setOrderDetail(res.data.orders);
        } else if (res.data.message === "Session expired") {
          openSnackbar(res.data.message, "error");
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
          openSnackbar(err.response.data.message, "error");
        }
      });
  }, []);

  function isKarnatakaPincode(pincode) {
    // Convert the pincode to a string to easily extract the prefix
    const pincodeStr = pincode?.toString();

    // Extract the first two digits (prefix)
    const prefix = pincodeStr?.slice(0, 2);

    // Check if the prefix is within the Karnataka range
    return prefix >= "56" && prefix <= "59";
  }

  function formatDate(isoDate) {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    hours = String(hours).padStart(2, "0"); // Pad with leading zero if needed

    // Format the date as DD-MM-YYYY
    const formattedDate = `${day}-${month}-${year}`;

    // Format the time as HH:mm:ss AM/PM
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    // Combine date and time
    return `${formattedDate} ${formattedTime}`;
  }

  const ShowDiscount = ({ orderItem }) => {
    console.log(orderItem, "orderItem");

    const { product } = orderItem;

    if (product.discount && product.discount_type.toLowerCase() === "amount") {
      return product.discount.toFixed(2);
    } else if (
      (product.discount && product.discount_type.toLowerCase() === "percent") ||
      "percentage"
    ) {
      return (product.default_price * (product.discount / 100)).toFixed(2);
    } else if (orderItem.coupon) {
      return 0;
    }
  };

  const handleDownload = () => {
    
    console.log("download");
    downloadPDF('invoice', orderDetail[0]?.order_id);
  };

  function calculateTaxableAmount(totalAmount, taxRate) {
    if (totalAmount <= 0 || taxRate < 0) {
      throw new Error(
        "Invalid input: Total amount and tax rate must be non-negative."
      );
    }

    // Calculate the taxable amount
    const taxableAmount = totalAmount / (1 + taxRate / 100);

    // Return the result rounded to two decimal places
    return parseFloat(taxableAmount.toFixed(2));
  }

  return (
    <div className="relative">
      <div className="sticky top-0 z-10 bg-white">
        <button
          onClick={handleDownload}
          className="mb-5 p-2 sticky top-0 bg-yellow-500 hover:bg-yellow-800 text-white rounded flex items-center"
        >
          <FaDownload className="mr-2" />
          Download PDF
        </button>
      </div>
      <div
        id="invoice"
        className="max-w-4xl mx-auto p-5 border border-gray-300 rounded-lg flex flex-col"
      >
        <div className="flex justify-between items-center mb-2">
          <div>
            <img src="/OnlineKingLogo.svg" alt="Logo" className="w-24 h-auto" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold">
              Tax Invoice/Bill of Supply/Cash Memo
            </h3>
            <p>(Original for Recipient)</p>
          </div>
        </div>

        <div className="flex justify-between gap-16 mb-5">
          <div className="flex-1">
            <div className="mt-5">
              <p className="font-bold">Seller Information:</p>
              <address className="not-italic">
              Sold By : OnlineKing<br/>
              C/o : Madhu IT Junction<br/>
              480, 3rd floor, Above central bank of India,<br/>
              BEML 3rd stage, opp Joyalukkas , Rajarajeshwari Nagar,<br/>
              Bangalore , Karnataka - 560098<br/>
              INDIA (IN)<br/>
              PAN No: AESPC7023F<br/>
              GST Registration No: 29AESPC7023F2ZF
              </address>

              <div className="mt-3">
                <p className="font-bold">Customer Information:</p>
                <p>Name: {orderDetail[0]?.customer.fullname}</p>
                <p>Mob: {orderDetail[0]?.customer.phone}</p>
                <p>Email: {orderDetail[0]?.customer.email}</p>
              </div>

              {/* <p className="mt-14 mb-8">
                <strong>GST Registration No:</strong> 29AAJCK1991Q1ZK
              </p> */}
              <p className="mt-5">
                <strong>Order ID:</strong> {orderDetail[0]?.order_id}
              </p>
              <p>
                <strong>Ordered Date:</strong>{" "}
                {formatDate(orderDetail[0]?.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex-1 text-right">
            <div className="mt-5">
              {orderDetail && (
                <Address address={orderDetail[0]} />
              )}
            </div>

            {/* <div className="mt-2">
            <p>
              <strong>State/UT Code:</strong> 29
              <br />
              <strong>Place of supply:</strong> KARNATAKA
              <br />
              <strong>Place of delivery:</strong> KARNATAKA
              <br />
              <strong>Invoice Number:</strong> BLR7-13437
              <br />
              <strong>Invoice Details:</strong> KA-BLR7-1229877215-2324
              <br />
              <strong>Invoice Date:</strong> 30.01.2024
            </p>
          </div> */}
          </div>
        </div>
        <div className="border border-gray-300 rounded-lg mb-5">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-[12px]">
                <th className="border border-gray-300 p-3">SL.No.</th>
                <th className="border border-gray-300 p-3">Product Details</th>
                <th className="border border-gray-300 p-3">MRP</th>
                <th className="border border-gray-300 p-3">Discount Amount</th>
                <th className="border border-gray-300 p-3">Qty</th>
                <th className="border border-gray-300 p-3">Taxable Amount</th>
                <th className="border border-gray-300 p-3">GST %</th>
                {orderDetail[0]?.user_address ? (
                  isKarnatakaPincode(orderDetail[0]?.user_address?.zipcode) ? (
                    <>
                      <th className="border border-gray-300 p-3">
                        CGST Amount
                      </th>
                      <th className="border border-gray-300 p-3">
                        SGST Amount
                      </th>
                    </>
                  ) : (
                    <th className="border border-gray-300 p-3">IGST Amount</th>
                  )
                ) : isKarnatakaPincode("560027") ? (
                  <>
                    <th className="border border-gray-300 p-3">CGST Amount</th>
                    <th className="border border-gray-300 p-3">SGST Amount</th>
                  </>
                ) : (
                  <th className="border border-gray-300 p-3">IGST Amount</th>
                )}

                <th className="border border-gray-300 p-3">Payable Amount</th>
              </tr>
            </thead>
            <tbody>
              {orderDetail &&
                orderDetail[0]?.order_details.map((item, i) => (
                  <tr key={`${i}`} className="hover:bg-gray-100 text-[12px]">
                    <td className="border border-gray-300 p-2">{i + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {item?.product_description}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {/* {item.sub_total * item.quantity} */}
                      {item?.unit_price}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item?.unit_price * parseInt(item?.quantity) -
                        item?.total_amount}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {calculateTaxableAmount(item.total_amount, item.gst)}
                    </td>
                    <td className="border border-gray-300 p-2">{item.gst}</td>
                    {/* {orderDetail[0]?.user_address !== null ? (
                      isKarnatakaPincode(orderDetail[0]?.user_address?.zipcode)
                    ) : isKarnatakaPincode("560027") ? (
                      <>
                        <td className="border border-gray-300 p-2">
                          {item.cgst}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {item.sgst}
                        </td>
                      </>
                    ) : (
                      <td className="border border-gray-300 p-2">
                        {item.igst}
                      </td>
                    )} */}
                    {orderDetail[0]?.user_address ? (
                      isKarnatakaPincode(
                        orderDetail[0]?.user_address?.zipcode
                      ) ? (
                        <>
                          <td className="border border-gray-300 p-2">
                            {item.cgst}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {item.sgst}
                          </td>
                        </>
                      ) : (
                        <td className="border border-gray-300 p-2">
                          {item.igst}
                        </td>
                      )
                    ) : isKarnatakaPincode("560027") ? (
                      <>
                        <td className="border border-gray-300 p-2">
                          {item.cgst}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {item.sgst}
                        </td>
                      </>
                    ) : (
                      <td className="border border-gray-300 p-2">
                        {item.igst}
                      </td>
                    )}

                    <td className="border border-gray-300 p-2">
                      {item?.total_amount}
                    </td>
                  </tr>
                ))}

              <tr className="tex-[12px]">
                <td
                  colSpan={
                    orderDetail[0]?.user_address
                      ? isKarnatakaPincode(
                          orderDetail[0]?.user_address?.zipcode
                        )
                        ? "9"
                        : "8"
                      : isKarnatakaPincode("560027")
                      ? "9"
                      : "8"
                  }
                  className="border border-gray-300 p-2 text-right"
                >
                  <strong>Total Amount</strong>
                </td>
                <td className="border border-gray-300 p-2">
                  ₹ {orderDetail && orderDetail[0]?.total_product_amount}
                </td>
              </tr>
              <tr className="text-[12px]">
                <td
                  colSpan={
                    orderDetail[0]?.user_address
                      ? isKarnatakaPincode(
                          orderDetail[0]?.user_address?.zipcode
                        )
                        ? "9"
                        : "8"
                      : isKarnatakaPincode("560027")
                      ? "9"
                      : "8"
                  }
                  className="border border-gray-300 p-2 text-right"
                >
                  <strong>Shipping and Handling Charge</strong>
                </td>
                <td className="border border-gray-300 p-2">
                  ₹ {orderDetail[0]?.total_shipping_amount || 0}
                </td>
              </tr>
              {orderDetail[0]?.total_discount_amount > 0 && (
                <tr className="text-[12px]">
                  <td
                    colSpan={
                      orderDetail[0]?.user_address
                        ? isKarnatakaPincode(
                            orderDetail[0]?.user_address?.zipcode
                          )
                          ? "9"
                          : "8"
                        : isKarnatakaPincode("560027")
                        ? "9"
                        : "8"
                    }
                    className="border border-gray-300 p-2 text-right"
                  >
                    <strong>
                      Total Discount
                      <br />
                      (product+coupon)
                    </strong>
                  </td>
                  <td className="border border-gray-300 p-2">
                    ₹ {(orderDetail[0]?.total_discount_amount).toFixed(2)}
                  </td>
                </tr>
              )}
              <tr className="text-[12px]">
                <td
                  colSpan={
                    orderDetail[0]?.user_address
                      ? isKarnatakaPincode(
                          orderDetail[0]?.user_address?.zipcode
                        )
                        ? "9"
                        : "8"
                      : isKarnatakaPincode("560027")
                      ? "9"
                      : "8"
                  }
                  className="border border-gray-300 p-2 text-right"
                >
                  <strong>Grand Total:</strong>
                </td>
                <td className="border border-gray-300 p-2">
                  ₹{orderDetail[0]?.total_paid_amount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* <div className="mt-5">
        <p>
          <strong>Total Amount in Words:</strong> Thirty-eight dollars and fifty
          cents only
        </p>
      </div> */}

        <div className="mt-8 border border-gray-300 rounded-lg p-5">
          <table className="w-full border-collapse mb-5">
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">
                  <strong>Payment Transaction ID:</strong>
                  <br />
                  {orderDetail[0]?.payment_ref_id}
                </td>
                <td className="border border-gray-300 p-2">
                  <strong> Date & Time:</strong>
                  <br />
                  {formatDate(orderDetail[0]?.updatedAt)}
                </td>
                {/* <td className="border border-gray-300 p-2">
                <strong>Mode of Payment:</strong>
                <br />
                379.00 UPI
              </td> */}
              </tr>
            </tbody>
          </table>
          <p>Thank you for shopping with Online King!</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
