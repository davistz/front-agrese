import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthPage } from "./pages/AuthPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthPage />
  </StrictMode>
);
