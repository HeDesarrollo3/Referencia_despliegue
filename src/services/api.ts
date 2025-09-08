// src/pages/PreRegistro/services/api.ts
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/higuera-escalante";


export const findPatient = async (token: string, identificationType: string, identification: string) => {
  const res = await axios.post(
    `${API_URL}/patients/find-identifier`,
    { identificationType, identification },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.patients || [];
};

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
  // 🔹 limpiamos el payload
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

//  obtener lista de pre-registros (órdenes)
export const getPreRegistros = async (token: string) => {
  try {
    const res = await axios.post(
      `${API_URL}/orders/by-term`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 📌 res.data es un array de pacientes con sus órdenes
    const patients = res.data || [];

    // 📌 aplanar pacientes + sus órdenes
    const orders = patients.flatMap((p: any) =>
      (p.orders || []).map((o: any) => ({
        orderId: o.orderId,
        creationDate: o.creationDate,
        orderNumber: o.orderNumber,
        state: o.state,
        patientName: `${p.firstName} ${p.lastName} ${p.surName || ""}`,
        patientId: p.identification,
      }))
    );

    console.log("📌 Pre-registros mapeados:", orders);

    return orders;
  } catch (err: any) {
    console.error("❌ Error al obtener pre-registros:", err.response?.data || err.message);
    throw err;
  }
};