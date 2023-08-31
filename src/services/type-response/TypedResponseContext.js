import React, { createContext, useState, useContext } from 'react';

export const TypedResponseContext = createContext();

export const TypedResponseProvider = ({ children }) => {
  const [typedResponse, setTypedResponse] = useState(
    localStorage.getItem('typedResponse') || ''
  );

  return (
    <TypedResponseContext.Provider value={[typedResponse, setTypedResponse]}>
      {children}
    </TypedResponseContext.Provider>
  );
};

export const useTypedResponse = () => {
  const context = useContext(TypedResponseContext);
  if (!context) {
    throw new Error('useTypedResponse must be used within a TypedResponseProvider');
  }
  return context;
};
