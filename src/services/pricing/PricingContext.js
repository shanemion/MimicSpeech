import React, { createContext, useContext, useState } from 'react';

// Create a context for pricing
const PricingContext = createContext();

// Custom hook to use the PricingContext
export const usePricing = () => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};

// Provider component
export const PricingProvider = ({ children }) => {
  const [pricingState, setPricingState] = useState(false);

  const value = {
    pricingState,
    setPricingState,
  };

  return (
    <PricingContext.Provider value={value}>
      {children}
    </PricingContext.Provider>
  );
};

export default PricingContext;
