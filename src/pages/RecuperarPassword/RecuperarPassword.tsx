import React, { useEffect, useState } from "react";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { changePassword } from "../../services/api";

const ChangePasswordPage: React.FC = () => {


  
   useEffect(() => {
      document.title = "Recuperar contraseña - HE";
    }, []);
  
  const [formData, setFormData] = useState({
    identificationType: "",
    identification: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const body = {
        identificationType: formData.identificationType,
        identification: formData.identification,
        email: formData.email,
        passwordHash: formData.password,
      };

      await changePassword(token, body);

      setMessage("Contraseña actualizada con éxito.");
    } catch (err: any) {
  console.log("ERROR FRONT:", err);

  if (err.message === "USER_NOT_FOUND") {
    setError("Usuario no encontrado o no registrado.");
  } else {
    setError(err.message || "No se pudo actualizar la contraseña.");
  }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <Card className="shadow-sm border-0">
        <Card.Body>
          <div className="text-center mb-3">
            <img src="/logo1.png" alt="Logo" style={{ width: "120px" }} />
          </div>

          <h3 className="fw-bold mb-3 text-center text-danger">🔐 Recuperar Contraseña</h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de documento</Form.Label>
              <Form.Select
                value={formData.identificationType}
                onChange={(e) =>
                  setFormData({ ...formData, identificationType: e.target.value })
                }
                required
              >
                <option value="">Seleccione...</option>
                <option value="CC">Cédula</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="NIT">NIT</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Número de documento</Form.Label>
              <Form.Control
                type="text"
                value={formData.identification}
                onChange={(e) =>
                  setFormData({ ...formData, identification: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nueva contraseña</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </Form.Group>

            <Button className="w-100" variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : "Actualizar Contraseña"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;



// import React, { useState } from "react";
// import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
// import { changePassword } from "../../services/api";

// const ChangePasswordPage: React.FC = () => {
//   const [formData, setFormData] = useState({
//     identificationType: "",
//     identification: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const token = localStorage.getItem("token") || "";

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setMessage(null);

//     try {
//       const body = {
//         identificationType: formData.identificationType,
//         identification: formData.identification,
//         email: formData.email,
//         passwordHash: formData.password, //  Se envía tal cual el backend lo espera
//       };

//       await changePassword(token, body);

//       setMessage("Contraseña actualizada con éxito.");
//     } catch (err) {
//       setError("No se pudo actualizar la contraseña.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5" style={{ maxWidth: "500px" }}>
//       <Card className="shadow-sm border-0">
//         <Card.Body>
//           <div className="text-center mb-3">
// <img src="/logo1.png" alt="Logo" style={{ width: "120px" }} />
// </div>
//           <h3 className="fw-bold mb-3 text-center text-danger">🔐 Recuperar Contraseña</h3>

//           {error && <Alert variant="danger">{error}</Alert>}
//           {message && <Alert variant="success">{message}</Alert>}

//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Tipo de documento</Form.Label>
//               <Form.Select
//                 value={formData.identificationType}
//                 onChange={(e) =>
//                   setFormData({ ...formData, identificationType: e.target.value })
//                 }
//                 required
//               >
//                 <option value="">Seleccione...</option>
//                 <option value="CC">Cédula</option>
//                 <option value="TI">Tarjeta de identidad</option>
//                 <option value="NIT">NIT</option>
//               </Form.Select>
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Número de documento</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={formData.identification}
//                 onChange={(e) =>
//                   setFormData({ ...formData, identification: e.target.value })
//                 }
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Correo electrónico</Form.Label>
//               <Form.Control
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Nueva contraseña</Form.Label>
//               <Form.Control
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) =>
//                   setFormData({ ...formData, password: e.target.value })
//                 }
//                 required
//               />
//             </Form.Group>

//             <Button className="w-100" variant="primary" type="submit" disabled={loading}>
//               {loading ? <Spinner size="sm" animation="border" /> : "Actualizar Contraseña"}
//             </Button>
//           </Form>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default ChangePasswordPage;
