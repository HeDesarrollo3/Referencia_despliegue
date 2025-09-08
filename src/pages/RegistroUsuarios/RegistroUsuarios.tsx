import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const CUSTOMERS_URL =
  "http://localhost:3000/api/v1/higuera-escalante/customers";
const REGISTER_URL =
  "http://localhost:3000/api/v1/higuera-escalante/users/register";

const RegisterUserPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipoDocumento: "",
    documento: "",
    nombres: "",
    lastName: "",
    surName: "",
    cargo: "", // se usará como specialty
    genero: "",
    telefono: "",
    email: "",
    empresa: "",
    NIT: "",
    direccion: "",
    departamento: "",
    ciudad: "",
  });

  const [empresas, setEmpresas] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar empresas desde el API (POST)
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const response = await axios.post(
          CUSTOMERS_URL,
          {},
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        const data = response.data;
        if (Array.isArray(data.customers)) {
          setEmpresas(data.customers);
        } else if (Array.isArray(data)) {
          setEmpresas(data);
        } else {
          setEmpresas([]);
        }
      } catch (error) {
        console.error("Error fetching empresas:", error);
        setEmpresas([]);
      }
    };

    fetchEmpresas();
  }, []);

  // Manejo de cambios
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "empresa") {
      const empresaSeleccionada = empresas.find(
        (emp) => emp.customerId === value
      );
      setFormData({
        ...formData,
        empresa: value,
        NIT: empresaSeleccionada ? empresaSeleccionada.identification : "",
        direccion: empresaSeleccionada
          ? empresaSeleccionada.commercialAddress
          : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      customerId: formData.empresa,
      specialty: formData.cargo,
      identificationType: formData.tipoDocumento,
      identification: formData.documento,
      names: formData.nombres,
      lastName: formData.lastName,
      surName: formData.surName,
      gender: formData.genero,
      email: formData.email,
    };

    try {
      const token = localStorage.getItem("token") || "";
      const response = await axios.post(REGISTER_URL, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log("Usuario registrado:", response.data);
      alert("Usuario registrado correctamente 🚀");
      navigate("/"); // Redirigir a login
    } catch (err: any) {
      console.error("Error registrando usuario:", err);
      setError("Error al registrar usuario. Revisa los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow p-4 rounded w-100"
        style={{ maxWidth: "900px" }}
      >
        <img
          src="/logo192.png"
          alt="Logo HE"
          className="mb-4 mx-auto d-block img-fluid"
          style={{ maxWidth: "120px" }}
        />
        <div className="card-body">
          <h3 className="card-title text-center mb-4 text-danger">
            <i className="bi bi-person-plus-fill me-2"></i> Registro de Usuario
          </h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Tipo de Documento y Documento */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Tipo de Documento *</label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="NIT">NIT</option>
                  <option value="CE">Cédula de Extranjería</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Número de Documento *</label>
                <input
                  type="text"
                  className="form-control"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Nombres y Apellidos */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Nombres *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Apellido *</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Segundo Apellido *</label>
                <input
                  type="text"
                  className="form-control"
                  name="surName"
                  value={formData.surName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Cargo y Género */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Cargo / Especialidad *</label>
                <input
                  type="text"
                  className="form-control"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Género *</label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Empresa y NIT */}
            {/* <div className="row mb-3">
              <div className="col-md-8">
                <label className="form-label">Empresa *</label>
                <select
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccione una empresa</option>
                  {empresas.map((empresa) => (
                    <option key={empresa.customerId} value={empresa.customerId}>
                      {empresa.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">NIT</label>
                <input
                  type="text"
                  className="form-control"
                  name="NIT"
                  value={formData.NIT}
                  readOnly
                />
              </div>
            </div> */}
            <div className="row mb-3">
              <div className="col-md-8">
                <label className="form-label">Empresa *</label>
                <Select
                  options={empresas.map((empresa) => ({
                    value: empresa.customerId,
                    label: empresa.name,
                  }))}
                  value={
                    formData.empresa
                      ? {
                          value: formData.empresa,
                          label: empresas.find(
                            (e) => e.customerId === formData.empresa
                          )?.name,
                        }
                      : null
                  }
                  onChange={(selected) => {
                    const value = selected?.value || "";
                    const empresaSeleccionada = empresas.find(
                      (emp) => emp.customerId === value
                    );
                    setFormData((prev) => ({
                      ...prev,
                      empresa: value,
                      NIT: empresaSeleccionada
                        ? empresaSeleccionada.identification
                        : "",
                      direccion: empresaSeleccionada
                        ? empresaSeleccionada.commercialAddress
                        : "",
                    }));
                  }}
                  placeholder="Seleccione una empresa..."
                  isClearable
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">NIT</label>
                <input
                  type="text"
                  className="form-control"
                  name="NIT"
                  value={formData.NIT}
                  readOnly
                />
              </div>
            </div>

            {/* Dirección */}
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                name="direccion"
                value={formData.direccion}
                readOnly
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="btn btn-danger w-100"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrar Usuario"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterUserPage;
