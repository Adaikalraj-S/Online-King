"use client"
import React, { useState, useContext, createContext } from 'react'

const multiStepContext = createContext();

export const StepperContext = ({children}) => {
    const [currentStep, setStep]=useState(1)
    const [userData, setUserData]=useState([])
    const [finalData,setFinalData]=useState([])
  return (
    <div>
      <multiStepContext.Provider value={{ currentStep, setStep ,userData ,setUserData, finalData ,setFinalData}}  >
    {children}
      </multiStepContext.Provider>
    </div>
  )
}

export const useMultistepContext = () => {
  return useContext(multiStepContext);
}
