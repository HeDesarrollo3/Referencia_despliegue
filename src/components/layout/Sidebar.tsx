// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FiHome,
//   FiFileText,
//   FiClipboard,
//   FiCreditCard,
//   FiAlertTriangle,
//   FiPackage,
//   FiLock,
// } from "react-icons/fi";

// const Sidebar = () => {
//   return (
//     <div
//       className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark min-vh-100 shadow-lg"
//       style={{ width: "250px" }}
//     >
//       {/* Logo */}
//       <div className="text-center mb-4">
//         <img
//           src="/logo1.png"
//           alt="HE Logo"
//           className="img-fluid mb-2"
//           style={{ maxHeight: "50px" }}
//         />
//         <h5 className="fw-bold">Portal HE</h5>
//       </div>

//       {/* Menú de navegación */}
//       <ul className="nav nav-pills flex-column mb-auto">
//         <li className="nav-item">
//           <NavLink
//             to="/dashboard"
//             className={({ isActive }) =>
//               `nav-link d-flex align-items-center mb-2 ${
//                 isActive ? "active bg-primary" : "text-white"
//               }`
//             }
//           >
//             <FiHome className="me-2" /> Inicio
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/resultados"
//             className={({ isActive }) =>
//               `nav-link d-flex align-items-center mb-2 ${
//                 isActive ? "active bg-primary" : "text-white"
//               }`
//             }
//           >
//             <FiFileText className="me-2" /> Resultados
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/preregistro"
//             className={({ isActive }) =>
//               `nav-link d-flex align-items-center mb-2 ${
//                 isActive ? "active bg-primary" : "text-white"
//               }`
//             }
//           >
//             <FiClipboard className="me-2" /> Pre Registro
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/pagos-en-linea"
//             className={({ isActive }) =>
//               `nav-link d-flex align-items-center mb-2 ${
//                 isActive ? "active bg-primary" : "text-white"
//               }`
//             }
//           >
//             <FiCreditCard className="me-2" /> Pagos en línea
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/incidencias"
//             className={({ isActive }) =>
//               `nav-link d-flex align-items-center mb-2 ${
//                 isActive ? "active bg-primary" : "text-white"
//               }`
//             }
//           >
//             <FiAlertTriangle className="me-2" /> Incidencias
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/logistica"
//             className={({ isActive }) =>
//               `nav-link d-flex align-items-center mb-2 ${
//                 isActive ? "active bg-primary" : "text-white"
//               }`
//             }
//           >
//             <FiPackage className="me-2" /> Logística
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/insumos"
//             className={({ isActive }) =>
//               `nav-link d-flex align-items-center mb-2 ${
//                 isActive ? "active bg-primary" : "text-white"
//               }`
//             }
//           >
//             <FiLock className="me-2" /> Insumos
//           </NavLink>
//         </li>
//       </ul>

//       {/* Footer del sidebar */}
//       <div className="mt-auto text-center text-secondary small">
//         <hr className="border-secondary" />
//         <p className="mb-0">&copy; 2025 Portal Clientes HE</p>
//         <p className="mb-0">Todos los derechos reservados</p>
//         <p className="mb-0 fw-light">v1.0.0-beta.2</p>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
// // src/components/layout/Sidebar.tsx
// import React from "react";
// import { Nav } from "react-bootstrap";
// import { Link, useLocation } from "react-router-dom";
// import {
//   FiHome,
//   FiSearch,
//   FiAlertCircle,
//   FiFileText,
//   FiClipboard,
//   FiDollarSign,
// } from "react-icons/fi";

// const Sidebar: React.FC = () => {
//   const location = useLocation();

//   const links = [
//     { to: "/dashboard", label: "Inicio", icon: <FiHome /> },
//     { to: "/PreRegistroWizard", label: "PreOrden", icon: <FiClipboard /> },
//     { to: "/resultados", label: "Resultados", icon: <FiSearch /> },
//     { to: "/GestorDeNovedades", label: "Novedades", icon: <FiAlertCircle /> },
//     { to: "/Tarifaria", label: "Tarifaria", icon: <FiDollarSign /> },
//     { to: "/portafolio", label: "Portafolio", icon: <FiFileText /> },
    
//   ];

//   return (
//     <div
//       className="d-flex flex-column text-white position-fixed vh-100"
//       style={{
//         width: "250px",
//         backgroundColor: "#1f2937", // gris oscuro
//         left: 0,
//         top: 0,
//         padding: "1rem",
//       }}
//     >
//       {/* <h3 className="text-center mb-4 fw-bold">HE</h3> */}
//       <div className="text-center mb-4">
//   <img src="/logo1.png" alt="Logo HE" style={{ maxWidth: "50px" }} className="img-fluid" />
// </div>
//       <Nav className="flex-column mb-auto">
//         {links.map((link) => (
//           <Nav.Item key={link.to}>
//             <Nav.Link
//               as={Link}
//               to={link.to}
//               className={`d-flex align-items-center text-white mb-2 ${
//                 location.pathname === link.to ? "active fw-bold" : ""
//               }`}
//             >
//               <span className="me-2">{link.icon}</span>
//               {link.label}
//             </Nav.Link>
//           </Nav.Item>
//         ))}
//       </Nav>
//     </div>
//   );
// };

// export default Sidebar;


// import React from "react";
// import { Nav } from "react-bootstrap";
// import { Link, useLocation } from "react-router-dom";
// import {
//   FiHome,
//   FiClipboard,
//   FiAlertCircle,
//   FiDollarSign,
//   FiFileText,
// } from "react-icons/fi";
// import "./Sidebar.css";

// const Sidebar: React.FC = () => {
//   const location = useLocation();

//   const links = [
//     { to: "/dashboard", label: "Inicio", icon: <FiHome /> },
//     { to: "/PreRegistroWizard", label: "PreOrden", icon: <FiClipboard /> },
//     { to: "/GestorDeNovedades", label: "Novedades", icon: <FiAlertCircle /> },
//     { to: "/Tarifaria", label: "Tarifaria", icon: <FiDollarSign /> },
//     { to: "/portafolio", label: "Portafolio", icon: <FiFileText /> },
//   ];

//   return (
//     <div className="sidebar d-flex flex-column position-fixed vh-100">
//       <div className="text-center mb-4 mt-3">
//         <img
//           src="/higuerasinfondo.png"
//           alt="Logo HE"
//           style={{ maxWidth: "230px" }}
//           className="img-fluid"
//         />
//       </div>

//       <Nav className="flex-column mb-auto">
//         {links.map((link) => (
//           <Nav.Item key={link.to}>
//             <Nav.Link
//               as={Link}
//               to={link.to}
//               className={`sidebar-link d-flex align-items-center ${
//                 location.pathname === link.to ? "active" : ""
//               }`}
//             >
//               {/* <span className="me-2 fs-5">{link.icon}</span> */}
//               <span className="me-3 sidebar-icon">{link.icon}</span>

//               <span>{link.label}</span>
//             </Nav.Link>
//           </Nav.Item>
//         ))}
//       </Nav>
//     </div>
//   );
// };

// export default Sidebar;


// src/components/layout/Sidebar.tsx
// src/components/layout/Sidebar.tsx
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
  FiUser
} from "react-icons/fi";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const location = useLocation();

  // Leer usuario desde localStorage
  const userData = localStorage.getItem("user");
  const userRole = userData ? JSON.parse(userData).user_role : null;

  

  //  Enlaces visibles para CLIENTES
  const clientLinks = [
    { to: "/dashboard", label: "Inicio", icon: <FiHome /> },
    { to: "/PreRegistroWizard", label: "PreOrden", icon: <FiClipboard /> },
    { to: "/GestorDeNovedades", label: "Novedades", icon: <FiAlertCircle /> },
    { to: "/Tarifaria", label: "Tarifaria", icon: <FiDollarSign /> },
    { to: "/portafolio", label: "Portafolio", icon: <FiFileText /> },
  ];

  //  Enlaces visibles para ADMINISTRADOR
  const adminLinks = [
    { to: "/dashboard", label: "Inicio", icon: <FiHome /> },
    { to: "/admin", label: "Ordenes", icon: <FiSettings /> },
    { to: "/user", label: "Usuarios", icon: <FiUser /> },
    { to: "/Tarifaria", label: "Tarifaria", icon: <FiDollarSign /> },
    { to: "/portafolio", label: "Portafolio", icon: <FiFileText /> },
    
  ];

  //  Seleccionar enlaces según rol
  const links = userRole === "EBE2C0F1-84C3-4143-8FF8-9B0F888A2272" ||
    userRole === "1112C0F1-84C3-4143-8FF8-9B0F888A2272" ? adminLinks : clientLinks;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="/higuerasinfondo.png" alt="Logo HE" />
      </div>

      <Nav className="flex-column sidebar-nav">
        {links.map((link) => (
          <Nav.Item key={link.to}>
            <Nav.Link
              as={Link}
              to={link.to}
              className={`sidebar-link ${
                location.pathname === link.to ? "active" : ""
              }`}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-label">{link.label}</span>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
