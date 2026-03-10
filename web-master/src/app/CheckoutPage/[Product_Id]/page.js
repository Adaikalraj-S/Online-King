"use client";
import React, { useContext, useState } from "react";
import HeaderMain from "../../HomePage/HeaderMain";
import Hero from "../../HomePage/Hero";
import Image from "next/image";
import CheckoutPersonalPage from "../CheckoutPersonalPage";
import CheckoutShippingPage from "../CheckoutShippingPage";
import PaymentPage from "../PaymentPage";
import { Stepper, StepLabel, Step } from "@mui/material";
import { useMultistepContext } from "../StepperContext";
import Navbar from "@/app/components/Navbar/Navbar";

const Page1 = ({ params }) => {
  const { currentStep, finaldata } = useMultistepContext();
  const decodedParam = params.Product_Id;
  console.log(params, "PARA");
  function showStep(step) {
    switch (step) {
      case 1:
        return <CheckoutPersonalPage decodedParam={decodedParam} />;
      case 2:
        return <CheckoutShippingPage decodedParam={decodedParam} />;
      case 3:
        return <PaymentPage decodedParam={decodedParam} />;
    }
  }

  return (
    <div>
      {/* <HeaderMain /> */}
      <Navbar />
      <Hero />
      <div className="flex flex-col py-16 items-center font-fontNew">
        <Stepper
          style={{ width: "60%" }}
          activeStep={currentStep - 1}
          orientation="horizontal"
        >
          <Step>
            <StepLabel>Personal Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Shipping Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Payment Method</StepLabel>
          </Step>
        </Stepper>
      </div>
      {showStep(currentStep)}
    </div>
  );
};

export default Page1;
