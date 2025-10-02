import { useState, useEffect } from "react";
import { AtividadeFormData } from "../../../types/interfaces";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { BsListTask } from "react-icons/bs";
import { useTheme } from "../../../contexts/ThemeContext";
import { sectorServices } from "../../../services/sectorsServices";

interface AtividadeFormProps {
  initialData?: Partial<AtividadeFormData>;
  onSubmit: (data: AtividadeFormData) => void;
  onCancel: () => void;
}

export const AtividadeForm: React.FC<AtividadeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<AtividadeFormData>({
    titulo: initialData?.titulo || "",
    setorResponsavel: initialData?.setorResponsavel || "",
    descricao: initialData?.descricao || "",
    autor: initialData?.autor || "",
    dataInicio: initialData?.dataInicio || null,
    dataFim: initialData?.dataFim || null,

    dataInicioPrevista: initialData?.dataInicioPrevista || null,
    prazoFinal: initialData?.prazoFinal || null,
    responsavel: initialData?.responsavel || "",
    status: initialData?.status || "pendente",
    prioridade: initialData?.prioridade || "media",
    subtarefas: initialData?.subtarefas || [],
    comentarios: initialData?.comentarios || "",
    dataConclusaoReal: initialData?.dataConclusaoReal || null,
  });

  const [novaSubtarefa, setNovaSubtarefa] = useState("");
  const [setores, setSetores] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const data = await sectorServices.getSectors();
        if (Array.isArray(data)) {
          setSetores(data.map((s: any) => ({ id: s.id, name: s.name })));
        }
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
        setSetores([]);
      }
    };
    fetchSectors();
  }, []);

  const handleAddSubtarefa = () => {
    if (novaSubtarefa.trim()) {
      setFormData((prev) => ({
        ...prev,
        subtarefas: [...prev.subtarefas, novaSubtarefa.trim()],
      }));
      setNovaSubtarefa("");
    }
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <section
        className={`rounded-md py-6 flex flex-col items-center px-7 ${theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
      >
        <h2
          className={`text-2xl font-bold leading-tight ${theme === "dark" ? "text-white" : "text-gray-900"
            }`}
        >
          Nova Atividade
        </h2>
        <IoMdClose
          onClick={onCancel}
          className={`absolute top-4 right-4 text-2xl cursor-pointer ${theme === "dark"
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
            }`}
        />
        <p
          className={`mt-2 text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
        >
          Preencha os detalhes da atividade
        </p>

        <form className="w-full max-w-4xl space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-900"
                  }`}
              >
                Título da Atividade *
              </label>
              <input
                value={formData.titulo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    titulo: e.target.value,
                  }))
                }
                placeholder="Título da atividade"
                className={`w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-900"
                  }`}
              >
                Setor Responsável *
              </label>
              <select
                value={formData.setorResponsavel}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    setorResponsavel: e.target.value,
                  }));
                }}
                className={`w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                required
              >
                <option value="" disabled>Selecione um setor</option>
                {setores.map((setor) => (
                  <option key={setor.id} value={setor.id}>{setor.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-900"
                }`}
            >
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  descricao: e.target.value,
                }))
              }
              placeholder="Descrição da atividade"
              className={`w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
                }`}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-900"
                  }`}
              >
                Data de Início *
              </label>
              <DatePicker
                selected={formData.dataInicio}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataInicio: date,
                  }))
                }
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                className={`w-[400px] h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                  }`}
                placeholderText="Selecione a data de início"
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-900"
                  }`}
              >
                Data de Fim *
              </label>
              <DatePicker
                selected={formData.dataFim}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataFim: date,
                  }))
                }
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                className={`w-[400px] h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                  }`}
                placeholderText="Selecione a data de fim"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-900"
                  }`}
              >
                Responsável
              </label>
              <input
                value={formData.responsavel}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    responsavel: e.target.value,
                  }))
                }
                placeholder="Nome do responsável"
                className={`w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-900"
                  }`}
              >
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as AtividadeFormData["status"],
                  }))
                }
                className={`w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                  }`}
              >
                <option value="pendente">Pendente</option>
                <option value="em-andamento">Em Andamento</option>
                <option value="concluida">Concluída</option>
                <option value="atrasada">Atrasada</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-900"
                  }`}
              >
                Prioridade
              </label>
              <select
                value={formData.prioridade}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    prioridade: e.target
                      .value as AtividadeFormData["prioridade"],
                  }))
                }
                className={`w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                  }`}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-900"
                }`}
            >
              Subtarefas
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={novaSubtarefa}
                  onChange={(e) => setNovaSubtarefa(e.target.value)}
                  placeholder="Nova subtarefa"
                  className={`flex-1 h-10 rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                    }`}
                />
                <button
                  type="button"
                  onClick={handleAddSubtarefa}
                  className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  Adicionar
                </button>
              </div>
              {formData.subtarefas.length > 0 && (
                <ul className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                  {formData.subtarefas.map((subtarefa, index) => (
                    <li
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-md ${theme === "dark"
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-50 text-gray-900"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <BsListTask
                          className={
                            theme === "dark" ? "text-blue-400" : "text-blue-600"
                          }
                        />
                        <span className="text-sm">{subtarefa}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            subtarefas: prev.subtarefas.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                        className="text-red-500 text-sm hover:text-red-700 px-2 py-1 rounded transition-colors"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 h-12 rounded-lg font-medium transition-all duration-200 ${theme === "dark"
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onSubmit(formData);
              }}
              className="flex-1 h-12 rounded-lg font-medium text-white transition-all duration-200 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              Salvar Atividade
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
