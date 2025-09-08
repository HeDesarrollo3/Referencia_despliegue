// src/pages/PreRegistro/steps/PatientStep.tsx
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import PatientModal from "../modals/PatientModal";

interface PatientStepProps {
  formData: any;
  cie10List: any[];
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onPatientSelect: (patient: any) => void; // ✅ callback para seleccionar paciente
}

const PatientStep: React.FC<PatientStepProps> = ({
  formData,
  cie10List,
  onChange,
  onPatientSelect,
}) => {
  const [showModal, setShowModal] = useState(false);

  // ✅ Manejo de cambios en selects adicionales
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange(e); // reutilizamos el mismo callback que recibes por props
  };

  return (
    <div>
      <h5>👤 Información del Paciente</h5>

      {/* Botón para abrir modal */}
      <Button variant="primary" onClick={() => setShowModal(true)}>
        ➕ Agregar Paciente
      </Button>

      {/* Paciente seleccionado */}
      {formData.patientId && (
        <div className="alert alert-success mt-3">
          Paciente seleccionado:{" "}
          <b>
            {formData.firstName} {formData.lastName}
          </b>{" "}
          (ID: {formData.patientId})
        </div>
      )}

      {/* CIE10 y Prioridad */}
      <div className="row mt-3">
        <div className="col-md-6">
          <label className="form-label">CIE10 *</label>
          <select
            name="cie10"
            value={formData.cie10}
            onChange={onChange}
            className="form-select"
            required
          >
            <option value="">Seleccione un código</option>
            {cie10List.map((cie) => (
              <option key={cie.code} value={cie.code}>
                {cie.code} - {cie.description}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Prioridad *</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccione...</option>
            <option value="1">Urgente</option>
            <option value="2">Consulta prioritaria</option>
            <option value="3">Normal</option>
          </select>
        </div>
      </div>

      {/* Observación */}
      <label className="form-label mt-2">Observación</label>
      <textarea
        name="observation"
        value={formData.observation}
        onChange={onChange}
        className="form-control"
        rows={2}
      />

      {/* Modal para seleccionar paciente */}
      <PatientModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSelect={(patient) => {
          onPatientSelect(patient);
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default PatientStep;
