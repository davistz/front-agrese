import { Routes, Route } from "react-router-dom";
import { Login } from "../components/Login";
import { Register } from "../components/Register";
import { Dashboard } from "../components/Dashboard";

export const AuthPage = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};
