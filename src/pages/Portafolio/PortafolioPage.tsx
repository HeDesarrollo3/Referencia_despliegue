// src/pages/PortafolioPage.tsx
import React, { useEffect } from "react";

const PortafolioPage: React.FC = () => {
  
   useEffect(() => {
      document.title = "Portafolio - HE";
    }, []);
  
  return (
    <div className="container mt-4">
      <h2>Portafolio de Pruebas</h2>
      <iframe
        src="https://silheplus.higueraescalante.com/Public/Portafolio"
        style={{ width: "100%", height: "90vh", border: "none" }}
        title="Portafolio"
      />
    </div>
  );
};

export default PortafolioPage;
