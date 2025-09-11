// 📂 src/pages/PreRegistro/PreRegistro.tsx
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  getCie10,
  getTariffProducts,
  registerOrder,
  getPreRegistros,
} from "../../services/api";

import PlanStep from "./steps/PlanStep";
import PatientStep from "./steps/PatientStep";
import ProductsStep from "./steps/ProductsStep";
import SummaryStep from "./steps/SummaryStep";
import Table, { Column } from "../../components/common/Table"; // 👈 importamos tu tabla genérica

const PreRegistro: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

  const [accounts, setAccounts] = useState<any[]>([]);
  const [cie10List, setCie10List] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);

  // 🔹 lista de pre-registros
  const [allPreRegistros, setAllPreRegistros] = useState<any[]>([]);
  const [preRegistros, setPreRegistros] = useState<any[]>([]);
  const [loadingPre, setLoadingPre] = useState(false);

  // 🔹 filtros
  const [filters, setFilters] = useState({
    nombre: "",
    documento: "",
    fecha: "",
  });

  const [formData, setFormData] = useState<any>({
    cie10: "",
    priority: "",
    observation: "",
    patientId: "",
    firstName: "",
    lastName: "",
    customerAccountId: "",
    tariffId: "",
    products: [{ productId: "" }],
  });

  // 🔹 columnas de la tabla
  const columns: Column<any>[] = [
    { header: "Fecha de creación", accessor: "creationDate" },
    { header: "Paciente", accessor: "patientName" },
    { header: "Documento", accessor: "patientId" },
    { header: "Orden", accessor: "orderNumber" },
    { header: "Estado", accessor: "state", render: (row) => row.state || "Pendiente" },
  ];

  // 🔹 cargar pre-registros
  const loadPreRegistros = async (token: string) => {
    setLoadingPre(true);
    try {
      const data = await getPreRegistros(token);
      setAllPreRegistros(data);
      setPreRegistros(data);
    } catch (err) {
      console.error("❌ Error al cargar pre-registros:", err);
    } finally {
      setLoadingPre(false);
    }
  };

  // 🔹 aplicar filtros
  const applyFilters = () => {
    let filtered = [...allPreRegistros];

    if (filters.nombre) {
      filtered = filtered.filter((item) =>
        item.patientName?.toLowerCase().includes(filters.nombre.toLowerCase())
      );
    }
    if (filters.documento) {
      filtered = filtered.filter((item) =>
        item.patientId?.toLowerCase().includes(filters.documento.toLowerCase())
      );
    }
    if (filters.fecha) {
      filtered = filtered.filter((item) =>
        item.creationDate.startsWith(filters.fecha)
      );
    }

    setPreRegistros(filtered);
  };

  // ejecutar filtros cada vez que cambien
  useEffect(() => {
    applyFilters();
  }, [filters, allPreRegistros]);

  // cargar data inicial
  useEffect(() => {
    const token = localStorage.getItem("token") || "";

    getCie10().then((cie) => setCie10List(cie));

    getTariffProducts(token).then((accs) => {
      setAccounts(accs);
      if (accs.length > 0) {
        setFormData((prev: any) => ({
          ...prev,
          customerAccountId: accs[0].customerAccountId,
          tariffId: accs[0].tariff.tariffId,
        }));
        setProductList(accs[0].tariff.products);
      }
    });

    loadPreRegistros(token);
  }, []);

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index: number, value: string) => {
    const newProducts = [...formData.products];
    newProducts[index].productId = value;
    setFormData({ ...formData, products: newProducts });
  };

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { productId: "" }],
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token") || "";
    try {
      await registerOrder(token, formData);
      alert("✅ Pre-Registro guardado correctamente");

      setShowModal(false);
      setStep(1);
      setFormData({
        cie10: "",
        priority: "",
        observation: "",
        patientId: "",
        firstName: "",
        lastName: "",
        customerAccountId: accounts[0]?.customerAccountId || "",
        tariffId: accounts[0]?.tariff.tariffId || "",
        products: [{ productId: "" }],
      });

      loadPreRegistros(token);
    } catch (err) {
      alert("❌ Error al guardar la orden. Revisa la consola.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      {/* 🔎 Filtros */}
      <div className="card p-3 mb-4 shadow-sm bg-darger">
        <h4>Gestión de Pre-Registros</h4>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre"
              value={filters.nombre}
              onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por documento"
              value={filters.documento}
              onChange={(e) =>
                setFilters({ ...filters, documento: e.target.value })
              }
            />
          </div>
          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              value={filters.fecha}
              onChange={(e) => setFilters({ ...filters, fecha: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Tabla pre-registro */}
      <div className="card p-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Listado de Pre-Registros</h5>
          <Button variant="danger" onClick={() => setShowModal(true)}>
            + Nuevo PreRegistro
          </Button>
        </div>

        {loadingPre ? (
          <p>Cargando...</p>
        ) : preRegistros.length === 0 ? (
          <p>No hay pre-registros</p>
        ) : (
          <Table
            columns={columns}
            data={preRegistros}
            striped
            hover
            onRowClick={(row) => console.log("👉 clic en fila:", row)}
          />
        )}
      </div>

      {/* 🟦 Modal con formulario en pasos */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo PreRegistro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {step === 1 && (
            <PlanStep
              customerAccountId={formData.customerAccountId}
              tariffId={formData.tariffId}
              accounts={accounts}
              onSelect={(accountId, tariffId) =>
                setFormData({
                  ...formData,
                  customerAccountId: accountId,
                  tariffId,
                })
              }
              patientId={formData.patientId}
              firstName={formData.firstName}
            />
          )}

          {step === 2 && (
            <PatientStep
              formData={formData}
              cie10List={cie10List}
              onChange={handleInputChange}
              onPatientSelect={(patient) =>
                setFormData({
                  ...formData,
                  patientId: patient.patientId,
                  firstName: patient.firstName,
                  lastName: patient.lastName,
                })
              }
            />
          )}

          {step === 3 && (
            <ProductsStep
              products={formData.products}
              productList={productList}
              onChange={handleProductChange}
              onAdd={handleAddProduct}
            />
          )}

          {step === 4 && (
            <SummaryStep formData={formData} productList={productList} />
          )}
        </Modal.Body>

        <Modal.Footer>
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              Atrás
            </Button>
          )}
          {step < 4 && (
            <Button onClick={() => setStep(step + 1)}>Siguiente</Button>
          )}
          {step === 4 && (
            <Button variant="success" onClick={handleSubmit}>
              Guardar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PreRegistro;
