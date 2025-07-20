import { useState } from "react";
import { AtividadeFormData } from "../../../types/interfaces";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { BsListTask } from "react-icons/bs";

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
    anexos: initialData?.anexos || [],
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
      <section className="rounded-md py-6 flex flex-col items-center px-7 bg-white">
        <h2 className="text-2xl font-bold leading-tight">Nova Atividade</h2>
        <IoMdClose
          onClick={onCancel}
          className="absolute top-4 right-4 text-2xl cursor-pointer"
        />
        <p className="mt-2 text-base text-gray-600">
          Preencha os detalhes da reunião
        </p>
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-base font-medium text-gray-900">
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
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                />
              </div>
            </div>

            <div>
              <label className="text-base font-medium text-gray-900">
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
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
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
              <label className="text-base font-medium text-gray-900">
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
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-base font-medium text-gray-900">
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
                  className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecione a data"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-base font-medium text-gray-900">
              Subtarefas
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <input
                  value={novaSubtarefa}
                  onChange={(e) => setNovaSubtarefa(e.target.value)}
                  placeholder="Nova subtarefa"
                  className="flex-1 h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddSubtarefa}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                >
                  Adicionar
                </button>
              </div>
              <ul className="space-y-2">
                {formData.subtarefas.map((subtarefa, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 bg-[#eaeaea] rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <BsListTask className="text-gray-600" />
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
            <label className="text-base font-medium text-gray-900">
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
                className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                rows={4}
              />
            </div>
          </div>

          <div>
            <label className="text-base font-medium text-gray-900">
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
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
              />
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className="w-full bg-black h-[50px] mt-6 flex items-center justify-center rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white"
          type="button"
        >
          Salvar Atividade
        </button>
      </section>
    </div>
  );
};
