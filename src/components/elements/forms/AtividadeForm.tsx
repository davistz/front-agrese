import { useState } from "react";
import { AtividadeFormData } from "../../../types/interfaces";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { BsListTask } from "react-icons/bs";
import { useTheme } from "../../../contexts/ThemeContext";

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
    <div className="">
      <section
        className={`rounded-md py-6 flex flex-col items-center px-7 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-2xl font-bold leading-tight ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Nova Atividade
        </h2>
        <IoMdClose
          onClick={onCancel}
          className={`absolute top-4 right-4 text-2xl cursor-pointer ${
            theme === "dark"
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        />
        <p
          className={`mt-2 text-base ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Preencha os detalhes da atividade
        </p>
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`text-base font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Responsável
              </label>
              <div className="mt-2">
                <input
                  value={formData.responsavel}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      responsavel: e.target.value,
                    }))
                  }
                  placeholder="Nome do responsável"
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`text-base font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Status
              </label>
              <div className="mt-2">
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as AtividadeFormData["status"],
                    }))
                  }
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                    theme === "dark"
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`text-base font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Prioridade
              </label>
              <div className="mt-2">
                <select
                  value={formData.prioridade}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      prioridade: e.target
                        .value as AtividadeFormData["prioridade"],
                    }))
                  }
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-transparent border-gray-300 text-gray-900"
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
                className={`text-base font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Data de Conclusão Real
              </label>
              <div className="mt-2">
                <DatePicker
                  selected={formData.dataConclusaoReal}
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      dataConclusaoReal: date,
                    }))
                  }
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-transparent border-gray-300 text-gray-900"
                  }`}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecione a data"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              className={`text-base font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-900"
              }`}
            >
              Subtarefas
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <input
                  value={novaSubtarefa}
                  onChange={(e) => setNovaSubtarefa(e.target.value)}
                  placeholder="Nova subtarefa"
                  className={`flex-1 h-10 rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-transparent border-gray-300 text-gray-900"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddSubtarefa}
                  className={`px-4 py-2 rounded-md text-white ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  Adicionar
                </button>
              </div>
              <ul className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                {formData.subtarefas.map((subtarefa, index) => (
                  <li
                    key={index}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-200"
                        : "bg-[#eaeaea] text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BsListTask
                        className={
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
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
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <label
              className={`text-base font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-900"
              }`}
            >
              Comentários
            </label>
            <div className="mt-2">
              <textarea
                value={formData.comentarios}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    comentarios: e.target.value,
                  }))
                }
                placeholder="Adicione comentários ou observações"
                className={`w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-transparent border-gray-300 text-gray-900"
                }`}
                rows={4}
              />
            </div>
          </div>

          <div>
            <label
              className={`text-base font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-900"
              }`}
            >
              Anexos
            </label>
            <div className="grid w-full items-center gap-1.5 mt-2">
              <input
                id="anexos"
                type="file"
                multiple
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    anexos: Array.from(e.target.files || []),
                  }))
                }
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-400 file:text-gray-300"
                    : "bg-white border-input text-gray-400 file:text-gray-600"
                }`}
              />
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className={`w-full h-[50px] mt-6 flex items-center justify-center rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-black hover:bg-gray-800"
          }`}
          type="button"
        >
          Salvar Atividade
        </button>
      </section>
    </div>
  );
};
