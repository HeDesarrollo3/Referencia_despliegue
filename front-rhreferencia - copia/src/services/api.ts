// src/pages/PreRegistro/services/api.ts
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/higuera-escalante";
// const API_URL = "http://192.168.11.14:3000/api/v1/higuera-escalante";


//buscar paciente por tipo y número de identificación

export const findPatient = async (token: string, identificationType: string, identification: string, birthDate?: any) => {
  const res = await axios.post(
    `${API_URL}/patients/find-identifier`,
    { identificationType, identification },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log("🔍 Pacientes encontrados:", res.data.patients);
  return res.data.patients || [];
};


// ✅ Registro de paciente (CORREGIDA)
export const registerPatient = async (token: string, data: any) => {
  try {
    const res = await axios.post( 
      `${API_URL}/patients/register`,
      {
        identification: data.identification,
        identificationType: data.identificationType,
        firstName: data.firstName,
        middleName: data.middleName || "",
        lastName: data.lastName,
        surName: data.surName || "",
        gender: data.gender || "",
        birthDate: data.birthDate,
        address: data.address || "",
        addressZone: data.addressZone || "R",
        city: data.city || "11001",
        region: data.region || "11",
        countryId: data.countryId || "CO",
        phoneNumber: data.phoneNumber || "",
        mobileNumber: data.mobileNumber || "",
        email: data.email || "",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.error("❌ Error al registrar paciente:", err.response?.data || err.message);
    throw err;
  }
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

// /// ✅ obtener lista de pre-registros (órdenes)

// export const getPreRegistros = async (token: string) => {
//   try {
//     const res = await axios.post(
//       `${API_URL}/orders/by-term/`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const pacientes = res.data;
//     console.log("📌 Pre-registros desde API:", pacientes);

//     // ✅ Transformamos pacientes + órdenes + productos
//     const orders = pacientes.flatMap((p: any) =>
//       (p.orders || []).flatMap((o: any) =>
//         (o.products || []).map((prod: any) => ({
//           orderId: o.orderId,
//           orderNumber: o.orderNumber,
//           state: o.state,
//           creationDate: o.creationDate,
//           observation: o.observation,

//           // ✅ DATOS DEL PACIENTE
//           patientId: p.patientId,
//           identification: p.identification,
//           identificationType: p.identificationType,
//           patientName: `${p.firstName ?? ""} ${p.middleName ?? ""} ${p.lastName ?? ""} ${p.surName ?? ""}`.trim(),
//           gender: p.gender,
//           birthDate: p.birthDate,
//           mobileNumber: p.mobileNumber,
//           email: p.email,

//           // ✅ DATOS DEL PRODUCTO
//           productCode: prod.product?.code ?? "",
//           productName: prod.product?.name ?? "",
//           price: prod.price ?? 0,
//           quantity: prod.quantity ?? 0,
//           pendingPayment: prod.pendingPayment ?? 0,

//           // ✅ CLIENTE Y TARIFA
//           customerId: o.customer?.customerId ?? "",
//           customerAccountId: o.customerAccountId,
//           tariffId: o.tariffId,
//           customerName: o.customer?.name ?? "",
//           customerAccountName: o.customerAccount?.name ?? "",
//           tariffName: o.tariff?.name ?? "",
//         }))
//       )
//     );

//     console.log("✅ Órdenes transformadas:", orders);
//     return orders;
//   } catch (err: any) {
//     console.error("❌ Error al obtener pre-registros:", err.response?.data || err.message);
//     throw err;
//   }
// };



export const getPreRegistros = async (token: string) => {
  try {
    const res = await axios.post(
      `${API_URL}/orders/by-term/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const pacientes = res.data;
    console.log("📌 Pre-registros desde API:", pacientes);

    // ✅ Transformamos para que cada preregistro tenga patientName, orderNumber y orderCreationDate
    const registros = pacientes.flatMap((p: any) =>
      (p.orders || []).map((o: any) => ({
        patientId: p.patientId,
        identification: p.identification,
        identificationType: p.identificationType,
        patientName: `${p.firstName ?? ""} ${p.middleName ?? ""} ${p.lastName ?? ""} ${p.surName ?? ""}`.trim(),
        gender: p.gender,
        birthDate: p.birthDate,
        mobileNumber: p.mobileNumber,
        email: p.email,
        state: o.state,

        // 👇 lo que quieres mostrar
        orderId: o.orderId,
        orderNumber: o.orderNumber,
        orderCreationDate: o.creationDate,
        orderState: o.state,
        orderObservation: o.observation,
        orderCie10: o.cie10,
        orderPriority: o.priority,
        customerAccountId: o.customerAccountId,
        tariffId: o.tariffId,
        products: o.products || [],

        customerAccountName: o.customerAccount?.name || "",
        customerId: o.customer?.customerId || "",
        customerName: o.customer?.name || "",
        tariffName: o.tariff?.name || "",
      }))
    );

    console.log("✅ Registros transformados:", registros);

    return registros;
    
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

// ✅ Cambiar contraseña de usuario
export const changeUserPassword = async (token: string, data: any) => {
  try {
    const body = {
      identificationType: data.user_identificationType,
      identification: data.user_identification,
      email: data.user_email,
      passwordHash: data.passwordHash,
    };

    const res = await axios.patch(
      `${API_URL}/users/change-password`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("🔑 Contraseña cambiada:", res.data);
    return res.data;
  } catch (err: any) {
    console.error("❌ Error al cambiar la contraseña:", err.response?.data || err.message);
    throw err;
  }
};
