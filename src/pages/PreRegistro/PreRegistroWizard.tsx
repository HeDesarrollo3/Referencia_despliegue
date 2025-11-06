import React, { useEffect, useState, useRef } from "react";
import { Button, ProgressBar } from "react-bootstrap";
import PlanStep, { PlanStepRef } from "./steps/PlanStep";
import PatientStep from "./steps/PatientStep";
import ProductsStep from "./steps/ProductsStep";
import SummaryStep from "./steps/SummaryStep";
import { getTariffProducts, getCie10 } from "../../services/api";

const PreRegistroWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [productList, setProductList] = useState<any[]>([]);
  const [cie10List, setCie10List] = useState<any[]>([]);

  const planStepRef = useRef<PlanStepRef>(null); // 👈 referencia al PlanStep

  const [formData, setFormData] = useState({
    customerAccountId: "",
    tariffId: "",
    patientId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    surName: "",
    identificationNumber: "",
    identificationType: "",
    birthDate: "",
    gender: "",
    email: "",
    mobileNumber: "",
    cie10: "",
    priority: "",
    observation: "",
    products: [{ productId: "" }],
  });

  const token = localStorage.getItem("token") || "";

  // 🔹 Cargar productos y CIE10
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getTariffProducts(token);
        setProductList(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    const fetchCie10 = async () => {
      try {
        const data = await getCie10();
        setCie10List(data);
      } catch (error) {
        console.error("Error al obtener CIE10:", error);
      }
    };

    fetchProducts();
    fetchCie10();
  }, [token]);

  // 🔹 Manejar cambios del formulario
  const handleChange = (data: { name: string; value: any }) => {
    const { name, value } = data;
    setFormData({ ...formData, [name]: value });
  };

  // 🔹 Seleccionar plan
  const handlePlanSelect = (accountId: string, tariffId: string) => {
    setFormData({
      ...formData,
      customerAccountId: accountId,
      tariffId,
      products: [{ productId: "" }], // reinicia productos al cambiar plan
    });
  };

  // 🔹 Seleccionar paciente
  const handlePatientSelect = (patient: any) => {
    setFormData({
      ...formData,
      patientId: patient.patientId || patient.id || "",
      firstName: patient.firstName || "",
      middleName: patient.middleName || "",
      lastName: patient.lastName || "",
      surName: patient.surName || "",
      identificationNumber: patient.identification || patient.identificationNumber || "",
      identificationType: patient.identificationType || "CC",
      birthDate: patient.birthDate || "",
      gender: patient.gender || "",
      email: patient.email || "",
      mobileNumber: patient.mobileNumber || "",
      cie10: patient.cie10 || "",
      priority: patient.priority || "",
      observation: patient.observation || "",
    });
  };

  // 🔹 Productos
  const handleProductChange = (index: number, value: string) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index].productId = value;
    setFormData({ ...formData, products: updatedProducts });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { productId: "" }],
    });
  };

  // 🔹 Definir pasos
  const steps = [
    { id: 1, label: "Información del Plan" },
    { id: 2, label: "Información del Paciente" },
    { id: 3, label: "Seleccionar Productos" },
    { id: 4, label: "Resumen y Guardar" },
  ];

  // 🔹 Renderizar contenido
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PlanStep
            ref={planStepRef} //  conectamos el ref
            customerAccountId={formData.customerAccountId}
            tariffId={formData.tariffId}
            accounts={productList}
            onSelect={handlePlanSelect} loading={false}          />
        );

      case 2:
        return (
          <PatientStep
            token={token}
            formData={formData}
            onChange={handleChange}
            onPatientSelect={handlePatientSelect}
            cie10List={cie10List}
          />
        );

      case 3:
        return (
          <ProductsStep
            products={formData.products}
            productList={
              productList.find(
                (acc) => acc.customerAccountId === formData.customerAccountId
              )?.tariff?.products || []
            }
            onChange={handleProductChange}
            onAdd={addProduct}
          />
        );

      case 4:
        return (
          <SummaryStep
            token={token}
            formData={formData}
            productList={productList}
            cie10List={cie10List}
            onOrderRegistered={() => {
              alert("✅ Pre-orden registrada con éxito");
              setCurrentStep(1);
              setFormData({
                customerAccountId: "",
                tariffId: "",
                patientId: "",
                firstName: "",
                middleName: "",
                lastName: "",
                surName: "",
                identificationNumber: "",
                identificationType: "CC",
                birthDate: "",
                gender: "",
                email: "",
                mobileNumber: "",
                cie10: "",
                priority: "",
                observation: "",
                products: [{ productId: "" }],
              });
            }}
          />
        );

      default:
        return null;
    }
  };

  // 🔹 Manejar avance de pasos con validación del plan
  const handleNext = () => {
    if (currentStep === 1) {
      const valid = planStepRef.current?.isValid();
      if (!valid) return; // bloquea avance si no hay plan
    }

    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">PreOrden / Nueva PreOrden</h3>

      {/* Indicador de pasos */}
      <div className="d-flex justify-content-between mb-4">
        {steps.map((step) => (
          <div key={step.id} className="text-center" style={{ flex: 1 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: step.id <= currentStep ? "#007BFF" : "#E0E0E0",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto",
                fontWeight: "bold",
              }}
            >
              {step.id}
            </div>
            <small
              style={{
                marginTop: 8,
                display: "block",
                color: step.id <= currentStep ? "#007BFF" : "#888",
              }}
            >
              {step.label}
            </small>
          </div>
        ))}
      </div>

      {/* Barra de progreso */}
      <ProgressBar now={(currentStep / steps.length) * 100} className="mb-4" />

      {/* Contenido */}
      <div className="p-4 border rounded bg-white">{renderStepContent()}</div>

      {/* Navegación */}
      <div className="d-flex justify-content-between mt-4">
        <Button
          variant="secondary"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          ← Atrás
        </Button>

        {currentStep < steps.length && (
          <Button variant="primary" onClick={handleNext}>
            Siguiente →
          </Button>
        )}
      </div>
    </div>
  );
};

export default PreRegistroWizard;
