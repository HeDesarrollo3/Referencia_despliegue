import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import PreRegistro  from '../pages/PreRegistro/Preregistro';
// import Resultados from '../pages/Resultados/Resultados';
import RegistroUsuarios from '../pages/RegistroUsuarios/RegistroUsuarios'; 


const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pre-registro" element={<PreRegistro />} />
      {/* <Route path="/resultados" element={<Resultados />} />  */}
      <Route path="/registro-usuarios" element={<RegistroUsuarios />} />
      {/* {/* Agrega más rutas aquí */}
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
