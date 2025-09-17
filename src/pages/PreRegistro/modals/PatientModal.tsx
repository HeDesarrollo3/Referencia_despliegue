// src/pages/PreRegistro/modals/PatientModal.tsx
import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { findPatient, registerPatient } from "../../../services/api";

interface PatientModalProps {
  show: boolean;
  onHide: () => void;
  onSelect: (patient: any) => void;
}

const PatientModal: React.FC<PatientModalProps> = ({ show, onHide, onSelect }) => {
  const [step, setStep] = useState<"search" | "register" | "result">("search");
  const [searchData, setSearchData] = useState({ identificationType: "CC", identification: "" });
  const [foundPatients, setFoundPatients] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSearch = async () => {
    setError("");
    setLoading(true);
    try {
      const patients = await findPatient(token, searchData.identificationType, searchData.identification);

      if (patients && patients.length > 0) {
        setFoundPatients(patients);
        setStep("result");
      } else {
        // no encontrado → paso a registro
        setStep("register");
        setNewPatient({
          ...newPatient,
          identification: searchData.identification,
          identificationType: searchData.identificationType,
        });
      }
    } catch (err: any) {
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

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      const patient = await registerPatient(token, newPatient);
      onSelect(patient);
      onHide();
    } catch (err) {
      setError("No se pudo registrar el paciente. Revisa los campos obligatorios.");
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
        {step === "search" && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tipo Documento</Form.Label>
              <Form.Select
                value={searchData.identificationType}
                onChange={(e) => setSearchData({ ...searchData, identificationType: e.target.value })}
              >
                <option value="CC">Cédula de Ciudadania</option>
                <option value="CE">Cédula Extranjería</option>
                <option value="TI">Tarjeta Identidad</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Número Documento</Form.Label>
              <Form.Control
                type="text"
                value={searchData.identification}
                onChange={(e) => setSearchData({ ...searchData, identification: e.target.value })}
              />
            </Form.Group>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </Form>
        )}

        {step === "result" && (
          <div>
            <h6>Pacientes encontrados</h6>
            {foundPatients.map((p) => (
              <div
                key={p.patientId}
                className="border p-2 mb-2 d-flex justify-content-between align-items-center"
              >
                <span>
                  {p.identification} - {p.firstName} {p.lastName}
                </span>
                <Button
                  size="sm"
                  onClick={() => {
                    onSelect(p);
                    onHide();
                  }}
                >
                  Seleccionar
                </Button>
              </div>
            ))}
          </div>
        )}

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
              <Form.Label>Apellido *</Form.Label>
              <Form.Control
                value={newPatient.lastName}
                onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
              />
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
              />
            </Form.Group>

            <Button onClick={handleRegister} disabled={loading}>
              {loading ? "Creando..." : "Crear Paciente"}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PatientModal;
