// src/pages/PreRegistro/steps/SummaryStep.tsx
import React from "react";

interface SummaryStepProps {
  formData: any;
  productList: any[];
}

const SummaryStep: React.FC<SummaryStepProps> = ({ formData, productList }) => {
  return (
    <div>
      <h5>📑 Resumen del Pre-Registro</h5>
      <p><strong>Paciente ID:</strong> {formData.patientId}</p>
      <p><strong>CIE10:</strong> {formData.cie10}</p>
      <p><strong>Observación:</strong> {formData.observation}</p>

      <h6>Productos Seleccionados:</h6>
      <ul>
        {formData.products.map((prod: any, idx: number) => {
          const product = productList.find((p) => p.productId === prod.productId);
          return <li key={idx}>{product?.name} - ${product?.price}</li>;
        })}
      </ul>
    </div>
  );
};

export default SummaryStep;
