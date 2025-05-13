import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AppProvider } from './context/AppContext';
import MainPage from './pages/MainPage';
import Topbar from './components/Topbar';
import OrganizationsPage from './pages/OrganizationsPage';

const App: React.FC = () => (
  <AppProvider>
    <Router>
      <Topbar />
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          <Routes>
            <Route path="/" />
            <Route path="/main" element={<MainPage />} />
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/manager" element={<h1 className="text-2xl font-semibold">Руководителю</h1>} />
            <Route path="/bank-cash" element={<h1 className="text-2xl font-semibold">Банк и касса</h1>} />
            <Route path="/sales" element={<h1 className="text-2xl font-semibold">Продажи</h1>} />
            <Route path="/purchases" element={<h1 className="text-2xl font-semibold">Покупки</h1>} />
            <Route path="/warehouse" element={<h1 className="text-2xl font-semibold">Склад</h1>} />
            <Route path="/production" element={<h1 className="text-2xl font-semibold">Производство</h1>} />
            <Route path="/assets" element={<h1 className="text-2xl font-semibold">ОС и НМА</h1>} />
            <Route path="/hr" element={<h1 className="text-2xl font-semibold">Зарплата и кадры</h1>} />
            <Route path="/operations" element={<h1 className="text-2xl font-semibold">Операции</h1>} />
            <Route path="/reports" element={<h1 className="text-2xl font-semibold">Отчеты</h1>} />
            <Route path="/references" element={<h1 className="text-2xl font-semibold">Справочники</h1>} />
            <Route path="/admin" element={<h1 className="text-2xl font-semibold">Администрирование</h1>} />
            <Route path="/help" element={<h1 className="text-2xl font-semibold">Помощь</h1>} />
          </Routes>
        </main>
      </div>
    </Router>  
  </AppProvider>  
);

export default App;