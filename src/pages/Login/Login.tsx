// src/components/Login.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

//const API_URL = "http://172.16.2.20:3000/api/v1/higuera-escalante/auth/login";
const API_URL = `${process.env.REACT_APP_API_URL}/auth/login`;

function Login() {

 useEffect(() => {
    document.title = "Login - HE";
  }, []);



  const navigate = useNavigate();
  const [identificacion, setIdentificacion] = useState("");
  const [clave, setClave] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (acepta) {
      setError("Debes aceptar la política de tratamiento de datos.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        type: tipoDocumento,
        identification: identificacion,
        password: clave,
      });

      const token = response.data.access_token;
      const user_role = response.data.user_role;
      const user_customer = response.data.user_customer;
      if (response.data) {
        // Guardamos token y datos del usuario
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("user_role", user_role);
        localStorage.setItem("user_customer", user_customer);
        if (user_role === "EBE2C0F1-84C3-4143-8FF8-9B0F888A2272") {
          navigate("/dashboard");
        }else {
          navigate("/dashboard");
        }
      } else {
        setError("No se recibió token. Verifica las credenciales.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistroClick = () => {
    navigate("/RegistroUsuarios");
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4 rounded w-100" style={{ maxWidth: "400px" }}>
        {/* Logo */}
      {/* Logo + Título */}
<div className="text-center mt-2">
  <img
    src="/LabConnect_logo5.png"
    alt="Logo HE"
    className="img-fluid mb-3"
    style={{ maxWidth: "225px", marginTop: "0px" }}
  />

  {/* <h3
    className="fw-semibold mb-4"
    style={{
      fontFamily: "'Poppins', sans-serif",
      letterSpacing: "1px",
      fontWeight: 600
    }}
  >
    <span style={{fontSize: "2rem", fontWeight: 600, color: "#7e7777" }}>LABConnect</span>
    <span style={{fontSize: "2rem", color: "#404752" }}> </span>
    <span
      style={{
        fontSize: "2rem",
        marginLeft: "px",
        color: "#e20909",
        fontWeight: 600
      }}
    >
       HE
    </span>
  </h3> */}
</div>

        <div className="card-body">
          {/* <h3 className="card-title text-center mb-5 text-danger">
            <i className="bi bi-person-circle me-2"></i> LABConnect  HE
          </h3> */}

          <form onSubmit={handleSubmit}>
            {/* Tipo de Documento */}
            <div className="mb-3">
              <label htmlFor="tipoDoc" className="form-label">
                Tipo de Documento *
              </label>
              <select
                className="form-select"
                id="tipoDoc"
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                <option value="NIT">NIT</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
              </select>
            </div>

            {/* Identificación */}
            <div className="mb-3">
              <label htmlFor="identificacion" className="form-label">
                Número de Identificación *
              </label>
              <input
                type="text"
                className="form-control"
                id="identificacion"
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                required
              />
            </div>

            {/* Contraseña */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña *
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
              />
              {/* 🔗 Enlace de recuperación */}
              <div className="text-center mt-3">
                <Link to="/recuperar-password" className="text-decoration-none text-primary small">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* Checkbox */}
            {/* <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="politica"
                checked={acepta}
                onChange={(e) => setAcepta(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="politica">
                Acepto la política de tratamiento de datos personales *
              </label>
            </div> */}

            {/* Mensaje de campos obligatorios */}
            <div className="mb-2 text-muted text-center">
              * Los campos marcados con asterisco son obligatorios.
            </div>

            {/* Error */}
            {error && <div className="alert alert-danger mb-3">{error}</div>}

            {/* Botón Ingresar */}
            <button type="submit" className="btn btn-danger w-100" disabled={loading}>
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Iniciando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>

            {/* Botón Registro */}
            <button
              type="button"
              onClick={handleRegistroClick}
              className="btn btn-outline-primary w-100 mt-2"
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
