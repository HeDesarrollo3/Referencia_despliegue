// En '../../services/apiAdmin.ts'

import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}`;

// Define las interfaces necesarias para tipado
interface Product {
  orderProductId: string;
  productId: string;
  name: string;
  price: number;
  pendingPayments: number;
  code: string;
  altCode: string;
}

interface Order {
  orderId: string;
  orderNumber: string;
  cie10: string;
  priority: string;
  observation: string;
  patientId: string;
  customerAccountId: string;
  customerAccountName: string;
  state: string;
  creationDate: string;
  patientName: string;
  identification: string;
  customerName: string;
  tariffName: string;
  products: Product[];
  tariffId: string;
  email: string;
  gender: string;
  mobileNumber: string;
  identificationType: string;
  birthDate: string;
}

// 1. Función para obtener órdenes por estado
export const fetchOrders = async (orderState: string, token: string | null): Promise<Order[]> => {
  if (!token) throw new Error("Token de autenticación no encontrado.");

  try {
    const response = await axios.post(
      `${API_URL}/orders/by-term`,
      { orderState },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const ordersData = response.data.data;

    // Lógica de transformación de datos (la misma que tenías)
    const transformedOrders: Order[] = ordersData.flatMap((patient: any) =>
      (patient.orders || []).map((order: any) => ({
        orderId: order.orderId,
        orderNumber: order.orderNumber || "N/A",
        state: order.state,
        creationDate: order.creationDate,
        observation: order.observation,
        patientName: `${patient.firstName} ${patient.middleName || ""} ${patient.lastName} ${patient.surName}`.trim(),
        identification: patient.identification,
        identificationType: patient.identificationType,
        customerName: order.customer?.name || "N/A",
        customerId: order.customer?.customerId || "N/A", // Se mantiene para fetchAccounts
        customerAccountId: order.customerAccount?.customerAccountId || "N/A",
        customerAccountName: order.customerAccount?.name || "N/A",
        tariffName: order.tariff?.name || "N/A",
        tariffId: order.tariff?.tariffId || "N/A",
        cie10: order.cie10,
        priority: order.priority,
        patientId: patient.patientId,
        email: patient.email,
        gender: patient.gender,
        mobileNumber: patient.mobileNumber,
        birthDate: patient.birthDate,
        products: order.products.map((product: any) => ({
          orderProductId: product.orderProductId,
          productId: product.product.productId,
          name: product.product.name,
          price: product.price,
          pendingPayments: product.pendingPayment,
          code: product.product.code,
          altCode: product.product.altCode,
        })),
      }))
    );
    return transformedOrders;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return []; // Retorna un array vacío en caso de 404
    }
    // Propaga el error para que el componente lo maneje (mostrar mensaje de error)
    throw error;
  }
};

// 2. Función para obtener cuentas de un cliente
export const fetchAccounts = async (customerId: string, token: string | null): Promise<any[]> => {
    if (!token) throw new Error("Token de autenticación no encontrado.");

    try {
        const response = await axios.post(
            `${API_URL}/tariff-product/by-account/${customerId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        const accountsData = response.data.customerAccounts;

        if (Array.isArray(accountsData)) {
            return accountsData;
        } else {
            console.error("La respuesta de cuentas no es un array:", accountsData);
            return [];
        }
    } catch (error) {
        console.error("Error al obtener cuentas:", error);
        throw error;
    }
};

// 3. Función para eliminar un producto (PATCH a la orden)
export const apiDeleteProduct = async (orderId: string, requestBody: any, token: string | null) => {
    if (!token) throw new Error("Token de autenticación no encontrado.");

    const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el producto.');
    }

    return await response.json();
};

// 4. Función para actualizar la orden y cambiar el estado
export const apiUpdateOrderAndChangeState = async (orderId: string, requestBody: any, newState: string, token: string | null) => {
    if (!token) throw new Error("Token de autenticación no encontrado.");

    // 1. Actualizar los productos (PATCH)
    const updateProductsResponse = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
    });

    if (!updateProductsResponse.ok) {
        const errorData = await updateProductsResponse.json();
        throw new Error('Error al actualizar los productos: ' + (errorData.message || 'Error desconocido.'));
    }

    // 2. Cambiar el estado de la orden (PATCH)
    const changeStateResponse = await fetch(`${API_URL}/orders/${orderId}/change-state?state=${newState}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!changeStateResponse.ok) {
        const errorData = await changeStateResponse.json();
        throw new Error('Error al cambiar el estado de la orden: ' + (errorData.message || 'Error desconocido.'));
    }

    return await changeStateResponse.json();
};

// src/services/apiAdmin.ts

export const fetchDashBorad = async (token: string | null) => {
  if (!token) throw new Error("Token de autenticación no encontrado.");

  const response = await fetch(`${API_URL}/orders/query-dashboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener los datos del dashboard.');
  }

  return await response.json();
};

export const fetchDashBoradUser = async (token: string | null) => {
  if (!token) throw new Error("Token de autenticación no encontrado.");

  const response = await fetch(`${API_URL}/users/query-dashboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener los datos del dashboard.');
  }

  return await response.json();
};



// Exporta las interfaces también para usarlas en el componente
export type { Product, Order };