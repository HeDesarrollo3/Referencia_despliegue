import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiClipboard,
  FiAlertCircle,
  FiDollarSign,
  FiFileText,
  FiSettings,
  FiUsers,
  FiDownload
} from "react-icons/fi";
import "./Sidebar.css";
import { ImLab } from "react-icons/im";
import { RiTestTubeFill } from "react-icons/ri";

const Sidebar: React.FC = () => {
  const location = useLocation();

  // Leer usuario desde localStorage
  const userData = localStorage.getItem("user");
  const userRole = userData ? JSON.parse(userData).user_role : null;

  // 🔵 Enlaces para CLIENTES
  const clientLinks = [
    { to: "/dashboard", label: "Inicio", icon: <FiHome /> },
    { to: "/PreRegistroWizard", label: "PreOrden", icon: <FiClipboard /> },
    { to: "/GestorDeNovedades", label: "Muestras Registradas", icon: <RiTestTubeFill /> },
    { to: "/Tarifaria", label: "Tarifario", icon: <FiDollarSign /> },
    //{ to: "/portafolio", label: "Portafolio", icon: <FiFileText /> },
	{
      external: true,
      href: "https://silheplus.higueraescalante.com/Public/Portafolio",
      label: "Portafolio",
      icon: <FiFileText />,
    },

    // ✔ Enlace externo
    {
      external: true,
      href: "https://silheplus.higueraescalante.com/Public/ExtranetLogin",
      label: "Resultados",
      icon: <FiDownload />,
    },
  ];

  // 🟡 Enlaces para ADMIN
  const adminLinks = [
    { to: "/dashboard", label: "Inicio", icon: <FiHome /> },
    { to: "/admin", label: "Ordenes", icon: <FiSettings /> },
    { to: "/user", label: "Usuarios", icon: <FiUsers /> },
    { to: "/Tarifaria", label: "Tarifario", icon: <FiDollarSign /> },
    { to: "/portafolio", label: "Portafolio", icon: <FiFileText /> },
  ];

  // Selección según rol
  const links =
    userRole === "EBE2C0F1-84C3-4143-8FF8-9B0F888A2272" ? adminLinks : clientLinks;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="/higuerasinfondo.png" alt="Logo HE" />
      </div>

      <Nav className="flex-column sidebar-nav">
        {links.map((link, index) => (
          <Nav.Item key={index}>
            {/* 🔵 Enlace externo */}
            {"external" in link && link.external ? (
              <Nav.Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-link"
              >
                <span className="sidebar-icon">{link.icon}</span>
                <span className="sidebar-label">{link.label}</span>
              </Nav.Link>
            ) : (
              // 🟢 Enlace interno
              <Nav.Link
                as={Link}
                to={link.to!} // <-- se garantiza que no es undefined
                className={`sidebar-link ${
                  location.pathname === link.to ? "active" : ""
                }`}
              >
                <span className="sidebar-icon">{link.icon}</span>
                <span className="sidebar-label">{link.label}</span>
              </Nav.Link>
            )}
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
