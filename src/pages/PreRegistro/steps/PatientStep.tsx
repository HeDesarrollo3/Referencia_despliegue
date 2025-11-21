import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Modal, Spinner } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { findPatient, registerPatient } from "../../../services/api";
import axios from "axios";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
// import { title } from "process";

interface PatientStepProps {
  token: string;
  formData: any;
  onChange: (data: { name: string; value: any }) => void;
  onPatientSelect: (patient: any) => void;
  cie10List: any[];
}

interface RegionOption {
  value: string;
  label: string;
  cities: CityOption[];
}

interface CityOption {
  value: string;
  label: string;
}

const PatientStep: React.FC<PatientStepProps> = ({
  token,
  formData,
  onChange,
  onPatientSelect,
  cie10List,
}) => {
  const [loading, setLoading] = useState(false);
  const [patientResults, setPatientResults] = useState<any[]>([]);
  const [searchMode, setSearchMode] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<
    { code: string; description: string }[]
  >([]);
  const [divipola, setDivipola] = useState<RegionOption[]>([]);
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const [newPatientData, setNewPatientData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    surName: "",
    identification: formData.identificationNumber || "",
    identificationType: formData.identificationType || "",
    gender: "",
    birthDate: "",
    address: "",
    addressZone: "",
    city: "",
    region: "",
    countryId: "CO",
    phoneNumber: "",
    mobileNumber: "",
    email: "",
  });

  // Cargar tipos de documento
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/higuera-escalante/code-system/colombian-identifiers"
        );
        setDocumentTypes(response.data || []);
      } catch (error) {
        console.error("Error cargando tipos de documento", error);
      }
    };
    fetchDocumentTypes();
  }, []);

  // Cargar Divipola
  useEffect(() => {
    const fetchDivipola = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/higuera-escalante/code-system/divipola"
        );
        const regions = response.data[0]?.regions || [];
        const formattedRegions: RegionOption[] = regions.map((r: any) => ({
          value: r.regionId,
          label: r.name,
          cities: r.cities.map((c: any) => ({
            value: c.cityId,
            label: c.name,
          })),
        }));
        setDivipola(formattedRegions);
      } catch (error) {
        console.error("Error cargando Divipola", error);
      }
    };
    fetchDivipola();
  }, []);

  // CIE10 Async Select
  const loadCie10Options = React.useMemo(
    () =>
      debounce((inputValue: string, callback: any) => {
        const term = inputValue.toLowerCase();
        const filtered = cie10List
          .filter(
            (item) =>
              item.code.toLowerCase().includes(term) ||
              item.description.toLowerCase().includes(term)
          )
          .slice(0, 50)
          .map((item) => ({
            value: item.code,
            label: `${item.code} - ${item.description}`,
          }));
        callback(filtered);
      }, 400),
    [cie10List]
  );

  // Buscar paciente
  const handleSearchPatient = async () => {
    if (!formData.identificationNumber || !formData.identificationType) return;
    setLoading(true);
    setNoResults(false);
    try {
      const results = await findPatient(
        token,
        formData.identificationType,
        formData.identificationNumber,
        formData.birthDate
      );
      const lista = Array.isArray(results) ? results : results?.patients || [];
      if (lista.length === 0) {
        setPatientResults([]);
        setNoResults(true);
        setShowCreateModal(true);
      } else {
        setPatientResults(lista);
        setShowCreateModal(false);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title:"No se encuentra el paciente, puede crearlo manualmente",
        icon:"info",
        text:"Paciente no encontrado",
         confirmButtonText: "Aceptar",
           confirmButtonColor: "#357bdc",
      });
      //

        // alert("❌ No se pudo buscar el paciente, puede crearlo manualmente");
      setPatientResults([]);
      setNoResults(true);
      setShowCreateModal(true);
    }
    setLoading(false);
  };

  // Seleccionar paciente
  const handleSelectPatient = (patient: any) => {
    onPatientSelect({
      ...patient,
      patientId: patient.patientId || patient.id,
      identification: patient.identification,
      identificationNumber: patient.identification,
      birthdate: patient.birthDate,
    });
    setSearchMode(false);
    setShowCreateModal(false);
  };

  const handleChangePatient = () => {
    setSearchMode(true);
    onPatientSelect({});
  };

  // Crear paciente
  const handleCreatePatient = async () => {
    setSubmitted(true);
    const requiredFields = [
      "identificationType",
      "identification",
      "firstName",
      "middleName",
      "lastName",
      "surName",
      "gender",
      "birthDate",
      "address",
      "addressZone",
      "region",
      "city",
      "phoneNumber",
      "mobileNumber",
      "email",
    ];
    for (const field of requiredFields) {
      if (!newPatientData[field as keyof typeof newPatientData]) {
        alert(`❌ El campo "${field}" es obligatorio.`);
        return;
      }
    }
    try {
      const patient = await registerPatient(token, newPatientData);
      alert("✅ Paciente creado con éxito");
      handleSelectPatient(patient);
    } catch (err: any) {
      console.error("❌ Error al registrar paciente: ", err.response?.data || err);
      alert("❌ Error al crear paciente");
    }
  };
  

  return (
    <div>
      <h5>🔎 Buscar Paciente</h5>
      {searchMode ? (
        <>
          <Row className="mb-2">
            <Col md={4}>
              <Form.Select
                name="identificationType"
                value={formData.identificationType || ""}
                onChange={(e) =>
                  onChange({ name: e.target.name, value: e.target.value })
                }
                isInvalid={!formData.identificationType && submitted}
              >
                <option value="">Tipo Documento *</option>
                {documentTypes.map((doc) => (
                  <option key={doc.code} value={doc.code}>
                    {doc.description}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Selecciona el tipo de documento.
              </Form.Control.Feedback>
            </Col>
            <Col md={6}>
              <Form.Control
                placeholder="Número de identificación *"
                name="identificationNumber"
                value={formData.identificationNumber || ""}
                onChange={(e) =>
                  onChange({ name: e.target.name, value: e.target.value })
                }
                isInvalid={!formData.identificationNumber && submitted}
              />
              <Form.Control.Feedback type="invalid">
                Ingresa el número de identificación.
              </Form.Control.Feedback>
            </Col>
            <Col md={2}>
              <Button
                onClick={() => {
                  if (!formData.identificationType || !formData.identificationNumber) {
                    setSubmitted(true);
                    return;
                  }
                  handleSearchPatient();
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Buscando...
                  </>
                ) : (
                  "Buscar"
                )}
              </Button>
            </Col>
          </Row>

          {patientResults.length > 0 && (
            <ul
              className="list-group mb-3"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {patientResults.map((patient) => (
                <li
                  key={patient.patientId || patient.id}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSelectPatient(patient)}
                  style={{ cursor: "pointer" }}
                >
                  {patient.firstName} {patient.lastName} ({patient.identification}{" "}
                  {patient.birthDate
                    ? `- ${new Date(patient.birthDate).toLocaleDateString("es-CO")}`
                    : ""}
                  )
                </li>
              ))}
            </ul>
          )}

          {noResults && (
            <div className="text-danger mb-2">
              ❌ No se encontraron pacientes
              <br />
              Puede crear un nuevo paciente usando el botón abajo.
              <Button
                variant="outline-primary"
                size="sm"
                className="mt-2"
                onClick={() => setShowCreateModal(true)}
              >
                Crear Paciente
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="p-2 border rounded bg-light mb-3 d-flex justify-content-between align-items-center">
          <span>
            🧍 Paciente seleccionado: <b>{formData.firstName} {formData.lastName}</b>{" "}
            ({formData.identificationType}{" "}
            {formData.identificationNumber || formData.identification})
          </span>
          <Button variant="outline-secondary" size="sm" onClick={handleChangePatient}>
            Cambiar paciente
          </Button>
        </div>
      )}

      {/* CIE10 obligatorio */}
      <h5 className="mt-4">🩺 Clasificación CIE10 *</h5>
      <AsyncSelect
        cacheOptions
        loadOptions={loadCie10Options}
        defaultOptions
        placeholder="Buscar y seleccionar CIE10..."
        value={
          formData.cie10
            ? {
                value: formData.cie10,
                label: cie10List.find((c) => c.code === formData.cie10)?.description || formData.cie10,
              }
            : null
        }
        onChange={(selected: any) =>
          onChange({ name: "cie10", value: selected?.value || "" })
        }
        isClearable
      />
      {submitted && !formData.cie10 && (
        <div className="text-danger small mt-1">Seleccione un CIE10.</div>
      )}

      {/* Prioridad obligatorio */}
      <h5 className="mt-4">⚠️ Prioridad *</h5>
      <Form.Select
        name="priority"
        value={formData.priority || ""}
        onChange={(e) => onChange({ name: e.target.name, value: e.target.value })}
      >
        <option value="">Seleccione</option>
        <option value="1">Normal</option>
        <option value="3">Urgente</option>
      </Form.Select>
      {submitted && !formData.priority && (
        <div className="text-danger small mt-1">Seleccione la prioridad.</div>
      )}

      {/* Observaciones opcional */}
      <h5 className="mt-4">📝 Observaciones</h5>
      <Form.Control
        as="textarea"
        rows={3}
        name="observation"
        value={formData.observation || ""}
        onChange={(e) => onChange({ name: e.target.name, value: e.target.value })}
      />

      {/* Modal Crear Paciente */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>➕ Crear Nuevo Paciente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <h6 className="text-muted mt-2">📌 Datos de Identificación</h6>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Tipo de Documento *</Form.Label>
                <Form.Select
                  value={newPatientData.identificationType}
                  onChange={(e) => setNewPatientData({...newPatientData, identificationType: e.target.value})}
                  isInvalid={submitted && !newPatientData.identificationType}
                >
                  <option value="">Seleccione</option>
                  {documentTypes.map((doc) => (
                    <option key={doc.code} value={doc.code}>
                      {doc.description}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Selecciona el tipo de documento.
                </Form.Control.Feedback>
              </Col>
              <Col md={8}>
                <Form.Label>Número de Documento *</Form.Label>
                <Form.Control
                  placeholder="Ej: 91500600"
                  value={newPatientData.identification}
                  onChange={(e) => setNewPatientData({...newPatientData, identification: e.target.value})}
                  isInvalid={submitted && !newPatientData.identification}
                />
                <Form.Control.Feedback type="invalid">
                  Ingresa el número de documento.
                </Form.Control.Feedback>
              </Col>
            </Row>

            <h6 className="text-muted">🧍 Datos Personales</h6>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Primer Nombre *</Form.Label>
                <Form.Control
                  placeholder="Ej: Fernando"
                  value={newPatientData.firstName}
                  onChange={(e) => setNewPatientData({...newPatientData, firstName: e.target.value})}
                  isInvalid={submitted && !newPatientData.firstName}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Segundo Nombre *</Form.Label>
                <Form.Control
                  placeholder="Ej: Andrés"
                  value={newPatientData.middleName}
                  onChange={(e) => setNewPatientData({...newPatientData, middleName: e.target.value})}
                  isInvalid={submitted && !newPatientData.middleName}
                />
              </Col>
              <Col md={6} className="mt-2">
                <Form.Label>Primer Apellido *</Form.Label>
                <Form.Control
                  placeholder="Ej: Higuera"
                  value={newPatientData.lastName}
                  onChange={(e) => setNewPatientData({...newPatientData, lastName: e.target.value})}
                  isInvalid={submitted && !newPatientData.lastName}
                />
              </Col>
              <Col md={6} className="mt-2">
                <Form.Label>Segundo Apellido *</Form.Label>
                <Form.Control
                  placeholder="Ej: Escalante"
                  value={newPatientData.surName}
                  onChange={(e) => setNewPatientData({...newPatientData, surName: e.target.value})}
                  isInvalid={submitted && !newPatientData.surName}
                />
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>Sexo *</Form.Label>
                <Form.Select
                  value={newPatientData.gender}
                  onChange={(e) => setNewPatientData({...newPatientData, gender: e.target.value})}
                  isInvalid={submitted && !newPatientData.gender}
                >
                  <option value="">Seleccione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </Form.Select>
              </Col>
              <Col md={4} className="mt-2">
                <Form.Label>Fecha de Nacimiento *</Form.Label>
                <Form.Control
                  type="date"
                  value={newPatientData.birthDate}
                  onChange={(e) => setNewPatientData({...newPatientData, birthDate: e.target.value})}
                  isInvalid={submitted && !newPatientData.birthDate}
                />
              </Col>
            </Row>

            <h6 className="text-muted">🏠 Contacto y Dirección</h6>
            <Row className="mb-3">
              <Col md={8}>
                <Form.Label>Dirección *</Form.Label>
                <Form.Control
                  placeholder="Ej: Calle 48 # 32 - 25"
                  value={newPatientData.address}
                  onChange={(e) => setNewPatientData({...newPatientData, address: e.target.value})}
                  isInvalid={submitted && !newPatientData.address}
                />
              </Col>
              <Col md={4}>
                <Form.Label>Zona *</Form.Label>
                <Form.Select
                  value={newPatientData.addressZone}
                  onChange={(e) => setNewPatientData({...newPatientData, addressZone: e.target.value})}
                  isInvalid={submitted && !newPatientData.addressZone}
                >
                  <option value="">Seleccione</option>
                  <option value="U">Urbano</option>
                  <option value="R">Rural</option>
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Departamento *</Form.Label>
                <Select
                  options={divipola}
                  value={divipola.find(r => r.value === newPatientData.region) || null}
                  onChange={(selected: any) => {
                    setNewPatientData({
                      ...newPatientData,
                      region: selected.value,
                      city: "",
                    });
                    setCityOptions(selected.cities);
                  }}
                  placeholder="Seleccione Departamento"
                />
                {submitted && !newPatientData.region && (
                  <div className="text-danger small mt-1">Seleccione un departamento.</div>
                )}
              </Col>
              <Col md={6}>
                <Form.Label>Ciudad *</Form.Label>
                <Select
                  options={cityOptions}
                  value={cityOptions.find(c => c.value === newPatientData.city) || null}
                  onChange={(selected: any) => setNewPatientData({...newPatientData, city: selected.value})}
                  placeholder="Seleccione Ciudad"
                  isDisabled={!newPatientData.region}
                />
                {submitted && !newPatientData.city && (
                  <div className="text-danger small mt-1">Seleccione una ciudad.</div>
                )}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Teléfono *</Form.Label>
                <Form.Control
                  placeholder="Ej: 6787870"
                  value={newPatientData.phoneNumber}
                  onChange={(e) => setNewPatientData({...newPatientData, phoneNumber: e.target.value})}
                  isInvalid={submitted && !newPatientData.phoneNumber}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Celular *</Form.Label>
                <Form.Control
                  placeholder="Ej: 3163568644"
                  value={newPatientData.mobileNumber}
                  onChange={(e) => setNewPatientData({...newPatientData, mobileNumber: e.target.value})}
                  isInvalid={submitted && !newPatientData.mobileNumber}
                />
              </Col>
            </Row>

            <Col md={12}>
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ej: servicioalcliente@higueraescalante.com"
                value={newPatientData.email}
                onChange={(e) => setNewPatientData({...newPatientData, email: e.target.value})}
                isInvalid={submitted && !newPatientData.email}
              />
            </Col>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreatePatient}>
            Guardar Paciente
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PatientStep;



// import React, { useState, useEffect } from "react";
// import { Form, Button, Row, Col, Modal } from "react-bootstrap";
// import AsyncSelect from "react-select/async";
// import Select from "react-select";
// import { findPatient, registerPatient } from "../../../services/api";
// import axios from "axios";
// import debounce from "lodash.debounce";

// interface PatientStepProps {
//   token: string;
//   formData: any;
//   onChange: (data: { name: string; value: any }) => void;
//   onPatientSelect: (patient: any) => void;
//   cie10List: any[];
// }

// interface RegionOption {
//   value: string;
//   label: string;
//   cities: CityOption[];
// }

// interface CityOption {
//   value: string;
//   label: string;
// }

// const PatientStep: React.FC<PatientStepProps> = ({
//   token,
//   formData,
//   onChange,
//   onPatientSelect,
//   cie10List,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [patientResults, setPatientResults] = useState<any[]>([]);
//   const [searchMode, setSearchMode] = useState(true);
//   const [noResults, setNoResults] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);

//   const [documentTypes, setDocumentTypes] = useState<
//     { code: string; description: string }[]
//   >([]);
  
//   const [divipola, setDivipola] = useState<RegionOption[]>([]);
//   const [cityOptions, setCityOptions] = useState<CityOption[]>([]);

//   useEffect(() => {
//     const fetchDocumentTypes = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:3000/api/v1/higuera-escalante/code-system/colombian-identifiers"
//         );
//         setDocumentTypes(response.data || []);
//       } catch (error) {
//         console.error("Error cargando tipos de documento", error);
//       }
//     };
//     fetchDocumentTypes();
//   }, []);

//   useEffect(() => {
//     const fetchDivipola = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:3000/api/v1/higuera-escalante/code-system/divipola"
//         );
//         const regions = response.data[0]?.regions || [];
//         const formattedRegions: RegionOption[] = regions.map((r: any) => ({
//           value: r.regionId,
//           label: r.name,
//           cities: r.cities.map((c: any) => ({
//             value: c.cityId,
//             label: c.name,
//           })),
//         }));
//         setDivipola(formattedRegions);
//       } catch (error) {
//         console.error("Error cargando Divipola", error);
//       }
//     };
//     fetchDivipola();
//   }, []);

//   const [newPatientData, setNewPatientData] = useState({
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     surName: "",
//     identificationNumber: formData.identificationNumber || "",
//     identificationType: formData.identificationType || "",
//     gender: "",
//     birthDate: "",
//     address: "",
//     addressZone: "",
//     city: "",
//     region: "",
//     countryId: "CO",
//     phoneNumber: "",
//     mobileNumber: "",
//     email: "",
//   });

//   const handleSearchPatient = async () => {
//     if (!formData.identificationNumber) return;
//     setLoading(true);
//     setNoResults(false);
//     try {
//       const results = await findPatient(
//         token,
//         formData.identificationType,
//         formData.identificationNumber,
//         formData.birthDate
//       );
//       const lista = Array.isArray(results) ? results : results?.patients || [];
//       console.log("🔍 Resultados de búsqueda de paciente:", lista);
//       if (lista.length === 0) {
//         setPatientResults([]);
//         setNoResults(true);
//         setShowCreateModal(true);
//       } else {
//         setPatientResults(lista);
//         setShowCreateModal(false);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("❌ No se pudo buscar el paciente, puede crearlo manualmente");
//       setPatientResults([]);
//       setNoResults(true);
//       setShowCreateModal(true);
//     }
//     setLoading(false);
//   };

//   const handleSelectPatient = (patient: any) => {
//     onPatientSelect({
//       ...patient,
//       patientId: patient.patientId || patient.id,
//       identification: patient.identification,
//       identificationNumber: patient.identification,
//       birthdate: patient.birthDate,
//     });
//     setSearchMode(false);
//     setShowCreateModal(false);
//   };

//   const handleChangePatient = () => {
//     setSearchMode(true);
//     onPatientSelect({});
//   };

//   // const loadCie10Options = (inputValue: string, callback: any) => {
//   //   const filtered = cie10List
//   //     .filter(
//   //       (item) =>
//   //         item.code.toLowerCase().includes(inputValue.toLowerCase()) ||
//   //         item.description.toLowerCase().includes(inputValue.toLowerCase())
//   //     )
//   //     .map((item) => ({
//   //       value: item.code,
//   //       label: `${item.code} - ${item.description}`,
//   //     }));
//   //   callback(filtered);
//   // };
//   const loadCie10Options = React.useMemo(() => 
//   debounce((inputValue: string, callback: any) => {
//     const term = inputValue.toLowerCase();
//     const filtered = cie10List
//       .filter(
//         (item) =>
//           item.code.toLowerCase().includes(term) ||
//           item.description.toLowerCase().includes(term)
//       )
//       .slice(0, 50) // ⚡ solo muestra los primeros 50 resultados
//       .map((item) => ({
//         value: item.code,
//         label: `${item.code} - ${item.description}`,
//       }));
//     callback(filtered);
//   }, 400),
// [cie10List]);


//   // const handleCreatePatient = async () => {
//   //   try {
//   //     const patient = await registerPatient(token, newPatientData);
//   //     alert("✅ Paciente creado con éxito");
//   //     handleSelectPatient(patient);
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("❌ Error al crear paciente");
//   //   }
//   // };
//   const handleCreatePatient = async () => {
//   if (!newPatientData.identificationNumber) {
//     alert("Ingrese un número de identificación válido");
//     return;
//   }

//   const patientPayload = {
//     ...newPatientData,
//     identification: String(newPatientData.identificationNumber).trim(),
//   };

//   if (patientPayload.identification.length < 5 || patientPayload.identification.length > 15) {
//     alert("La identificación debe tener entre 5 y 15 caracteres");
//     return;
//   }

//   if (!["F", "M"].includes(patientPayload.gender)) {
//     alert("Seleccione un sexo válido (F o M )");
//     return;
//   }

//   try {
//     const patient = await registerPatient(token, patientPayload);
//     alert("✅ Paciente creado con éxito");
//     handleSelectPatient(patient);
//   } catch (err: any) {
//     console.error("❌ Error al registrar paciente: ", err.response?.data || err);
//     alert("❌ Error al crear paciente");
//   }
// };


//   return (
//     <div>
//       <h5>🔎 Buscar Paciente</h5>
//       {searchMode ? (
//   <>
//     <Row className="mb-2">
//       <Col md={4}>
//         <Form.Select
//           name="identificationType"
//           value={formData.identificationType || ""}
//           onChange={(e) =>
//             onChange({ name: e.target.name, value: e.target.value })
//           }
//           isInvalid={!formData.identificationType && formData.submitted}
//         >
//           <option value="">Tipo Documento *</option>
//           {documentTypes.map((doc) => (
//             <option key={doc.code} value={doc.code}>
//               {doc.description}
//             </option>
//           ))}
//         </Form.Select>
//         <Form.Control.Feedback type="invalid">
//           Selecciona el tipo de documento.
//         </Form.Control.Feedback>
//       </Col>

//       <Col md={6}>
//         <Form.Control
//           placeholder="Número de identificación *"
//           name="identificationNumber"
//           value={formData.identificationNumber || ""}
//           onChange={(e) =>
//             onChange({ name: e.target.name, value: e.target.value })
//           }
//           isInvalid={!formData.identificationNumber && formData.submitted}
//         />
//         <Form.Control.Feedback type="invalid">
//           Ingresa el número de identificación.
//         </Form.Control.Feedback>
//       </Col>

//       <Col md={2}>
//         <Button
//           onClick={() => {
//             // Validación antes de buscar
//             if (!formData.identificationType || !formData.identificationNumber) {
//               onChange({ name: "submitted", value: true });
//               return;
//             }
//             handleSearchPatient();
//           }}
//           disabled={loading}
//         >
//           {loading ? "Buscando..." : "Buscar"}
//         </Button>
//       </Col>
//     </Row>

//     {patientResults.length > 0 && (
//       <ul
//         className="list-group mb-3"
//         style={{ maxHeight: "200px", overflowY: "auto" }}
//       >
//         {patientResults.map((patient) => (
//           <li
//             key={patient.patientId || patient.id}
//             className="list-group-item list-group-item-action"
//             onClick={() => handleSelectPatient(patient)}
//             style={{ cursor: "pointer" }}
//           >
//             {patient.firstName} {patient.lastName} ({patient.identification}{" "}
//             {patient.birthDate
//               ? `- ${new Date(patient.birthDate).toLocaleDateString("es-CO")}`
//               : ""}
//             )
//           </li>
//         ))}
//       </ul>
//     )}

//     {noResults && (
//       <div className="text-danger mb-2">
//         ❌ No se encontraron pacientes
//         <br />
//         Puede crear un nuevo paciente usando el botón abajo.
//         <Button
//           variant="outline-primary"
//           size="sm"
//           className="mt-2"
//           onClick={() => setShowCreateModal(true)}
//         >
//           Crear Paciente
//         </Button>
//       </div>
//     )}
//   </>
// ) : (
//   <div className="p-2 border rounded bg-light mb-3 d-flex justify-content-between align-items-center">
//     <span>
//       🧍 Paciente seleccionado: <b>{formData.firstName} {formData.lastName}</b>{" "}
//       ({formData.identificationType}{" "}
//       {formData.identificationNumber || formData.identification})
//     </span>
//     <Button
//       variant="outline-secondary"
//       size="sm"
//       onClick={handleChangePatient}
//     >
//       Cambiar paciente
//     </Button>
//   </div>
// )}


//       {/* {searchMode ? (
//         <>
//           <Row className="mb-2">
//             <Col md={4}>
//               <Form.Select
//                 name="identificationType"
//                 value={formData.identificationType || ""}
//                 onChange={(e) =>
//                   onChange({ name: e.target.name, value: e.target.value })
//                 }
//               >
//                 <option value="">Tipo Documento</option>
//                 {documentTypes.map((doc) => (
//                   <option key={doc.code} value={doc.code}>
//                     {doc.description}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Col>
//             <Col md={6}>
//               <Form.Control
//                 placeholder="Número de identificación"
//                 name="identificationNumber"
//                 value={formData.identificationNumber || ""}
//                 onChange={(e) =>
//                   onChange({ name: e.target.name, value: e.target.value })
//                 }
//               />
//             </Col>
//             <Col md={2}>
//               <Button onClick={handleSearchPatient} disabled={loading}>
//                 {loading ? "Buscando..." : "Buscar"}
//               </Button>
//             </Col>
//           </Row>

//           {patientResults.length > 0 && (
//             <ul
//               className="list-group mb-3"
//               style={{ maxHeight: "200px", overflowY: "auto" }}
//             >
//               {patientResults.map((patient) => (
//                 <li
//                   key={patient.patientId || patient.id}
//                   className="list-group-item list-group-item-action"
//                   onClick={() => handleSelectPatient(patient)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   {patient.firstName} {patient.lastName} ({patient.identification} {patient.birthDate ? `- ${new Date(patient.birthDate).toLocaleDateString("es-CO")}` : ""})
//                 </li>
//               ))}
//             </ul>
//           )}

//           {noResults && (
//             <div className="text-danger mb-2">
//               ❌ No se encontraron pacientes
//               <br />
//               Puede crear un nuevo paciente usando el botón abajo.
//               <Button
//                 variant="outline-primary"
//                 size="sm"
//                 className="mt-2"
//                 onClick={() => setShowCreateModal(true)}
//               >
//                 Crear Paciente
//               </Button>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="p-2 border rounded bg-light mb-3 d-flex justify-content-between align-items-center">
//           <span>
//             🧍 Paciente seleccionado: <b>{formData.firstName} {formData.lastName}</b> ({formData.identificationType} {formData.identificationNumber || formData.identification})
//           </span>
//           <Button variant="outline-secondary" size="sm" onClick={handleChangePatient}>
//             Cambiar paciente
//           </Button>
//         </div>
//       )} */}

//       {/* CIE10 */}
//       <h5 className="mt-4">🩺 Clacificación CIE10</h5>
//       <AsyncSelect
//         cacheOptions
//         loadOptions={loadCie10Options}
//         defaultOptions
//         placeholder="Buscar y seleccionar CIE10..."
//         value={
//           formData.cie10
//             ? {
//                 value: formData.cie10,
//                 label: cie10List.find((c) => c.code === formData.cie10)?.description || formData.cie10,
//               }
//             : null
//         }
//         onChange={(selected: any) =>
//           onChange({ name: "cie10", value: selected?.value || "" })
//         }
//         isClearable
//       />

//       {/* Prioridad */}
//       <h5 className="mt-4">⚠️ Prioridad</h5>
//       <Form.Select
//         name="priority"
//         value={formData.priority || ""}
//         onChange={(e) => onChange({ name: e.target.name, value: e.target.value })}
//       >
//         <option value="">Seleccione</option>
//         <option value="1">Normal</option>
//         <option value="3">Urgente</option>
//       </Form.Select>

//       {/* Observaciones */}
//       <h5 className="mt-4">📝 Observaciones</h5>
//       <Form.Control
//         as="textarea"
//         rows={3}
//         name="observation"
//         value={formData.observation || ""}
//         onChange={(e) => onChange({ name: e.target.name, value: e.target.value })}
//       />

//       {/* Modal Crear Paciente */}
//       <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered>
//         <Modal.Header closeButton className="bg-primary text-white">
//           <Modal.Title>➕ Crear Nuevo Paciente</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <Form>
//             <h6 className="text-muted mt-2">📌 Datos de Identificación</h6>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <Form.Label>Tipo de Documento</Form.Label>
//                 <Form.Select
//                   value={newPatientData.identificationType}
//                   onChange={(e) => setNewPatientData({...newPatientData, identificationType: e.target.value})}
//                 >
//                   {documentTypes.map((doc) => (
//                     <option key={doc.code} value={doc.code}>
//                       {doc.description}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Col>
//               <Col md={8}>
//                 <Form.Label>Número de Documento</Form.Label>
//                 <Form.Control
//                   placeholder="Ej: 91500600"
//                   value={newPatientData.identificationNumber}
//                   onChange={(e) => setNewPatientData({...newPatientData, identificationNumber: e.target.value})}
//                 />
//               </Col>
//             </Row>

//             <h6 className="text-muted">🧍 Datos Personales</h6>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Label>Primer Nombre</Form.Label>
//                 <Form.Control
//                   placeholder="Ej: Fernando"
//                   value={newPatientData.firstName}
//                   onChange={(e) => setNewPatientData({...newPatientData, firstName: e.target.value})}
//                 />
//               </Col>
//               <Col md={6}>
//                 <Form.Label>Segundo Nombre</Form.Label>
//                 <Form.Control
//                   placeholder="Ej: Andrés"
//                   value={newPatientData.middleName}
//                   onChange={(e) => setNewPatientData({...newPatientData, middleName: e.target.value})}
//                 />
//               </Col>
//               <Col md={6} className="mt-2">
//                 <Form.Label>Primer Apellido</Form.Label>
//                 <Form.Control
//                   placeholder="Ej: Higuera"
//                   value={newPatientData.lastName}
//                   onChange={(e) => setNewPatientData({...newPatientData, lastName: e.target.value})}
//                 />
//               </Col>
//               <Col md={6} className="mt-2">
//                 <Form.Label>Segundo Apellido</Form.Label>
//                 <Form.Control
//                   placeholder="Ej: Escalante"
//                   value={newPatientData.surName}
//                   onChange={(e) => setNewPatientData({...newPatientData, surName: e.target.value})}
//                 />
//               </Col>
//               <Col md={4} className="mt-2">
//                 <Form.Label>Sexo</Form.Label>
//                 <Form.Select
//                   value={newPatientData.gender}
//                   onChange={(e) => setNewPatientData({...newPatientData, gender: e.target.value})}
//                 >
//                   <option value="M">Masculino</option>
//                   <option value="F">Femenino</option>
//                   {/* <option value="I">Indefinido</option> */}
//                 </Form.Select>
//               </Col>
//               <Col md={4} className="mt-2">
//                 <Form.Label>Fecha de Nacimiento</Form.Label>
//                 <Form.Control
//                   type="date"
//                   value={newPatientData.birthDate}
//                   onChange={(e) => setNewPatientData({...newPatientData, birthDate: e.target.value})}
//                 />
//               </Col>
//             </Row>

//             <h6 className="text-muted">🏠 Contacto y Dirección</h6>
//             <Row className="mb-3">
//               <Col md={8}>
//                 <Form.Label>Dirección</Form.Label>
//                 <Form.Control
//                   placeholder="Ej: Calle 48 # 32 - 25"
//                   value={newPatientData.address}
//                   onChange={(e) => setNewPatientData({...newPatientData, address: e.target.value})}
//                 />
//               </Col>
//               <Col md={4}>
//                 <Form.Label>Zona</Form.Label>
//                 <Form.Select
//                   value={newPatientData.addressZone}
//                   onChange={(e) => setNewPatientData({...newPatientData, addressZone: e.target.value})}
//                 >
//                   <option value="U">Urbano</option>
//                   <option value="R">Rural</option>
//                 </Form.Select>
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Label>Departamento</Form.Label>
//                 <Select
//                   options={divipola}
//                   value={divipola.find(r => r.value === newPatientData.region) || null}
//                   onChange={(selected: any) => {
//                     setNewPatientData({
//                       ...newPatientData,
//                       region: selected.value,
//                       city: "",
//                     });
//                     setCityOptions(selected.cities);
//                   }}
//                   placeholder="Seleccione Departamento"
//                 />
//               </Col>
//               <Col md={6}>
//                 <Form.Label>Ciudad</Form.Label>
//                 <Select
//                   options={cityOptions}
//                   value={cityOptions.find(c => c.value === newPatientData.city) || null}
//                   onChange={(selected: any) => setNewPatientData({...newPatientData, city: selected.value})}
//                   placeholder="Seleccione Ciudad"
//                   isDisabled={!newPatientData.region}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Label>Teléfono</Form.Label>
//                 <Form.Control
//                   placeholder="Ej: 6787870"
//                   value={newPatientData.phoneNumber}
//                   onChange={(e) => setNewPatientData({...newPatientData, phoneNumber: e.target.value})}
//                 />
//               </Col>
//               <Col md={6}>
//                 <Form.Label>Celular</Form.Label>
//                 <Form.Control
//                   placeholder="Ej: 3163568644"
//                   value={newPatientData.mobileNumber}
//                   onChange={(e) => setNewPatientData({...newPatientData, mobileNumber: e.target.value})}
//                 />
//               </Col>
//             </Row>

//             <Col md={12}>
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Ej: servicioalcliente@higueraescalante.com"
//                 value={newPatientData.email}
//                 onChange={(e) => setNewPatientData({...newPatientData, email: e.target.value})}
//               />
//             </Col>
//           </Form>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
//             Cancelar
//           </Button>
//           <Button variant="primary" onClick={handleCreatePatient}>
//             Guardar Paciente
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default PatientStep;



// // src/pages/PreRegistro/steps/PatientStep.tsx
// import React, { useState } from "react";
// import { Button } from "react-bootstrap";
// import PatientModal from "../modals/PatientModal";

// interface PatientStepProps {
//   formData: any;
//   cie10List: any[];
//   onChange: (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => void;
//   onPatientSelect: (patient: any) => void; // ✅ callback para seleccionar paciente
// }

// const PatientStep: React.FC<PatientStepProps> = ({
//   formData,
//   cie10List,
//   onChange,
//   onPatientSelect,
// }) => {
//   const [showModal, setShowModal] = useState(false);

//   // ✅ Manejo de cambios en selects adicionales
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     onChange(e); // reutilizamos el mismo callback que recibes por props
//   };

//   return (
//     <div>
//       <h5>👤 Información del Paciente</h5>

//       {/* Botón para abrir modal */}
//       <Button variant="primary" onClick={() => setShowModal(true)}>
//         ➕ Agregar Paciente
//       </Button>

//       {/* Paciente seleccionado */}
//       {formData.patientId && (
//         <div className="alert alert-success mt-3">
//           Paciente seleccionado:{" "}
//           <b>
//             {formData.firstName} {formData.lastName}
//           </b>{" "}
//           (ID: {formData.patientId})
//         </div>
//       )}

//       {/* CIE10 y Prioridad */}
//       <div className="row mt-3">
//         <div className="col-md-6">
//           <label className="form-label">CIE10 *</label>
//           <select
//             name="cie10"
//             value={formData.cie10}
//             onChange={onChange}
//             className="form-select"
//             required
//           >
//             <option value="">Seleccione un código</option>
//             {cie10List.map((cie) => (
//               <option key={cie.code} value={cie.code}>
//                 {cie.code} - {cie.description}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="col-md-6">
//           <label className="form-label">Prioridad *</label>
//           <select
//             name="priority"
//             value={formData.priority}
//             onChange={handleChange}
//             className="form-select"
//             required
//           >
//             <option value="">Seleccione...</option>
//             <option value="1">Urgente</option>
//             <option value="2">Consulta prioritaria</option>
//             <option value="3">Normal</option>
//           </select>
//         </div>
//       </div>

//       {/* Observación */}
//       <label className="form-label mt-2">Observación</label>
//       <textarea
//         name="observation"
//         value={formData.observation}
//         onChange={onChange}
//         className="form-control"
//         rows={2}
//       />

//       {/* Modal para seleccionar paciente */}
//       <PatientModal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         onSelect={(patient) => {
//           onPatientSelect(patient);
//           setShowModal(false);
//         }}
//       />
//     </div>
//   );
// };

// export default PatientStep;
