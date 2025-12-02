import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { fetchDashBorad, fetchDashBoradUser } from "../../services/apiAdmin";
import {
  FiUserCheck,
  FiSend,
  FiXCircle,
  FiCheckCircle,
  FiSearch,
<<<<<<< HEAD
  FiSettings,  
  FiUserPlus,
=======
  FiAlertCircle,
  FiFileText,
  FiClipboard,
>>>>>>> 36cbe16984eebd6b355488bc8a310eb5b5dc45a0
} from "react-icons/fi";

const Dashboard: React.FC = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Obtener usuario
  const user = JSON.parse(localStorage.getItem("user") || "{}");

<<<<<<< HEAD
  // Detectar el rol (cambia según tu backend)
const role = user.user_role || "C2E3B48F-51A7-4B35-92D9-43EEBFBB6096";
=======
  // Detectar el rol
  const role = user.user_role || "C2E3B48F-51A7-4B35-92D9-43EEBFBB6096";
>>>>>>> 36cbe16984eebd6b355488bc8a310eb5b5dc45a0

  // Estado para los datos del dashboard
  const [dashboardData, setDashboardData] = useState<{
    registered: number;
    sentToSilhe: number;
    rejected: number;
    completed: number;
  } | null>(null);
   // Estado para los datos del dashboard Iser
  const [dashboardDataUser, setDashboardDataUser] = useState<{
    registered: number;
    active: number;
    rejected: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Tarjetas estáticas para roles diferentes a "EBE2C0F1-84C3-4143-8FF8-9B0F888A2272"
  const staticCards = [
    {
<<<<<<< HEAD
      title: "Administración",
      text: "Administración de órdenes.",
      route: "/admin",
      icon: <FiSettings size={32} className="text-warning mb-3" />,
      roles: ["EBE2C0F1-84C3-4143-8FF8-9B0F888A2272"], // Solo administradores
    },
     {
      title: "Administración Usuarios",
      text: "Administración de órdenes.",
      route: "/User",
      icon: <FiUserPlus size={32} className="text-warning mb-3" />,
      roles: ["EBE2C0F1-84C3-4143-8FF8-9B0F888A2272"], // Solo administradores
    },
    {
      title: "PreOrden",
      text: "Registra pacientes de forma anticipada.",
      route: "/PreRegistroWizard",
      icon: <FiClipboard size={32} className="text-warning mb-3" />,
      roles: ["C2E3B48F-51A7-4B35-92D9-43EEBFBB6096"], // Solo clientes
=======
      title: "Consulta de Resultados",
      text: "Visualiza los resultados de tus exámenes.",
      route: "/resultados",
      icon: <FiSearch size={32} className="text-primary mb-3" />,
>>>>>>> 36cbe16984eebd6b355488bc8a310eb5b5dc45a0
    },
    {
      title: "Gestor de Novedades",
      text: "Administra novedades y reportes.",
      route: "/GestorDeNovedades",
      icon: <FiAlertCircle size={32} className="text-danger mb-3" />,
<<<<<<< HEAD
      roles: ["C2E3B48F-51A7-4B35-92D9-43EEBFBB6096"], // Solo clientes
=======
>>>>>>> 36cbe16984eebd6b355488bc8a310eb5b5dc45a0
    },
    {
      title: "Portafolio de Pruebas",
      text: "Explora el portafolio de pruebas disponibles.",
      route: "/portafolio",
      icon: <FiFileText size={32} className="text-success mb-3" />,
<<<<<<< HEAD
      roles: ["EBE2C0F1-84C3-4143-8FF8-9B0F888A2272", "C2E3B48F-51A7-4B35-92D9-43EEBFBB6096"], // Todos los roles
=======
    },
    {
      title: "Pre Registro",
      text: "Registra pacientes de forma anticipada.",
      route: "/PreRegistroWizard",
      icon: <FiClipboard size={32} className="text-warning mb-3" />,
>>>>>>> 36cbe16984eebd6b355488bc8a310eb5b5dc45a0
    },
    {
      title: "Tarifaria",
      text: "Lista de productos tarifarios.",
      route: "/tarifaria",
      icon: <FiClipboard size={32} className="text-warning mb-3" />,
<<<<<<< HEAD
      roles: ["C2E3B48F-51A7-4B35-92D9-43EEBFBB6096"], // Solo clientes
=======
>>>>>>> 36cbe16984eebd6b355488bc8a310eb5b5dc45a0
    },
  ];

  // Efecto para cargar los datos del dashboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDashBorad(token);
        const dataUser = await fetchDashBoradUser(token);
        setDashboardData(data); // Guardar los datos obtenidos
        setDashboardDataUser(dataUser); // Guardar los datos obtenidos
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <Container fluid className="py-3">
      <h2 className="mb-5 fw-bold">Panel Principal</h2>

      {/* Mostrar Spinner mientras se cargan los datos */}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-3">Cargando datos...</p>
        </div>
      )}

      {/* Mostrar error si ocurre */}
      {/* {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )} */}

      <Row>
        {/* Renderizar tarjetas dinámicas solo para el rol específico */}
        {role === "EBE2C0F1-84C3-4143-8FF8-9B0F888A2272" && dashboardData && (
          <>
            <Col md={8} lg={3} className="mb-3">
              <Card className="shadow-sm h-100 border-0 rounded-3 card-hover" onClick={() => navigate('/admin')}>
                <Card.Body className="d-flex flex-column align-items-center text-center">
                  <FiFileText size={32} className="text-primary mb-3" />
                  <Card.Title className="fw-semibold">Pendientes</Card.Title>
                  <Card.Text className="text-muted">
                    {dashboardData.registered} Ordenes registradas
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8} lg={3} className="mb-3">
              <Card className="shadow-sm h-100 border-0 rounded-3 card-hover" onClick={() => navigate('/admin')}>
                <Card.Body className="d-flex flex-column align-items-center text-center">
                  <FiSend size={32} className="text-warning mb-3" />
                  <Card.Title className="fw-semibold">Enviados a Silhe</Card.Title>
                  <Card.Text className="text-muted">
                    {dashboardData.sentToSilhe} Ordenes enviados
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8} lg={3} className="mb-3">
              <Card className="shadow-sm h-100 border-0 rounded-3 card-hover"  onClick={() => navigate('/admin')}>
                <Card.Body className="d-flex flex-column align-items-center text-center">
                  <FiXCircle size={32} className="text-danger mb-3" />
                  <Card.Title className="fw-semibold">Rechazados</Card.Title>
                  <Card.Text className="text-muted">
                    {dashboardData.rejected} Ordenes rechazados
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8} lg={3} className="mb-3">
              <Card className="shadow-sm h-100 border-0 rounded-3 card-hover" onClick={() => navigate('/admin')}>
                <Card.Body className="d-flex flex-column align-items-center text-center">
                  <FiCheckCircle size={32} className="text-success mb-3" />
                  <Card.Title className="fw-semibold">Completados</Card.Title>
                  <Card.Text className="text-muted">
                    {dashboardData.completed} Ordenes completados
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>


            <Col md={8} lg={3} className="mb-3">
              <Card className="shadow-sm h-100 border-0 rounded-3 card-hover" onClick={() => navigate('/user')}>
              <Card.Body className="d-flex flex-column align-items-center text-center">
                <FiUserCheck size={32} className="text-primary mb-3" />
                <Card.Title className="fw-semibold">Pacientes</Card.Title>
                <Card.Text className="text-muted">
                {dashboardDataUser?.registered ?? 0} pacientes registrados, pendientes de activar.
                </Card.Text>
              </Card.Body>
              </Card>
            </Col>
            <Col md={8} lg={3} className="mb-3">
              <Card className="shadow-sm h-100 border-0 rounded-3 card-hover" onClick={() => navigate('/user')}>
              <Card.Body className="d-flex flex-column align-items-center text-center">
                <FiUserCheck size={32} className="text-success mb-3" />
                <Card.Title className="fw-semibold">Pacientes</Card.Title>
                <Card.Text className="text-muted">
                {dashboardDataUser?.active ?? 0} pacientes activos
                </Card.Text>
              </Card.Body>
              </Card>
            </Col>
            <Col md={8} lg={3} className="mb-3">
              <Card className="shadow-sm h-100 border-0 rounded-3 card-hover" onClick={() => navigate('/user')}>
                <Card.Body className="d-flex flex-column align-items-center text-center">
                  <FiUserCheck size={32} className="text-danger mb-3" />
                  <Card.Title className="fw-semibold">Pacientes</Card.Title>
                  <Card.Text className="text-muted">
                    {dashboardDataUser?.rejected ?? 0} pacientes rechazados
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {/* Renderizar tarjetas estáticas para roles diferentes */}
        {role !== "EBE2C0F1-84C3-4143-8FF8-9B0F888A2272" &&
          staticCards.map((card, index) => (
            <Col key={index} md={8} lg={3} className="mb-3">
              <Card
                className="shadow-sm h-100 border-0 rounded-3 card-hover card-img-top"
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
