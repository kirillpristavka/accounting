import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AppProvider } from './context/AppContext';
import MainPage from './pages/MainPage';
import Topbar from './components/Topbar';
import OrganizationsPage from './pages/OrganizationsPage';
import OrganizationCreatePage from './pages/OrganizationCreatePage';
import NomenclaturePage from './pages/NomenclaturePage';
import NomenclatureCreatePage from './pages/NomenclatureCreatePage';
import NomenclatureEditPage from './pages/NomenclatureEditPage';

const App: React.FC = () => (
  <AppProvider>
    <Router>
      <Topbar />
      <div className="flex h-screen">
        <Sidebar />
        <Routes>
          <Route path="/" />
          <Route path="/main" element={<MainPage />} />
          <Route path="/organizations" element={<OrganizationsPage />} />
          <Route path="/organizations/create" element={<OrganizationCreatePage />} />
          <Route path="/nomenclature" element={<NomenclaturePage />} />
          <Route path="/nomenclature/create" element={<NomenclatureCreatePage />} />
          <Route path="/nomenclature/:id/edit" element={<NomenclatureEditPage />} />
        </Routes>
      </div>
    </Router>  
  </AppProvider>  
);

export default App;