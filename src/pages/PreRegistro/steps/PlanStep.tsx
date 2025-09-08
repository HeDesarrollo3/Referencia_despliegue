// src/pages/PreRegistro/steps/PlanStep.tsx
import React from "react";

interface PlanStepProps {
  customerAccountId: string;
  tariffId: string;
  accounts: any[];
  onSelect: (accountId: string, tariffId: string) => void;
  patientId?: string;
  firstName?: string;
}

const PlanStep: React.FC<PlanStepProps> = ({
  customerAccountId,
  tariffId,
  accounts,
  onSelect,
  patientId,
  firstName,
}) => {
  return (
    <div>
      <h5>📌 Selección de Plan</h5>

      {/* Selector de plan */}
      <select
        className="form-select"
        value={customerAccountId}
        onChange={(e) => {
          const acc = accounts.find((a) => a.customerAccountId === e.target.value);
          if (acc) onSelect(acc.customerAccountId, acc.tariff.tariffId);
        }}
        required
      >
        <option value="">Seleccione un plan</option>
        {accounts.map((acc) => (
          <option key={acc.customerAccountId} value={acc.customerAccountId}>
            {acc.name} - {acc.tariff.name}
          </option>
        ))}
      </select>

      {/* Mostrar paciente seleccionado */}
      {patientId && (
        <div className="alert alert-success mt-3">
          Paciente seleccionado: <b>{firstName || patientId}</b>
        </div>
      )}
    </div>
  );
};

export default PlanStep;
