// 👇 Import dinámico
const jwt_decode = require("jwt-decode");

interface TokenPayload {
  iden?: string;
  identification?: string;
  exp?: number;
  iat?: number;
}

export const getIdentityFromToken = (): string => {
  const token = localStorage.getItem("token");
  if (!token) return "Invitado";

  try {
    const decoded = jwt_decode(token) as TokenPayload;
    return decoded.iden || decoded.identification || "Sin Identidad";
  } catch (err) {
    console.error("Error al decodificar token", err);
    return "Error";
  }
};
