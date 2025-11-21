// src/pages/UserSettings/UserSettingsPage.tsx
import React, { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { changeUserPassword } from "../../services/api";
import { parseJwt } from "../../utils/jwt";

const UserSettingsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    
    user_names: "",
    user_lastName: "",
    user_surName: "",
    user_identificationType: "",
    user_identification: "",
    user_email: "",
    passwordHash: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ✅ Cargar datos desde localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      const decoded = parseJwt(token);
      const parsedUser = JSON.parse(userData);

      // Combinar información (por si el token trae datos adicionales)
      const fullUser = { ...decoded, ...parsedUser };

      // 🔹 Llenar formulario con la info actual
      setFormData({
        user_names: fullUser.user_names || "",
        user_lastName: fullUser.user_lastName || "",
        user_surName: fullUser.user_surName || "",
        user_identificationType: fullUser.user_identificationType || "",
        user_identification: fullUser.user_identification || "",
        user_email: fullUser.user_email || "",
        passwordHash: "",
      });
    }
  }, []);

  // ✅ Manejo de cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró el token de sesión.");

      // Solo si cambia la contraseña
      if (!formData.passwordHash.trim()) {
        setMessage({ type: "error", text: "Por favor ingresa una nueva contraseña." });
        setLoading(false);
        return;
      }

      // ✅ Validar formato de contraseña antes de enviar
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
if (!passwordRegex.test(formData.passwordHash)) {
  setMessage({
    type: "error",
    text: "La contraseña debe tener al menos una mayúscula, una minúscula y un número.",
  });
  setLoading(false);
  return;
}



      await changeUserPassword(token, formData);
      setMessage({ type: "success", text: "✅ Datos actualizados correctamente." });
      setFormData({ ...formData, passwordHash: "" });
    } catch (err: any) {
      console.error("❌ Error:", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "No se pudo actualizar la información. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout pageTitle="Configuración">
      <div className="container mt-4">
        <Card className="shadow-sm border-0">
          <Card.Body>
            <h4 className="mb-4 text-primary fw-bold">Configuración de Usuario</h4>

            {message && (
              <Alert
                variant={message.type === "success" ? "success" : "danger"}
                className="text-center"
              >
                {message.text}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <Form.Label>Nombres</Form.Label>
                  <Form.Control
                    type="text"
                    name="user_names"
                    value={formData.user_names}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <Form.Label>Primer Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="user_lastName"
                    value={formData.user_lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <Form.Label>Segundo Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="user_surName"
                    value={formData.user_surName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <Form.Label>Tipo de documento</Form.Label>
                  <Form.Control
                    type="text"
                    name="user_identificationType"
                    value={formData.user_identificationType}
                    // onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <Form.Label>Número de documento</Form.Label>
                  <Form.Control
                    type="text"
                    name="user_identification"
                    value={formData.user_identification}
                    // onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="user_email"
                    value={formData.user_email}
                    // onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <Form.Label>Nueva contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="passwordHash"
                    value={formData.passwordHash}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="text-end">
                <Button variant="danger" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserSettingsPage;
