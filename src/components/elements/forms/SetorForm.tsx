import { useState } from "react";
import { SectorFormData, SectorData } from "../../../types/interfaces";
import { IoMdClose } from "react-icons/io";
import { MdGroups2 } from "react-icons/md";

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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MdGroups2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData ? "Editar Setor" : "Novo Setor"}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Setor *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Recursos Humanos"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Descreva as responsabilidades e função do setor"
              />
            </div>

            {availableParentSectors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Setor principal (sem hierarquia)</option>
                  {availableParentSectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Selecione um setor pai se este for um subsetor
                </p>
              </div>
            )}
          </div>

          {initialData && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Informações do Sistema
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Data de Criação:</span>
                  <br />
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(initialData.createdAt))}
                </div>
                <div>
                  <span className="font-medium">Última Atualização:</span>
                  <br />
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(initialData.updatedAt))}
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
              {initialData ? "Salvar Alterações" : "Criar Setor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
