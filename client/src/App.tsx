// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { AppProvider, useAppContext } from './context/AppContext';
import MainPage from './pages/MainPage';
import OrganizationsPage from './pages/OrganizationsPage';
import OrganizationCreatePage from './pages/OrganizationCreatePage';
import NomenclaturePage from './pages/NomenclaturePage';
import NomenclatureCreatePage from './pages/NomenclatureCreatePage';
import NomenclatureEditPage from './pages/NomenclatureEditPage';
import ReferencesPage from './pages/ReferencesPage';
import OrganizationEditPage from './pages/OrganizationEditPage';
import PopupBlock from './components/PopupBlock';
import ContragentsPage from './pages/ContragentsPage';
import ContragentCreatePage from './pages/ContragentCreatePage';
import BalanceEntryAssistantPage from './pages/BalanceEntryAssistantPage';
import GoodsBalanceEntryPage from './pages/GoodsBalanceEntryPage';

const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen min-h-0">
      <Topbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-0">
          <Routes>
            <Route path="/" />
            <Route path="/main" element={<MainPage />} />
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/organizations/create" element={<OrganizationCreatePage />} />
            <Route path="/organizations/:id/edit" element={<OrganizationEditPage />} />
            <Route path="/nomenclature" element={<NomenclaturePage />} />
            <Route path="/nomenclature/create" element={<NomenclatureCreatePage />} />
            <Route path="/nomenclature/:id/edit" element={<NomenclatureEditPage />} />
            <Route path="/references" element={<ReferencesPage />} />
            <Route path="/contragents" element={<ContragentsPage />} />
            <Route path="/contragents/create" element={<ContragentCreatePage />} />
            <Route path="/balance-entry-assistant" element={<BalanceEntryAssistantPage />} />
            <Route path="/goods-balance-entry" element={<GoodsBalanceEntryPage />} />
          </Routes>
          <PopupBlock />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <Router>
      <AppLayout />
    </Router>
  </AppProvider>
);

export default App;