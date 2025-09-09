import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import PreRegistro  from '../pages/PreRegistro/Preregistro';
// import Resultados from '../pages/Resultados/Resultados';
import RegistroUsuarios from '../pages/RegistroUsuarios/RegistroUsuarios'; 
import GestorDeNovedades from '../pages/GestorDeNovedades/GestorDeNovedades';
import PortafolioPage from '../pages/Portafolio/PortafolioPage';


const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pre-registro" element={<PreRegistro />} />
      {/* <Route path="/resultados" element={<Resultados />} />  */}
      <Route path="/registro-usuarios" element={<RegistroUsuarios />} />
      <Route path="/GestorDeNovedades" element={<GestorDeNovedades />} />
      <Route path="/portafolio" element={<PortafolioPage />} />
      {/* {/* Agrega más rutas aquí */}
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
