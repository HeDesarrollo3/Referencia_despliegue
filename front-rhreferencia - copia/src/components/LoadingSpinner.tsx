import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="blood-spinner-container">
      <div className="blood-drops">
        <div className="drop drop1"></div>
        <div className="drop drop2"></div>
        <div className="drop drop3"></div>
      </div>
      <div className="syringe">
        <div className="barrel"></div>
        <div className="needle"></div>
      </div>
      <p className="loading-text">Cargando...</p>
    </div>
  );
};

export default LoadingSpinner;
