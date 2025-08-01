import React from "react";
import { PermissionsDemo } from "../components/PermissionsDemo";

export const PermissionsTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PermissionsDemo />
      </div>
    </div>
  );
};
