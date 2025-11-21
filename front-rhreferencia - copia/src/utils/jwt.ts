// utils/jwt.ts
export const parseJwt = (token: string) => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (err) {
    console.error("Error parsing JWT:", err);
    return null;
  }
};
