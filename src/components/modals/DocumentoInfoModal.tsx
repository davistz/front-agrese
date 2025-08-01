import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { HiDocumentText } from "react-icons/hi";
import { useTheme } from "../../contexts/ThemeContext";
import { DocumentoModalData } from "../../types/interfaces";

interface DocumentoModalInfoProps {
  onClose: () => void;
  evento: DocumentoModalData;
  onSave?: (data: DocumentoModalData) => void;
}

export const DocumentoModalInfo: React.FC<DocumentoModalInfoProps> = ({
  onClose,
  evento,
  onSave,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<DocumentoModalData>({
    id: evento.id,
    titulo: evento.titulo || "",
    setorResponsavel: evento.setorResponsavel || "",
    descricao: evento.descricao || "",
    autor: evento.autor || "",
    tipoDocumento: evento.tipoDocumento || "",
    status: evento.status || "pendente",
    responsavel: evento.responsavel || "",
    dataCriacao: evento.dataCriacao || new Date(),
    prazoAnalise: evento.prazoAnalise || new Date(),
    dataEnvioRecebimento: evento.dataEnvioRecebimento || null,
    observacoes: evento.observacoes || "",
  });

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/10 flex items-center justify-center z-50 p-4">
      <section
        className={`rounded-md p-2 w-[900px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="relative px-6 py-3">
          <h2
            className={`text-xl font-bold leading-tight text-center ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Detalhes do Documento
          </h2>
          <IoMdClose
            onClick={onClose}
            className={`absolute top-4 right-4 text-2xl cursor-pointer ${
              theme === "dark"
                ? "text-gray-300 hover:text-gray-100"
                : "text-gray-600 hover:text-gray-800"
            }`}
          />
          <p
            className={`mt-1 text-sm text-center mb-4 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Visualizar e editar os detalhes do documento
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
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"
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
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"
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
                        : "bg-transparent border-gray-300 text-gray-900"
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
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"
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
                        status: e.target.value as DocumentoModalData["status"],
                      }))
                    }
                    className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-transparent border-gray-300 text-gray-900"
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
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-transparent border-gray-300 text-gray-900"
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
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-transparent border-gray-300 text-gray-900"
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
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-transparent border-gray-300 text-gray-900"
                    }`}
                    placeholderText="Data de criação"
                  />
                </div>

                <div>
                  <label
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Autor
                  </label>
                  <input
                    value={formData.autor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        autor: e.target.value,
                      }))
                    }
                    placeholder="Autor do documento"
                    className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"
                    }`}
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
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"
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
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"
                    }`}
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className={`flex-1 h-[40px] mt-2 flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white ${
                    theme === "dark"
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-500 hover:bg-gray-600"
                  }`}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className={`flex-1 h-[40px] mt-2 flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-black hover:bg-gray-800"
                  }`}
                  type="button"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
