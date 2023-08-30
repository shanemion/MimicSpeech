// PaymentSuccessPage.js

import React, { useEffect } from 'react';
import { useAuth } from "../../../../services/firebase/FirebaseAuth";
import { useLocation } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const plan = queryParams.get('plan');


  return (
    <div>
      <h1>Thank you for your purchase!</h1>
      {/* Additional content here */}
    </div>
  );
};

export default PaymentSuccessPage;
