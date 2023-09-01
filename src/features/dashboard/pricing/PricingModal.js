import React from 'react';
import Pricing from './Pricing';
import './PricingModal.css';

const PricingModal = ({ onClose }) => {
  return (
    <div className="pricing-modal">
      <div className="pricing-modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h1>Choose a plan</h1>
        <Pricing />
      </div>
    </div>
  );
};

export default PricingModal;
