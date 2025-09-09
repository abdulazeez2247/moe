import React, { useEffect } from "react";

const PaymentInterface = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    script.onload = () => {
      console.log('Stripe Pricing Table script loaded');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      <stripe-pricing-table
        pricing-table-id="prctbl_1QwAbC2eZvKYlo2CgUv8pQqT" 
        publishable-key="pk_test_51RwMz05JNHcvuz94sjCN54asKUd4bCLag0loJmElJLyWJwwmgUFlr9J3llxb5GtXV97C3O7sCXty8Tc4M0s3iVi400KRiZl9GM"
      >
      </stripe-pricing-table>
    </div>
  );
};

export default PaymentInterface;