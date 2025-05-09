import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MainPage from "./pages/MainPage";
import ReportsPage from "./pages/ReportsPage";
import SalesPage from "./pages/SalesPage";
import SettingsPage from "./pages/SettingsPage";
import Organizations from "./pages/OrganizationsPage";
import type { JSX } from "react";
import OrganizationsPage from "./pages/OrganizationsPage";
import OrganizationCreatePage from "./pages/OrganizationCreatePage";

function App(): JSX.Element {
  const [active, setActive] = useState<string>("");

  return (
    <Router>
      <div className="App flex">
        <Sidebar active={active} setActive={setActive} />
        <div className="ml-64 p-4 w-full">
          <Routes>
            <Route
              path="/main"
              element={<MainPage onClose={() => setActive("")} />}
            />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/organizations/create" element={<OrganizationCreatePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
