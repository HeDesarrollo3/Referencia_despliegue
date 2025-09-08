import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

interface Props {
  onClose: () => void;
}

const PreRegistroSteps: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div>
      {/* 🔹 Indicador de pasos */}
      <div className="d-flex justify-content-center mb-4">
        <div className={`px-3 py-2 rounded-circle ${step === 1 ? "bg-primary text-white" : "bg-light"}`}>1</div>
        <div className="mx-2 align-self-center">—</div>
        <div className={`px-3 py-2 rounded-circle ${step === 2 ? "bg-primary text-white" : "bg-light"}`}>2</div>
      </div>

      {/* 🔹 Paso 1 */}
      {step === 1 && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del paciente</Form.Label>
            <Form.Control type="text" placeholder="Ingrese el nombre" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Documento</Form.Label>
            <Form.Control type="text" placeholder="Ingrese el documento" />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={nextStep}>Siguiente</Button>
          </div>
        </Form>
      )}

      {/* 🔹 Paso 2 */}
      {step === 2 && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Examen a realizar</Form.Label>
            <Form.Control type="text" placeholder="Ej: Hemograma" />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={prevStep}>Atrás</Button>
            <Button variant="success" onClick={onClose}>Finalizar</Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default PreRegistroSteps;
