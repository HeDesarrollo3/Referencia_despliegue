// src/App.tsx
import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index";
import "./styles/global.css";


// =============================
// Contexto de autenticación
// =============================
interface AuthContextType {
  isAuthenticated: boolean;
  handleLogin: (token: string, name: string) => void;
  handleLogout: () => void;
  userName: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// =============================
// App principal
// =============================
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName");

    if (token) {
      setIsAuthenticated(true);
      setUserName(storedUserName || "Usuario");
    }
  }, []);

  const handleLogin = (token: string, name: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", name);
    setIsAuthenticated(true);
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setUserName("");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, handleLogin, handleLogout, userName }}
    >
      <BrowserRouter>
        <AppRoutes /> 
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;

// // src/App.tsx
// import React, { createContext, useState, useEffect } from "react";
// import { BrowserRouter } from "react-router-dom";
// import AppRoutes from "./routes/index";
// import "./styles/global.css";
// import { Toaster } from "react-hot-toast";

// // =============================
// // Contexto de autenticación
// // =============================
// interface AuthContextType {
//   isAuthenticated: boolean;
//   handleLogin: (token: string, name: string) => void;
//   handleLogout: () => void;
//   userName: string;
// }

// export const AuthContext = createContext<AuthContextType | null>(null);

// // =============================
// // App principal
// // =============================
// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userName, setUserName] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUserName = localStorage.getItem("userName");

//     if (token) {
//       setIsAuthenticated(true);
//       setUserName(storedUserName || "Usuario");
//     }
//   }, []);

//   const handleLogin = (token: string, name: string) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("userName", name);
//     setIsAuthenticated(true);
//     setUserName(name);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userName");
//     setIsAuthenticated(false);
//     setUserName("");
//   };

//   return (
//     <AuthContext.Provider
//       value={{ isAuthenticated, handleLogin, handleLogout, userName }}
//     >
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>

//       {/* 🔥 Toaster global */}
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: "#333",
//             color: "#fff",
//             borderRadius: "10px",
//           },
//           success: {
//             iconTheme: {
//               primary: "#4CAF50",
//               secondary: "#fff",
//             },
//           },
//           error: {
//             iconTheme: {
//               primary: "#F44336",
//               secondary: "#fff",
//             },
//           },
//         }}
//       />
//     </AuthContext.Provider>
//   );
// }

// export default App;
