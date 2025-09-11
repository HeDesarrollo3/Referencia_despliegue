// src/pages/PreRegistro/services/api.ts
import axios from "axios";

// const API_URL = "http://localhost:3000/api/v1/higuera-escalante";
const API_URL = "http://192.168.11.14:3000/api/v1/higuera-escalante";


//buscar paciente por tipo y número de identificación

export const findPatient = async (token: string, identificationType: string, identification: string) => {
  const res = await axios.post(
    `${API_URL}/patients/find-identifier`,
    { identificationType, identification },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.patients || [];
};


//registro de paciente ES post

export const registerPatient = async (token: string, patientData: any) => {
  const res = await axios.post(
    `${API_URL}/patients/register`,
    patientData,
    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
  );
  return res.data;
};


// ✅ CIE10 no requiere autenticación y es GET
export const getCie10 = async () => {
  const res = await axios.get(`${API_URL}/code-system/international-cie10`);
  // Devuelve el array directamente
  return res.data || [];
};


// productos tarifario y registrar orden sí requieren token y son POST

export const getTariffProducts = async (token: string) => {
  const res = await axios.post(
    `${API_URL}/tariff-product`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.customerAccounts || [];
};

//registro preorden

export const registerOrder = async (token: string, formData: any) => {
  //  limpiamos el payload
  const payload: any = {
    cie10: formData.cie10,
    priority: formData.priority,
    observation: formData.observation,
    patientId: formData.patientId,
    customerAccountId: formData.customerAccountId,
    tariffId: formData.tariffId,
    products: formData.products.filter((p: any) => p.productId !== ""), // quitamos vacíos
  };

  try {
    const res = await axios.post(`${API_URL}/orders/register`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ Error al registrar orden:", err.response?.data || err.message);
    throw err;
  }
};

/// ✅ obtener lista de pre-registros (órdenes)

export const getPreRegistros = async (token: string) => {
  try {
    const res = await axios.post(
      `${API_URL}/orders/by-term/`,
      {}, // body vacío, a menos que quieras pasar filtros
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const pacientes = res.data;

    console.log("📌 Pre-registros desde API:", pacientes);

    // transformamos pacientes+órdenes
    const orders = pacientes.flatMap((p: any) =>
      (p.orders || []).map((o: any) => ({
        orderId: o.orderId,
        orderNumber: o.orderNumber,
        state: o.state,
        creationDate: o.creationDate,
        cie10: o.cie10,
        observation: o.observation,
        // datos del paciente
        patientId: p.patientId,
        identification: p.identification,
        identificationType: p.identificationType,
        patientName: `${p.firstName ?? ""} ${p.middleName ?? ""} ${p.lastName ?? ""} ${p.surName ?? ""}`.trim(),
        gender: p.gender,
        birthDate: p.birthDate,
        mobileNumber: p.mobileNumber,
        email: p.email,
        // cliente y tarifa
        customerId: p.customer?.customerId ?? "",
        customerAccountId: o.customerAccountId,
        tariffId: o.tariffId,
        customerName: o.customer?.name ?? "",
        customerAccountName: o.customerAccount?.name ?? "",
        tariffName: o.tariff?.name ?? "",
      }))
    );

    console.log("✅ Pre-registros transformados:", orders);
    return orders;
  } catch (err: any) {
    console.error("❌ Error al obtener pre-registros:", err.response?.data || err.message);
    throw err;
  }
};




// actualizar orden
export const updateOrder = async (token: string, orderId: string, orderData: any) => {
  try {
    const res = await fetch(
      `${API_URL}/orders/${orderId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al actualizar la orden");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error en updateOrder:", error);
    throw error;
  }
};

