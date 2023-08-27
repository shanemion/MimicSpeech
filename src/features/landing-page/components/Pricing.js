import React from "react";
import "./Pricing.css";

const Pricing = () => {
  const plans = [
    {
      header: "Free",
      price: "$0",
      billing: "Billed Monthly",
      features: [
        "5 free credits",
        "GPT-3.5 access",
        "Natural sounding Text to Speech",
        "Option to save responses",
        "3 sentence responses",
      ],
      buttonText: "Buy this plan",
    },
    {
      header: "Pro",
      price: "$4.99",
      billing: "Billed Monthly",
      features: [
        "15 credits a month",
        "GPT-4 access",
        "Natural sounding Text to Speech",
        "Option to save responses",
        "Up to 8 sentence responses",
      ],
      buttonText: "Buy this plan",
    },
    {
      header: "Unlimited",
      price: "$9.99",
      billing: "Billed Monthly",
      features: [
        "Unlimited credits",
        "GPT-4 access",
        "Natural sounding Text to Speech",
        "Option to save responses",
        "10 sentence responses",
      ],
      buttonText: "Buy this plan",
    },
  ];

  return (
    <div>
      <div className="pricing-container">
        <div className="inside-pricing-container">
          {plans.map((plan, index) => (
            <div className="pricing-box" key={index}>
              <h3>{plan.header}</h3>
              <div className="price">
                <span>{plan.price}</span>
                <span className="billing">{plan.billing}</span>
              </div>
              <button className="buy-button">{plan.buttonText}</button>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    {/* You can import and add an icon here */}
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 120 }}></div>
    </div>
  );
};

export default Pricing;
