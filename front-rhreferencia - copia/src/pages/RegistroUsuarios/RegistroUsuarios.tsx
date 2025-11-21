import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const CUSTOMERS_URL = "http://localhost:3000/api/v1/higuera-escalante/customers";
const REGISTER_URL = "http://localhost:3000/api/v1/higuera-escalante/users/register";

const RegisterUserPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipoDocumento: "",
    documento: "",
    nombres: "",
    lastName: "",
    surName: "",
    cargo: "",
    genero: "",
    telefono: "",
    email: "",
    empresa: "",
    NIT: "",
    direccion: "",
  });

  const [empresas, setEmpresas] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);

  // 🟢 Cargar lista de empresas
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
        setEmpresas(
          Array.isArray(data.customers)
            ? data.customers
            : Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error("❌ Error cargando empresas:", err);
        setEmpresas([]);
      } finally {
        setLoadingEmpresas(false);
      }
    };
    fetchEmpresas();
  }, []);

  // 🟢 Manejar cambios de inputs
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
        NIT: empresaSeleccionada?.identification || "",
        direccion: empresaSeleccionada?.commercialAddress || "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🟢 Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones simples antes de enviar
    if (formData.documento.length < 5 || formData.documento.length > 15) {
      setError("El número de documento debe tener entre 5 y 15 caracteres.");
      return;
    }
    if (!formData.email.includes("@")) {
      setError("El correo electrónico no es válido.");
      return;
    }

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
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      await axios.post(REGISTER_URL, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      alert("✅ Usuario registrado correctamente 🚀");
      navigate("/");
    } catch (err: any) {
      console.error("❌ Error al registrar:", err.response?.data || err);
      const backendMessage = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join(" | ")
        : err.response?.data?.message || "Error desconocido.";
      setError(`Error al registrar usuario: ${backendMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Renderizado
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow-sm rounded-3 w-100"
        style={{ maxWidth: "900px" }}
      >
        <div className="text-center my-3">
          <img
            src="/logo1.png"
            alt="Logo HE"
            style={{ maxWidth: "120px" }}
            className="img-fluid"
          />
        </div>

        <div className="card-body p-4">
          <h3 className="text-center mb-4 text-danger">
            <i className="bi bi-person-plus-fill me-2"></i> Registro de Usuario
          </h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Documento */}
            <div className="row g-3 mb-3">
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
                  minLength={5}
                  maxLength={15}
                  required
                />
              </div>
            </div>

            {/* Nombre y apellidos */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label">Nombres *</label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Primer Apellido *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Segundo Apellido *</label>
                <input
                  type="text"
                  name="surName"
                  value={formData.surName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            {/* Cargo y género */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Cargo / Especialidad *</label>
                <input
                  type="text"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  className="form-control"
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
              <label className="form-label">Correo Electrónico *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Empresa */}
            <div className="row g-3 mb-3">
              <div className="col-md-8">
                <label className="form-label">Empresa *</label>
                {loadingEmpresas ? (
                  <div className="text-center text-muted small py-2">
                    <div className="spinner-border spinner-border-sm me-2"></div>
                    Cargando empresas...
                  </div>
                ) : (
                  <Select
                    options={empresas.map((e) => ({
                      value: e.customerId,
                      label: e.name,
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
                        NIT: empresaSeleccionada?.identification || "",
                        direccion:
                          empresaSeleccionada?.commercialAddress || "",
                      }));
                    }}
                    placeholder="Seleccione una empresa..."
                    isClearable
                  />
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label">NIT</label>
                <input
                  type="text"
                  name="NIT"
                  value={formData.NIT}
                  readOnly
                  className="form-control"
                />
              </div>
            </div>

            {/* Dirección */}
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                readOnly
                className="form-control"
              />
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="btn btn-danger w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Registrando...
                </>
              ) : (
                "Registrar Usuario"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterUserPage;
