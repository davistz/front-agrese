import { useState } from "react";
import { UserFormData, UserRole, SectorData } from "../../../types/interfaces";
import { IoMdClose } from "react-icons/io";
import { FaUser } from "react-icons/fa";

export interface UserFormProps {
  initialData?: UserFormData & { id?: number };
  sectors: SectorData[];
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  sectors,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: initialData?.email || "",
    password: "",
    name: initialData?.name || "",
    role: initialData?.role || "COLLABORATOR",
    sectorId: initialData?.sectorId || sectors[0]?.id || 0,
    isActive: initialData?.isActive ?? true,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.name && formData.sectorId) {
      // Se é edição e não tem senha, não enviar senha
      const submitData = { ...formData };
      if (initialData?.id && !formData.password) {
        delete submitData.password;
      }
      onSubmit(submitData);
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      ADMIN: "Administrador (Presidência/Gabinete)",
      MANAGER: "Gerente (DAF/Diretor Técnico)",
      COLLABORATOR: "Colaborador",
      IT_ADMIN: "Administrador de T.I.",
    };
    return labels[role];
  };

  const getRoleDescription = (role: UserRole) => {
    const descriptions: Record<UserRole, string> = {
      ADMIN: "Acesso total ao sistema",
      MANAGER: "Acesso aos setores subordinados",
      COLLABORATOR: "Acesso ao próprio setor",
      IT_ADMIN: "Acesso especial para gerenciar usuários",
    };
    return descriptions[role];
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FaUser className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData?.id ? "Editar Usuário" : "Novo Usuário"}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoMdClose className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Informações Básicas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo*
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: João Silva"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="joao.silva@empresa.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha{" "}
                {initialData?.id ? "(deixe em branco para manter atual)" : "*"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder={
                    initialData?.id ? "Nova senha (opcional)" : "Digite a senha"
                  }
                  required={!initialData?.id}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Permissões e Acesso
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Setor*
              </label>
              <select
                value={formData.sectorId}
                onChange={(e) =>
                  setFormData({ ...formData, sectorId: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione um setor</option>
                {sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                    {sector.description && ` - ${sector.description}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Acesso*
              </label>
              <div className="space-y-2">
                {(
                  ["COLLABORATOR", "MANAGER", "ADMIN", "IT_ADMIN"] as UserRole[]
                ).map((role) => (
                  <label
                    key={role}
                    className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as UserRole,
                        })
                      }
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {getRoleLabel(role)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getRoleDescription(role)}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700"
              >
                Usuário ativo
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Usuários inativos não podem fazer login no sistema
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {initialData?.id ? "Salvar Alterações" : "Criar Usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
