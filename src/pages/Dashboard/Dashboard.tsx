// src/pages/Dashboard/Dashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FiFileText, FiAlertCircle, FiClipboard, FiSearch } from "react-icons/fi";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Consulta de Resultados",
      text: "Visualiza los resultados de tus exámenes.",
      route: "/resultados",
      icon: <FiSearch size={32} className="text-primary mb-3" />,
    },
    {
      title: "Gestor de Novedades",
      text: "Administra novedades y reportes.",
      route: "/GestorDeNovedades",
      icon: <FiAlertCircle size={32} className="text-danger mb-3" />,
    },
    {
      title: "Portafolio de Pruebas",
      text: "Explora el portafolio de pruebas disponibles.",
      route: "/portafolio",
      icon: <FiFileText size={32} className="text-success mb-3" />,
    },
    {
      title: "Pre Registro",
      text: "Registra pacientes de forma anticipada.",
      route: "/preregistro",
      icon: <FiClipboard size={32} className="text-warning mb-3" />,
    },
  ];

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4 fw-bold">Panel Principal</h2>
      <Row>
        {cards.map((card, index) => (
          <Col key={index} md={6} lg={3} className="mb-4">
            <Card
              className="shadow-sm h-100 border-0 rounded-3 card-hover"
              role="button"
              onClick={() => navigate(card.route)}
            >
              <Card.Body className="d-flex flex-column align-items-center text-center">
                {card.icon}
                <Card.Title className="fw-semibold">{card.title}</Card.Title>
                <Card.Text className="text-muted">{card.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;





//este es 09/09/2025 // src/pages/Dashboard.tsx
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Container, Row, Col, Card } from "react-bootstrap";

// const Dashboard: React.FC = () => {
//   const navigate = useNavigate();

//   const cards = [
//     {
//       title: "Consulta de Resultados",
//       text: "Visualiza los resultados de tus exámenes.",
//       route: "/resultados",
//     },
//     {
//       title: "Gestor de Novedades",
//       text: "Administra novedades y reportes.",
//       route: "/GestorDeNovedades",
//     },
//     {
//       title: "Portafolio de Pruebas",
//       text: "Explora el portafolio de pruebas disponibles.",
//       route: "/portafolio",
//     },
//     {
//       title: "Pre Registro",
//       text: "Registra pacientes de forma anticipada.",
//       route: "/preregistro",
//     },
//   ];

//   return (
//     <Container fluid>
//       <Row>
//         {/* Sidebar */}
//         {/* <Col md={2} className="bg-dark text-white vh-100 p-3">
//           <h4 className="text-center mb-4">Menú</h4>
//           <ul className="nav flex-column">
//             <li className="nav-item">
//               <a href="/dashboard" className="nav-link text-white">
//                 Inicio
//               </a>
//             </li>
//             <li className="nav-item">
//               <a href="/resultados" className="nav-link text-white">
//                 Resultados
//               </a>
//             </li>
//             <li className="nav-item">
//               <a href="/preregistro" className="nav-link text-white">
//                 Pre-registro
//               </a>
//             </li>
//           </ul>
//         </Col> */}

//         {/* Contenido principal */}
//         <Col md={10} className="p-4">
//           <h2 className="mb-4">Dashboard</h2>
//           <Row>
//             {cards.map((card, index) => (
//               <Col key={index} md={6} lg={3} className="mb-4">
//                 <Card
//                   className="shadow-sm h-100"
//                   role="button"
//                   onClick={() => navigate(card.route)}
//                 >
//                   <Card.Body>
//                     <Card.Title>{card.title}</Card.Title>
//                     <Card.Text>{card.text}</Card.Text>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Dashboard;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Button from '../../components/common/Button'; // Asegúrate de que este componente existe
// import MainLayout from '../../components/layout/MainLayout'; // Importamos el MainLayout unificado

// const Dashboard = () => {
//   const navigate = useNavigate();

//   // El MainLayout ahora maneja el Topbar y el Sidebar.
//   // Solo necesitamos el contenido principal del dashboard aquí.
//   return (
//     <div className="container mt-4">
//       <h2 className="text-2xl font-bold mb-4">Dashboard Principal</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Tarjeta de Consulta de resultados */}
//         <div className="card bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-200 cursor-pointer">
//           <h5 className="text-lg font-semibold text-gray-800 mb-2">Consulta de resultados</h5>
//           <p className="text-gray-600 mb-4">Ver los resultados de sus pacientes</p>
//           <Button label="Ingresar" onClick={() => navigate('/resultados')} />
//         </div>

//         {/* Tarjeta de Gestor de novedades */}
//         <div className="card bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-200 cursor-pointer">
//           <h5 className="text-lg font-semibold text-gray-800 mb-2">Gestor de novedades</h5>
//           <p className="text-gray-600 mb-4">Consulta las novedades del portal</p>
//           <Button label="Ingresar" onClick={() => navigate('/gestor-novedades')} />
//         </div>

//         {/* Tarjeta de Portafolio de pruebas */}
//         <div className="card bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-200 cursor-pointer">
//           <h5 className="text-lg font-semibold text-gray-800 mb-2">Portafolio de pruebas</h5>
//           <p className="text-gray-600 mb-4">Consulta del portafolio de pruebas</p>
//           <Button label="Ingresar" onClick={() => navigate('/portafolio-pruebas')} />
//         </div>

//         {/* Tarjeta de Pre-registro */}
//         <div className="card bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-200 cursor-pointer">
//           <h5 className="text-lg font-semibold text-gray-800 mb-2">Pre registro</h5>
//           <p className="text-gray-600 mb-4">Registrar y gestionar pre-registros</p>
//           <Button label="Ingresar" onClick={() => navigate('/pre-registro')} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
