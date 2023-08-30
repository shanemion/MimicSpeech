import React from 'react';
import Pricing from '../landing-page/components/pricing/Pricing';
import './PricingModal.css';

const PricingModal = ({ onClose }) => {
  return (
    <div className="pricing-modal">
      <div className="pricing-modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <Pricing />
      </div>
    </div>
  );
};

export default PricingModal;
