// FILE: src/services/apiAdmin.ts
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000/";
const API_URL = `${API_BASE}api/v1/higuera-escalante`;

// -----------------------------------------------
//  Utilidad para detección segura de arrays
// -----------------------------------------------
const getPayloadArray = (res: any) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (res.data && Array.isArray(res.data)) return res.data;
  if (res.data && res.data.data && Array.isArray(res.data.data)) return res.data.data;
  return [];
};

// =====================================================
//  1) OBTENER ÓRDENES POR ESTADO
// =====================================================
export const fetchOrdersByState = async (token: string | null, orderState = "REGISTRADA") => {
  const url = `${API_URL}/orders/by-term/`;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await axios.post(url, { orderState }, { headers });
  const patients = getPayloadArray(res.data ?? res);

  if (!Array.isArray(patients)) return [];

  const transformed = patients.flatMap((patient: any) =>
    (patient.orders || []).map((order: any) => ({
      orderId: order.orderId,
      orderNumber: order.orderNumber || "N/A",
      state: order.state,
      creationDate: order.creationDate,
      observation: order.observation,

      // Paciente
      patientName: `${patient.firstName ?? ""} ${patient.middleName ?? ""} ${patient.lastName ?? ""} ${patient.surName ?? ""}`.trim(),
      identification: patient.identification,
      identificationType: patient.identificationType,
      email: patient.email,
      gender: patient.gender,
      mobileNumber: patient.mobileNumber,
      birthDate: patient.birthDate,
      patientId: patient.patientId,

      // Customer + Tarifa
      customerName: order.customer?.name || "N/A",
      customerId: order.customer?.customerId || "N/A",
      customerAccountId: order.customerAccount?.customerAccountId || "N/A",
      customerAccountName: order.customerAccount?.name || "N/A",
      tariffName: order.tariff?.name || "N/A",
      tariffId: order.tariff?.tariffId || "N/A",

      products: (order.products || []).map((p: any) => ({
        orderProductId: p.orderProductId,
        productId: p.product?.productId || p.productId,
        name: p.product?.name || p.name,
        price: p.price,
        pendingPayment: p.pendingPayment,
        code: p.product?.code || p.code,
        altCode: p.product?.altCode || p.altCode,
      })),
    }))
  );

  return transformed;
};

// =====================================================
// 2) OBTENER CUENTAS DE UN CUSTOMER
// =====================================================
export const fetchAccountsByCustomer = async (token: string, customerId: string) => {
  try {
    const res = await axios.get(
      `${API_URL}/customers/${customerId}/accounts`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data.accounts || [];
  } catch (err: any) {
    console.error("❌ Error en fetchAccountsByCustomer:", err.response?.data || err.message);
    throw err;
  }
};

// =====================================================
//  3) PATCH ORDEN COMPLETO
// =====================================================
export const patchOrder = async (token: string, orderId: string, data: any) => {
  try {
    const res = await axios.patch(
      `${API_URL}/orders/${orderId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err: any) {
    console.error("❌ Error en patchOrder:", err.response?.data || err.message);
    throw err;
  }
};

// =====================================================
//  4) CAMBIAR ESTADO DE ORDEN
// =====================================================
export const changeOrderState = async (token: string, orderId: string, newState: string) => {
  try {
    const res = await axios.patch(
      `${API_URL}/orders/${orderId}/state`,
      { state: newState },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err: any) {
    console.error("❌ Error en changeOrderState:", err.response?.data || err.message);
    throw err;
  }
};
