import React, { useEffect, useRef, useState } from "react";
import {
  Navbar,
  Nav,
  Badge,
  Dropdown,
  Modal,
  Button,
  ListGroup,
  Accordion,
} from "react-bootstrap";
import { FiBell, FiHelpCircle, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket/socket";

interface TopbarProps {
  pageTitle: string;
  onLogout: () => void;
}






const Topbar: React.FC<TopbarProps> = ({ pageTitle, onLogout }) => {

const videoGuides = [
  {
    id: 1,
    title: "Crear PreOrden",
    description: "Paso a paso para crear una nueva PreOrden",
    src: "/videos/ComoCrearPreOrden.mp4",
  },
  {
    id: 2,
    title: "Generar Reportes",
    description: "Guía para generar reportes del sistema",
    src: "/videos/GenerarReportes.mp4",
  },
  {
    id: 3,
    title: "Muestras Registradas",
    description: "Cómo consultar y gestionar muestras registradas",
    src: "/videos/MuestrasRegistradas.mp4",
  },
];




  const [userName, setUserName] = useState("Usuario");
  const [showModal, setShowModal] = useState(false);
  const [showModalAyuda, setShowModalAyuda] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

  const hasRegistered = useRef(false);

  console.log("🚀 Renderizando Topbar");

  useEffect(() => {
    // 👤 Usuario
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserName(
        `${userData.user_lastName || ""} ${userData.user_surName || ""}`.trim()
      );
    }

    const registerClient = () => {
      if (hasRegistered.current || socket.registered) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const customerId = payload.customerId;

      console.log("📡 Registrando cliente en socket:", customerId);

      socket.emit("registerClient", { customerId });

      hasRegistered.current = true;
      socket.registered = true;
    };

    // 🟢 Si ya está conectado
    if (socket.connected) {
      registerClient();
    }

    // 🟡 Si se conecta después
    socket.on("connect", () => {
      console.log("🟢 WebSocket conectado");
      registerClient();
    });

    // 🔔 Notificaciones
    socket.on("orderCompleted", (data: any) => {
      console.log("🔔 Notificación recibida:", data);

      const msg =
        typeof data === "string"
          ? data
          : data?.message || JSON.stringify(data);

      setNotifications((prev) => [
        {
          id: Date.now(),
          message: msg,
          date: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("connect");
      socket.off("orderCompleted");
    };
  }, []);

  const handleLogout = () => {
    socket.registered = false;
    onLogout();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm px-4 topbar">
        <Nav className="ms-auto d-flex align-items-center">
          <Nav.Link
            className="position-relative me-3"
            onClick={() => setShowModal(true)}
          >
            <FiBell size={20} />
            {notifications.length > 0 && (
              <Badge
                bg="danger"
                pill
                className="position-absolute top-0 start-100 translate-middle"
              >
                {notifications.length}
              </Badge>
            )}
          </Nav.Link>

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              className="d-flex align-items-center border-0 bg-transparent"
            >
              <FiUser size={20} className="me-2 text-primary" />
              <span className="fw-semibold text-dark">{userName}</span>
                
              
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate("/profile")}>
                👤 Perfil
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/settings")}>
                ⚙️ Configuración
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                🚪 Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

<Nav.Link
            className="position-relative me-3"
            onClick={() => setShowModalAyuda(true)}
          >
            <FiHelpCircle size={20} />
            <span className="fw-semibold text-dark">Ayuda</span>
            {/* {notifications.length > 0 && (
              <Badge
                bg="danger"
                pill
                className="position-absolute top-0 start-100 translate-middle"
              >
                {notifications.length}
              </Badge>
            )} */}
          </Nav.Link>

        </Nav>
      </Navbar>


 {/* Modal de Ayuda */}
<Modal
  show={showModalAyuda}
  onHide={() => setShowModalAyuda(false)}
  centered
  size="lg"
>
  <Modal.Header closeButton className="bg-light">
    <Modal.Title>🆘 Centro de Ayuda</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {videoGuides.length === 0 ? (
      <p className="text-center text-muted">
        No hay guías disponibles
      </p>
    ) : (
      <Accordion flush>
  {videoGuides.map((video, index) => (
    <Accordion.Item eventKey={index.toString()} key={video.id}>
      <Accordion.Header>
        🎥 {video.title}
      </Accordion.Header>

      <Accordion.Body>
        <p className="text-muted mb-2">
          {video.description}
        </p>

        <div className="ratio ratio-16x9 rounded overflow-hidden border">
          <video
            src={video.src}
            controls
            preload="metadata"
            className="w-100 h-100"
          >
            Tu navegador no soporta video HTML5.
          </video>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  ))}
</Accordion>

    )}
  </Modal.Body>

  <Modal.Footer>
    <Button
      variant="outline-secondary"
      size="sm"
      onClick={() => setShowModalAyuda(false)}
    >
      Cerrar
    </Button>
  </Modal.Footer>
</Modal>



{/* ///modal para notificaciones */}


      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>🔔 Notificaciones</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {notifications.length === 0 ? (
            <p className="text-center text-muted">No tienes notificaciones</p>
          ) : (
            <ListGroup variant="flush">
              {notifications.map((n) => (
                <ListGroup.Item key={n.id}>
                  <div className="fw-semibold">{n.message}</div>
                  <small className="text-muted">{n.date}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Topbar;



// ///este el actualizado con sockets y funcional 
// // src/pages/Dashboard/Topbar.tsx
// import React, { useEffect, useState } from "react";
// import { Navbar, Nav, Badge, Dropdown, Modal, Button, ListGroup } from "react-bootstrap";
// import { FiBell, FiUser } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { socket } from "../../socket/socket";

// interface TopbarProps {
//   pageTitle: string;
//   onLogout: () => void;
// }

// const Topbar: React.FC<TopbarProps> = ({ pageTitle, onLogout }) => {
//   const [userName, setUserName] = useState("Usuario");
//   const [showModal, setShowModal] = useState(false);
//   const [notifications, setNotifications] = useState<any[]>([]);
//   const navigate = useNavigate();

//   console.log("🚀 Renderizando socket");


//   useEffect(() => {
//   const storedUser = localStorage.getItem("user");
//   if (storedUser) {
//     const userData = JSON.parse(storedUser);
//     setUserName(
//       `${userData.user_lastName || ""} ${userData.user_surName || ""}`.trim()
//     );
//   }

//   const registerClient = () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const payload = JSON.parse(atob(token.split(".")[1]));
//     const customerId = payload.customerId;

//     console.log("📡 Registrando cliente en socket:", customerId);
//     socket.emit("registerClient", { customerId });
//   };

//   // 🟢 SI YA ESTÁ CONECTADO
//   if (socket.connected) {
//     console.log("🟢 Socket ya estaba conectado");
//     registerClient();
//   }

//   // 🟡 SI SE CONECTA DESPUÉS
//   socket.on("connect", () => {
//     console.log("🟢 WebSocket conectado");
//     registerClient();
//   });

//   // 🔔 Notificaciones
//   socket.on("orderCompleted", (data: any) => {
//     console.log("🔔 Notificación recibida:", data);

//     const msg =
//       typeof data === "string"
//         ? data
//         : data?.message || JSON.stringify(data);

//     setNotifications((prev) => [
//       {
//         id: Date.now(),
//         message: msg,
//         date: new Date().toLocaleString(),
//       },
//       ...prev,
//     ]);
//   });

//   return () => {
//     socket.off("connect");
//     socket.off("orderCompleted");
//   };
// }, []);


//   // useEffect(() => {
//   //   const storedUser = localStorage.getItem("user");
//   //   if (storedUser) {
//   //     const userData = JSON.parse(storedUser);
//   //     setUserName(
//   //       `${userData.user_lastName || ""} ${userData.user_surName || ""}`.trim()
//   //     );
//   //   }

//   //   // 🔵 Esperar conexión del socket para registrar el cliente
//   //   socket.on("connect", () => {
//   //     console.log("🟢 WebSocket conectado desde Topbar");

//   //     const token = localStorage.getItem("token");
//   //     if (token) {
//   //       const payload = JSON.parse(atob(token.split(".")[1])); 
//   //       const customerId = payload.customerId;

//   //       console.log("📡 Enviando customerId al servidor:", customerId);

//   //       socket.emit("registerClient", { customerId });
//   //     }
//   //   });

//   //   // 🔔 Recibir notificaciones
//   //   socket.on("orderCompleted", (data: any) => {
//   //     console.log("🔔 Notificación recibida en Topbar:", data);

//   //     const msg =
//   //       typeof data === "string"
//   //         ? data
//   //         : data?.message || JSON.stringify(data);

//   //     setNotifications((prev) => [
//   //       {
//   //         id: Date.now(),
//   //         message: msg,
//   //         date: new Date().toLocaleString(),
//   //       },
//   //       ...prev,
//   //     ]);
//   //   });

//   //   return () => {
//   //     socket.off("orderCompleted");
//   //     socket.off("connect");
//   //   };
//   // }, []);

//   const handleLogout = () => {
//     onLogout();
//     localStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <>
//       <Navbar bg="white" expand="lg" className="shadow-sm px-4 topbar">
//         <Nav className="ms-auto d-flex align-items-center">

//           <Nav.Link className="position-relative me-3" onClick={() => setShowModal(true)}>
//             <FiBell size={20} />
//             {notifications.length > 0 && (
//               <Badge
//                 bg="danger"
//                 pill
//                 className="position-absolute top-0 start-100 translate-middle"
//               >
//                 {notifications.length}
//               </Badge>
//             )}
//           </Nav.Link>

//           <Dropdown align="end">
//             <Dropdown.Toggle variant="light" className="d-flex align-items-center border-0 bg-transparent">
//               <FiUser size={20} className="me-2 text-primary" />
//               <span className="fw-semibold text-dark">{userName}</span>
//             </Dropdown.Toggle>

//             <Dropdown.Menu>
//               <Dropdown.Item onClick={() => navigate("/profile")}>👤 Perfil</Dropdown.Item>
//               <Dropdown.Item onClick={() => navigate("/settings")}>⚙️ Configuración</Dropdown.Item>
//               <Dropdown.Divider />
//               <Dropdown.Item onClick={handleLogout}>🚪 Cerrar sesión</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//         </Nav>
//       </Navbar>

//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton className="bg-light">
//           <Modal.Title>🔔 Notificaciones</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           {notifications.length === 0 ? (
//             <p className="text-center text-muted">No tienes notificaciones</p>
//           ) : (
//             <ListGroup variant="flush">
//               {notifications.map((n) => (
//                 <ListGroup.Item key={n.id}>
//                   <div className="fw-semibold">{n.message}</div>
//                   <small className="text-muted">{n.date}</small>
//                 </ListGroup.Item>
//               ))}
//             </ListGroup>
//           )}
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="outline-secondary" size="sm" onClick={() => setShowModal(false)}>
//             Cerrar
//           </Button>

//           {/* <Button variant="primary" size="sm" onClick={() => navigate("/notificaciones")}>
//             Ver todas
//           </Button> */}
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default Topbar;







// import React, { useEffect, useState } from "react";
// import { Navbar, Nav, Badge, Dropdown, Modal, Button, ListGroup } from "react-bootstrap";
// import { FiBell, FiUser } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

// interface TopbarProps {
//   pageTitle: string;
//   onLogout: () => void;
// }

// const Topbar: React.FC<TopbarProps> = ({ pageTitle, onLogout }) => {
//   const [userName, setUserName] = useState("Usuario");
//   const [showModal, setShowModal] = useState(false);
//   const [notifications, setNotifications] = useState<any[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     // 🔹 Verificar expiración del token JWT
//     if (token) {
//       try {
//         const payload = JSON.parse(atob(token.split(".")[1]));
//         const currentTime = Math.floor(Date.now() / 1000);

//         if (payload.exp && payload.exp < currentTime) {
//           // 🔴 Token expirado → cerrar sesión
//           alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
//           handleLogoutClick();
//           return;
//         }

//         // ✅ Mostrar nombre de usuario
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//           const userData = JSON.parse(storedUser);
//           const fullName = `${userData.user_lastName || ""} ${userData.user_surName || ""}`.trim();
//           setUserName(fullName || "Usuario");
//         } else {
//           setUserName(payload.ident || "Usuario");
//         }
//       } catch (error) {
//         console.error("Error al procesar el token:", error);
//         handleLogoutClick();
//       }
//     } else {
//       // 🔴 No hay token → redirigir a login
//       handleLogoutClick();
//     }

//     // 🔔 Cargar notificaciones simuladas
//     const fetchNotifications = async () => {
//       try {
//         const fakeData = [
//           { id: 1, message: "🧪 Resultado disponible: Hemograma", date: "2025-10-21 09:00" },
//           { id: 2, message: "📅 Cita programada para mañana", date: "2025-10-22 08:30" },
//           { id: 3, message: "⚠️ Recuerda actualizar tu correo electrónico", date: "2025-10-20 16:45" },
//         ];
//         setNotifications(fakeData);
//       } catch (err) {
//         console.error("Error al obtener notificaciones:", err);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   // 🔹 Cerrar sesión (también usado cuando expira el token)
//   const handleLogoutClick = () => {
//     onLogout();
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   const handleProfileClick = () => navigate("/profile");
//   const handleSettingsClick = () => navigate("/settings");
//   const handleOpenModal = () => setShowModal(true);
//   const handleCloseModal = () => setShowModal(false);

//   return (
//     <>
//       <Navbar
//         bg="white"
//         expand="lg"
//         className="shadow-sm px-4 d-flex justify-content-between align-items-center"
//         style={{ height: "60px" }}
//       >
//         <Navbar.Brand className="fw-bold text-primary fs-5">{pageTitle}</Navbar.Brand>

//         <Nav className="d-flex align-items-center">
//           <Nav.Link className="position-relative me-3" onClick={handleOpenModal}>
//             <FiBell size={20} />
//             {notifications.length > 0 && (
//               <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
//                 {notifications.length}
//               </Badge>
//             )}
//           </Nav.Link>

//           <Dropdown align="end">
//             <Dropdown.Toggle
//               variant="light"
//               id="dropdown-basic"
//               className="d-flex align-items-center border-0 bg-transparent"
//             >
//               <FiUser size={20} className="me-2 text-danger" />
//               <span className="fw-semibold">{userName}</span>
//             </Dropdown.Toggle>

//             <Dropdown.Menu>
//               <Dropdown.Item onClick={handleProfileClick}>👤 Perfil</Dropdown.Item>
//               <Dropdown.Item onClick={handleSettingsClick}>⚙️ Configuración</Dropdown.Item>
//               <Dropdown.Divider />
//               <Dropdown.Item onClick={handleLogoutClick}>🚪 Cerrar sesión</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//         </Nav>
//       </Navbar>

//       <Modal show={showModal} onHide={handleCloseModal} centered>
//         <Modal.Header closeButton className="bg-light">
//           <Modal.Title>🔔 Notificaciones</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {notifications.length === 0 ? (
//             <p className="text-center text-muted mb-0">No tienes notificaciones nuevas</p>
//           ) : (
//             <ListGroup variant="flush">
//               {notifications.map((n) => (
//                 <ListGroup.Item key={n.id}>
//                   <div className="fw-semibold">{n.message}</div>
//                   <small className="text-muted">{n.date}</small>
//                 </ListGroup.Item>
//               ))}
//             </ListGroup>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="outline-secondary" size="sm" onClick={handleCloseModal}>
//             Cerrar
//           </Button>
//           <Button variant="primary" size="sm" onClick={() => navigate("/notificaciones")}>
//             Ver todas
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default Topbar;


//7/11// src/pages/Dashboard/Dashboard.tsx
