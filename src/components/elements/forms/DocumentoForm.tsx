import { useState } from "react";
import { DocumentoFormData } from "../../../types/interfaces";
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "../../../contexts/ThemeContext";

interface DocumentoFormProps {
  initialData?: Partial<DocumentoFormData>;
  onSubmit: (data: DocumentoFormData) => void;
  onCancel: () => void;
}

export const DocumentoForm: React.FC<DocumentoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<DocumentoFormData>({
    titulo: initialData?.titulo || "",
    setorResponsavel: initialData?.setorResponsavel || "",
    descricao: initialData?.descricao || "",
    autor: initialData?.autor || "",
    tipoDocumento: initialData?.tipoDocumento || "",
    status: initialData?.status || "pendente",
    responsavel: initialData?.responsavel || "",
    dataCriacao: initialData?.dataCriacao || new Date(),
    prazoAnalise: initialData?.prazoAnalise || new Date(),
    dataEnvioRecebimento: initialData?.dataEnvioRecebimento || null,
    observacoes: initialData?.observacoes || "",
  });

  return (
    <div className="">
      <section
        className={`rounded-md p-2 w-[900px] ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="relative px-6 py-3">
          <h2
            className={`text-xl font-bold leading-tight text-center ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Novo Documento
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
            className={`mt-1 text-sm text-center mb-4 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Preencha os detalhes do documento
          </p>

          <form className="w-full">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Título do Documento
                  </label>
                  <input
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        titulo: e.target.value,
                      }))
                    }
                    placeholder="Título do documento"
                    className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Setor de Origem
                  </label>
                  <input
                    value={formData.setorResponsavel}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        setorResponsavel: e.target.value,
                      }))
                    }
                    placeholder="Setor de origem"
                    className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Tipo de Documento
                  </label>
                  <select
                    value={formData.tipoDocumento}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tipoDocumento: e.target.value,
                      }))
                    }
                    className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="oficio">Ofício</option>
                    <option value="relatorio">Relatório</option>
                    <option value="memorando">Memorando</option>
                    <option value="parecer">Parecer</option>
                    <option value="portaria">Portaria</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
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
                    className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as DocumentoFormData["status"],
                      }))
                    }
                    className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em-analise">Em Análise</option>
                    <option value="assinado">Assinado</option>
                    <option value="enviado">Enviado</option>
                    <option value="arquivado">Arquivado</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Data de Envio/Recebimento
                  </label>
                  <DatePicker
                    selected={formData.dataEnvioRecebimento}
                    onChange={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        dataEnvioRecebimento: date,
                      }))
                    }
                    dateFormat="dd/MM/yyyy"
                    className={`mt-1 flex h-9 w-67 rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholderText="Data de envio/recebimento"
                    isClearable
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Prazo para Análise
                  </label>
                  <DatePicker
                    selected={formData.prazoAnalise}
                    onChange={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        prazoAnalise: date || new Date(),
                      }))
                    }
                    dateFormat="dd/MM/yyyy"
                    className={`mt-1 flex h-9 w-67 rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholderText="Prazo para análise"
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Data de Criação
                  </label>
                  <DatePicker
                    selected={formData.dataCriacao}
                    onChange={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        dataCriacao: date || new Date(),
                      }))
                    }
                    dateFormat="dd/MM/yyyy"
                    className={`mt-1 flex h-9 w-67 rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholderText="Data de criação"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-3">
                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
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
                    placeholder="Finalidade ou tipo do documento"
                    className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    rows={2}
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Arquivo do Documento
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        arquivo: e.target.files?.[0] || null,
                      }))
                    }
                    className={`mt-1 flex h-9 w-full rounded-md border px-3 py-1 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-400 file:text-gray-300"
                        : "bg-white border-gray-300 text-gray-400 file:text-gray-600"
                    }`}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Observações
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        observacoes: e.target.value,
                      }))
                    }
                    placeholder="Observações adicionais"
                    className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className={`flex-1 h-12 rounded-lg font-medium transition-all duration-200 ${
                    theme === "dark"
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
                  Salvar Documento
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
