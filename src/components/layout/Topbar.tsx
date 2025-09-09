// import React from "react";
// import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
// import { FiLogOut, FiBell, FiUser } from "react-icons/fi";

// interface GetInitialsFn {
//   (name: string): string;
// }

// const getInitials: GetInitialsFn = (name) => {
//   if (!name || typeof name !== "string") {
//     return "HE";
//   }
//   return name
//     .split(" ")
//     .map((word) => word.charAt(0))
//     .join("")
//     .toUpperCase();
// };

// interface TopbarProps {
//   pageTitle: string;
//   onLogout: () => void;
//   userName: string;
// }

// const Topbar: React.FC<TopbarProps> = ({ pageTitle, onLogout, userName }) => {
//   const userInitials = getInitials(userName);

//   return (
//     <Navbar bg="white" expand="lg" className="shadow-sm py-3 sticky-top">
//       {" "}
//       <Container fluid>
//         {/* Título de la página */}{" "}
//         <Navbar.Brand href="#" className="fw-bold fs-5 text-gray-800">
//           {pageTitle}
//         </Navbar.Brand>
//         {/* Íconos y perfil de usuario */}{" "}
//         <Nav className="ms-auto d-flex align-items-center">
//           {/* Icono de notificación */}{" "}
//           <Nav.Item>
//             {" "}
//             <a href="#" className="nav-link p-2 bg-light rounded-circle me-2">
//               <FiBell className="text-gray-600 fs-5" />{" "}
//             </a>{" "}
//           </Nav.Item>
//           {/* Perfil de usuario */}{" "}
//           <Nav.Item>
//             {" "}
//             <NavDropdown
//               title={
//                 <div className="d-flex align-items-center">
//                   {" "}
//                   <div
//                     className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-2"
//                     style={{ width: "32px", height: "32px", fontSize: "1rem" }}
//                   >
//                     {userInitials}{" "}
//                   </div>{" "}
//                   <span className="d-none d-sm-block text-dark fw-medium">
//                     {userName}
//                   </span>{" "}
//                 </div>
//               }
//               id="user-dropdown"
//             >
//               {" "}
//               <NavDropdown.Item onClick={onLogout}>
//                 <FiLogOut className="text-danger me-2" />
//                 Cerrar sesión{" "}
//               </NavDropdown.Item>{" "}
//             </NavDropdown>{" "}
//           </Nav.Item>{" "}
//         </Nav>{" "}
//       </Container>{" "}
//     </Navbar>
//   );
// };

// export default Topbar;


// src/components/layout/Topbar.tsx
import React from "react";
import { Navbar, Nav, Badge, Dropdown } from "react-bootstrap";
import { FiBell, FiUser } from "react-icons/fi";

interface TopbarProps {
  pageTitle: string;
  userName: string;
  onLogout: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ pageTitle, userName, onLogout }) => {
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm px-4">
      <Navbar.Brand className="fw-bold text-primary">{pageTitle}</Navbar.Brand>
      <Nav className="ms-auto d-flex align-items-center">
        <Nav.Link className="position-relative me-3">
          <FiBell size={20} />
          <Badge
            bg="danger"
            pill
            className="position-absolute top-0 start-100 translate-middle"
          >
            3
          </Badge>
        </Nav.Link>
        <Dropdown align="end">
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            <FiUser size={20} className="me-1" /> {userName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Perfil</Dropdown.Item>
            <Dropdown.Item>Configuración</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={onLogout}>Cerrar sesión</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default Topbar;
