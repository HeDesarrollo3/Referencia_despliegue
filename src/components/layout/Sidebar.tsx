import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiFileText,
  FiClipboard,
  FiCreditCard,
  FiAlertTriangle,
  FiPackage,
  FiLock,
} from "react-icons/fi";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark min-vh-100 shadow-lg"
      style={{ width: "250px" }}
    >
      {/* Logo */}
      <div className="text-center mb-4">
        <img
          src="/logo1.png"
          alt="HE Logo"
          className="img-fluid mb-2"
          style={{ maxHeight: "50px" }}
        />
        <h5 className="fw-bold">Portal HE</h5>
      </div>

      {/* Menú de navegación */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center mb-2 ${
                isActive ? "active bg-primary" : "text-white"
              }`
            }
          >
            <FiHome className="me-2" /> Inicio
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/resultados"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center mb-2 ${
                isActive ? "active bg-primary" : "text-white"
              }`
            }
          >
            <FiFileText className="me-2" /> Resultados
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/preregistro"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center mb-2 ${
                isActive ? "active bg-primary" : "text-white"
              }`
            }
          >
            <FiClipboard className="me-2" /> Pre Registro
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/pagos-en-linea"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center mb-2 ${
                isActive ? "active bg-primary" : "text-white"
              }`
            }
          >
            <FiCreditCard className="me-2" /> Pagos en línea
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/incidencias"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center mb-2 ${
                isActive ? "active bg-primary" : "text-white"
              }`
            }
          >
            <FiAlertTriangle className="me-2" /> Incidencias
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/logistica"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center mb-2 ${
                isActive ? "active bg-primary" : "text-white"
              }`
            }
          >
            <FiPackage className="me-2" /> Logística
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/insumos"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center mb-2 ${
                isActive ? "active bg-primary" : "text-white"
              }`
            }
          >
            <FiLock className="me-2" /> Insumos
          </NavLink>
        </li>
      </ul>

      {/* Footer del sidebar */}
      <div className="mt-auto text-center text-secondary small">
        <hr className="border-secondary" />
        <p className="mb-0">&copy; 2025 Portal Clientes HE</p>
        <p className="mb-0">Todos los derechos reservados</p>
        <p className="mb-0 fw-light">v1.0.0-beta.2</p>
      </div>
    </div>
  );
};

export default Sidebar;
