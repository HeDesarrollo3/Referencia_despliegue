// src/components/layout/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      className="footer text-white text-center py-2 mt-auto"
      style={{ backgroundColor: "#1f2937" }}
    >
      <hr className="border-secondary m-0" />
      <p className="mb-0">&copy; 2025 Portal Clientes HE</p>
      {/* <p className="mb-0">Todos los derechos reservados</p> */}
      <p className="mb-0 fw-light">v1.0.0-beta.1</p>
    </footer>
  );
};

export default Footer;
