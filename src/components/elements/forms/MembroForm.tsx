import { useState } from "react";
import { MembroFormData } from "../../../types/interfaces";
import { IoMdClose } from "react-icons/io";
import { FaUserPlus } from "react-icons/fa";

export interface MembroFormProps {
  setorId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const MembroForm: React.FC<MembroFormProps> = ({
  setorId,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<MembroFormData>({
    nome: "",
    email: "",
    cargo: "",
    telefone: "",
    setorId: setorId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nome && formData.email && formData.cargo) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FaUserPlus className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Adicionar Membro
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoMdClose className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo*
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nome completo do colaborador"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="colaborador@empresa.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo *
            </label>
            <input
              type="text"
              value={formData.cargo}
              onChange={(e) =>
                setFormData({ ...formData, cargo: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Analista, Gerente, Coordenador"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              value={formData.telefone}
              onChange={(e) =>
                setFormData({ ...formData, telefone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="(11) 9999-9999"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Adicionar Membro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
