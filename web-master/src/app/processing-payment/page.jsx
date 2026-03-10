"use client";
import { useEffect, useState } from "react";
import axios from '../../../axios'

export default function PaymentProcessing() {
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const phonePeTrid = localStorage.getItem("PHONEPETRID"); // Retrieve PHONEPETRID from local storage
      if (!phonePeTrid) {
        console.error("PHONEPETRID not found in local storage.");
        return;
      }

      try {
        const response = await axios({
          url: "/api/payment-status",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            order_id: Number(phonePeTrid.split('-').pop()), // Pass PHONEPETRID as part of the payload
          }),
        });


        if (response?.data?.data.payment_ref_id) {
          setIsProcessing(false)
          localStorage.removeItem('PHONEPETRID')
          setTimeout(() => {
            window.location.href = "/profile/my-orders"
          }, 1000);
          // Add redirection logic here, e.g., router.push('/success')
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    const interval = setInterval(checkPaymentStatus, 1000); // Check every 1 second

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div style={styles.container}>
      {isProcessing ? (
        <>
          <div style={styles.loader}></div>
          <p style={styles.text}>Processing your payment...</p>
        </>
      ) : (
        <p style={styles.text}>Payment successful! Redirecting...</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  text: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#333",
    textTransform: "CAPITALIZE",
  },
};

const globalStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = globalStyles;
  document.head.appendChild(style);
}
