import { useState } from "react";
import { SectorFormData, SectorData } from "../../../types/interfaces";
import { useTheme } from "../../../contexts/ThemeContext";
import { IoMdClose } from "react-icons/io";
import { MdGroups2 } from "react-icons/md";
import { formatDate } from "../../../utils/formatDate";

export interface SetorFormProps {
  initialData?: SectorData;
  parentSectors?: SectorData[];
  onSubmit: (data: SectorFormData) => void;
  onCancel: () => void;
}

export const SetorForm: React.FC<SetorFormProps> = ({
  initialData,
  parentSectors = [],
  onSubmit,
  onCancel,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<SectorFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    managerId: initialData?.managerId || undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name) {
      onSubmit(formData);
    }
  };

  const availableParentSectors = parentSectors.filter(
    (sector) => sector.id !== initialData?.id
  );

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/10 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } ${
          theme === "dark"
            ? "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500"
            : "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
        }`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <MdGroups2 className="w-6 h-6 text-blue-600" />
            <h2
              className={`text-xl font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {initialData ? "Editar Setor" : "Novo Setor"}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <IoMdClose className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3
              className={`text-lg font-medium border-b pb-2 ${
                theme === "dark"
                  ? "text-white border-gray-700"
                  : "text-gray-900 border-gray-200"
              }`}
            >
              Informações Básicas
            </h3>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Nome do Setor *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Ex: Recursos Humanos"
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Descrição
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                rows={3}
                placeholder="Descreva as responsabilidades e função do setor"
              />
            </div>

            {availableParentSectors.length > 0 && (
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Setor Pai (Opcional)
                </label>
                <select
                  value={formData.managerId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      managerId: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Setor principal (sem hierarquia)</option>
                  {availableParentSectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.name}
                    </option>
                  ))}
                </select>
                <p
                  className={`text-xs mt-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Selecione um setor pai se este for um subsetor
                </p>
              </div>
            )}
          </div>

          {initialData && (
            <div className="space-y-4">
              <h3
                className={`text-lg font-medium border-b pb-2 ${
                  theme === "dark"
                    ? "text-white border-gray-700"
                    : "text-gray-900 border-gray-200"
                }`}
              >
                Informações do Sistema
              </h3>

              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <div>
                  <span className="font-medium">Data de Criação:</span>
                  <br />
                  {formatDate(initialData?.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Última Atualização:</span>
                  <br />
                  {formatDate(initialData?.updatedAt)}
                </div>
                <div>
                  <span className="font-medium">Total de Usuários:</span>
                  <br />
                  {initialData.users?.length || 0} usuários
                </div>
                <div>
                  <span className="font-medium">Subsetores:</span>
                  <br />
                  {initialData.subSectors?.length || 0} subsetores
                </div>
              </div>
            </div>
          )}

          <div
            className={`flex justify-end gap-3 pt-6 border-t ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={onCancel}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-gray-300 bg-gray-700 hover:bg-gray-600"
                  : "text-gray-700 bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {initialData ? "Salvar Alterações" : "Criar Setor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
