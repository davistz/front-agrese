import { Routes, Route } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";
import { Dashboard } from "./Dashboard";
import { SetoresManagement } from "./SetoresManagement";
import { SetorDetail } from "./SetorDetails";
import { UserPage } from "./UserPage";

export const MainPage = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/setores" element={<SetoresManagement />} />
      <Route path="/setores/:setorKey" element={<SetorDetail />} />
      <Route path="/usuarios" element={<UserPage />} />
    </Routes>
  );
};
