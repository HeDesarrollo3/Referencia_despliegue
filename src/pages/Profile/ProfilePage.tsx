import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { Card, Button } from "react-bootstrap";
import { parseJwt } from "../../utils/jwt";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1️⃣ Obtener token e información del usuario
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      const decoded = parseJwt(token); // datos internos del token
      const parsedUser = JSON.parse(userData); // datos del backend
      setUser({ ...decoded, ...parsedUser });
    }
  }, []);

  if (!user) {
    return (
      <MainLayout pageTitle="Perfil de Usuario">
        <div className="text-center mt-5">
          <p>Cargando información del usuario...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Perfil de Usuario">
      <div className="container mt-4">
        <Card className="shadow-sm border-0">
          <Card.Body>
            <div className="text-center mb-3">
              {/* <img
                src="/profile-avatar.png"
                alt="Avatar"
                className="rounded-circle border"
                width="120"
                height="120"
              /> */}
              <h4 className="mt-3">
                {user.user_names} {user.user_lastName} {user.user_surName}
              </h4>
              {/* <p className="text-muted">{user.user_role}</p>   aqui viene el rol lo oculte porque viene es id */}  
            </div>

            <hr />

            <div className="row">
              <div className="col-md-6">
                <p><strong>Tipo de Documento:</strong> {user.user_identificationType}</p>
                <p><strong>Número de Documento:</strong> {user.user_identification}</p>
                <p><strong>Cliente:</strong> {user.user_customer}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Correo:</strong> {user.user_email}</p>
                <p><strong>Especialidad:</strong> {user.user_specialty}</p>
              </div>
            </div>

            <div className="text-center mt-4">
              <Button variant="danger" href="/settings">
                Editar Perfil
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
