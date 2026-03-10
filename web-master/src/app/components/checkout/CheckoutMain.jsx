import { Box, Button, Checkbox, FormControlLabel, Step, StepLabel, Stepper } from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react'
import OrderSummary from './OrderSummary';
import { useSnackbar } from '@/app/SnackBarProvider';
import FormAddress from './FormAddress';
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import ThirdStep from './ThirdStep';

const CheckoutMain = ({cartData , cartCount, type=null}) => {
    const { openSnackbar } = useSnackbar();

    // ---------------------------------------- Stepper Starts ----------------------------------------
    const [activeStep, setActiveStep] = useState(0);
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // ---------------------------------------- Stepper Ends ----------------------------------------

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <FirstStep activeStep={step} handleBack={handleBack} handleNext={handleNext} />
                    </>

                );
            case 1:
                return (
                    <>
                        <SecondStep activeStep={step} handleBack={handleBack} handleNext={handleNext} />
                    </>
                );
            case 2:
                return (
                    <>
                        <ThirdStep activeStep={step} handleBack={handleBack} handleNext={handleNext} />
                    </>
                );
            default:
                return 'Unknown step';
        }
    };



    return (
        <>
            <div className='w-full  py-[60px] md:px-14 px-4'>
                <div className='checkout-page-wrapper w-full bg-white pb-[60px]'>
                    <div className='checkout-main-content w-full'>
                        <div className='container-x mx-auto'>

                            {/* <Stepper activeStep={activeStep} alternativeLabel>
                                <Step>
                                    <StepLabel>Add or Select address</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>Select Payment</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>Overview</StepLabel>
                                </Step>
                            </Stepper>

                            <Box sx={{ mt: 4 }} className='container-x mx-auto'>
                                {getStepContent(activeStep)}
                            </Box> */}

                            <FirstStep cartData={cartData} cartCount={cartCount} type={type} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckoutMain
