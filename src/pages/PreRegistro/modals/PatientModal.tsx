// src/pages/PreRegistro/steps/PatientModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { findPatient, registerPatient } from "../../../services/api";
import axios from "axios";

interface PatientModalProps {
  show: boolean;
  onHide: () => void;
  onSelect: (patient: any) => void;
}

interface DivipolaRegion {
  regionId: string;
  name: string;
  cities: { cityId: string; name: string }[];
}

const PatientModal: React.FC<PatientModalProps> = ({ show, onHide, onSelect }) => {
  const [step, setStep] = useState<"search" | "result" | "register">("search");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchData, setSearchData] = useState({ identificationType: "CC", identification: "" });
  const [foundPatients, setFoundPatients] = useState<any[]>([]);
  const [divipola, setDivipola] = useState<DivipolaRegion[]>([]);
  const [newPatient, setNewPatient] = useState<any>({
    identification: "",
    identificationType: "CC",
    firstName: "",
    middleName: "",
    lastName: "",
    surName: "",
    gender: "M",
    birthDate: "",
    address: "",
    addressZone: "R",
    city: "",
    region: "",
    countryId: "CO",
    phoneNumber: "",
    mobileNumber: "",
    email: "",
  });

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const loadDivipola = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/higuera-escalante/code-system/divipola");
        setDivipola(res.data[0]?.regions || []);
      } catch (err) {
        console.error("Error al cargar Divipola", err);
      }
    };
    loadDivipola();
  }, []);

  const handleSearch = async () => {
    if (!searchData.identification) return alert("Ingrese número de identificación");
    setError("");
    setLoading(true);
    try {
      const patients = await findPatient(token, searchData.identificationType, searchData.identification);
      if (patients && patients.length > 0) {
        setFoundPatients(patients);
        setStep("result");
      } else {
        // No encontrado → ir a registro
        setStep("register");
        setNewPatient({
          ...newPatient,
          identification: searchData.identification,
          identificationType: searchData.identificationType,
        });
      }
    } catch (err) {
      setStep("register");
      setNewPatient({
        ...newPatient,
        identification: searchData.identification,
        identificationType: searchData.identificationType,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (p: any) => {
    onSelect(p);
    onHide();
  };

  const handleRegister = async () => {
    setError("");
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.gender || !newPatient.birthDate) {
      setError("Por favor complete los campos obligatorios (*)");
      return;
    }

    setLoading(true);
    try {
      const patient = await registerPatient(token, newPatient);
      onSelect(patient); // selecciona automáticamente
      onHide();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al registrar paciente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Paso Buscar */}
        {step === "search" && (
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Tipo Documento</Form.Label>
              <Form.Select
                value={searchData.identificationType}
                onChange={(e) => setSearchData({ ...searchData, identificationType: e.target.value })}
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula Extranjería</option>
                <option value="TI">Tarjeta Identidad</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Número de documento</Form.Label>
              <Form.Control
                type="text"
                value={searchData.identification}
                onChange={(e) => setSearchData({ ...searchData, identification: e.target.value })}
              />
            </Form.Group>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Buscar"}
            </Button>
          </Form>
        )}

        {/* Paso Resultados */}
        {step === "result" && (
          <div>
            <h6>Pacientes encontrados</h6>
            {foundPatients.map((p) => (
              <div
                key={p.patientId}
                className="border p-2 mb-2 d-flex justify-content-between align-items-center"
              >
                <span>
                  {p.firstName} {p.lastName} ({p.identificationType} {p.identification})
                </span>
                <Button size="sm" onClick={() => handleSelectPatient(p)}>
                  Seleccionar
                </Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setStep("search")}>
              Volver a buscar
            </Button>
          </div>
        )}

        {/* Paso Registro */}
        {step === "register" && (
          <Form>
            <h6>Registrar nuevo paciente</h6>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-2">
              <Form.Label>Primer Nombre *</Form.Label>
              <Form.Control
                value={newPatient.firstName}
                onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Segundo Nombre</Form.Label>
              <Form.Control
                value={newPatient.middleName}
                onChange={(e) => setNewPatient({ ...newPatient, middleName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Primer Apellido *</Form.Label>
              <Form.Control
                value={newPatient.lastName}
                onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Segundo Apellido</Form.Label>
              <Form.Control
                value={newPatient.surName}
                onChange={(e) => setNewPatient({ ...newPatient, surName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Sexo *</Form.Label>
              <Form.Select
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fecha Nacimiento *</Form.Label>
              <Form.Control
                type="date"
                value={newPatient.birthDate}
                onChange={(e) => setNewPatient({ ...newPatient, birthDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Dirección *</Form.Label>
              <Form.Control
                value={newPatient.address}
                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Región *</Form.Label>
              <Form.Select
                value={newPatient.region}
                onChange={(e) => setNewPatient({ ...newPatient, region: e.target.value, city: "" })}
              >
                <option value="">Seleccione región</option>
                {divipola.map((r) => (
                  <option key={r.regionId} value={r.regionId}>
                    {r.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Ciudad *</Form.Label>
              <Form.Select
                value={newPatient.city}
                onChange={(e) => setNewPatient({ ...newPatient, city: e.target.value })}
                disabled={!newPatient.region}
              >
                <option value="">Seleccione ciudad</option>
                {divipola
                  .find((r) => r.regionId === newPatient.region)
                  ?.cities.map((c) => (
                    <option key={c.cityId} value={c.cityId}>
                      {c.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                value={newPatient.phoneNumber}
                onChange={(e) => setNewPatient({ ...newPatient, phoneNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Celular</Form.Label>
              <Form.Control
                value={newPatient.mobileNumber}
                onChange={(e) => setNewPatient({ ...newPatient, mobileNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
              />
            </Form.Group>

            <Button onClick={handleRegister} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "✅ Guardar y seleccionar"}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PatientModal;
