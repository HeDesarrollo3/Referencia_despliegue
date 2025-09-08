

// src/components/Login.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button  from "../../components/common/Button";
import { Alert } from "react-bootstrap";

const API_URL = "http://localhost:3000/api/v1/higuera-escalante/auth/login";

function Login() {
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

    if (!acepta) {
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

      

      console.log(tipoDocumento, identificacion, clave);

      const token = response.data.access_token;  //const token = response.data;
      console.log("Login successful, token:", token);

      if (token) {
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else {
        setError("No se recibió token. Verifica las credenciales.");
        alert("Verifica las credenciales.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistroClick = () => {
    navigate("/registro-usuarios");
  };



  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
  <div className="card shadow p-4 rounded w-100" style={{ maxWidth: '400px', width: '90%' }}>
    <img 
      src="/logo1.png" 
      alt="Logo HE" 
      className="mb-4 mx-auto d-block img-fluid" 
      style={{ maxWidth: "100px" }} 
    />
    <div className="card-body">
      <h3 className="card-title text-center mb-4 text-danger">
        <i className="bi bi-person-circle me-2"></i> Ingreso a la Plataforma
      </h3>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        {/* Tipo de Documento */}
        <div className="mb-3">
          <label htmlFor="tipoDoc" className="form-label">Tipo de Documento *</label>
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
          <label htmlFor="identificacion" className="form-label">Número de Identificación *</label>
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
          <label htmlFor="password" className="form-label">Contraseña *</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
        </div>

        {/* Checkbox */}
        <div className="form-check mb-3">
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
        </div>

        {/* Mensaje campos obligatorios */}
        <div className="mb-2 text-muted text-center">
          * Los campos marcados con asterisco son obligatorios.
        </div>

        {/* Error */}
        {error && <div className="alert alert-danger mb-3">{error}</div>}

        {/* Botón Ingresar */}
        <button type="submit" className="btn btn-danger w-100" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
