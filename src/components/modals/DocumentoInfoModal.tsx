import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { HiDocumentText } from "react-icons/hi";
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
    arquivo: evento.arquivo || null,
    observacoes: evento.observacoes || "",
  });

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="">
      <section className="rounded-md p-2 bg-white w-[900px]">
        <div className="relative px-6 py-3">
          <h2 className="text-xl font-bold leading-tight text-center">
            Detalhes do Documento
          </h2>
          <IoMdClose
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl cursor-pointer"
          />
          <p className="mt-1 text-sm text-gray-600 text-center mb-4">
            Visualizar e editar os detalhes do documento
          </p>

          <form className="w-full">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-900">
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
                    className="mt-1 flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
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
                    className="mt-1 flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
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
                    className="mt-1 flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
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
                  <label className="text-sm font-medium text-gray-900">
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
                    className="mt-1 flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
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
                    className="mt-1 flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em-analise">Em Análise</option>
                    <option value="assinado">Assinado</option>
                    <option value="enviado">Enviado</option>
                    <option value="arquivado">Arquivado</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
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
                    className="mt-1 flex h-9 w-67 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholderText="Data de envio/recebimento"
                    isClearable
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
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
                    className="mt-1 flex h-9 w-67 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholderText="Prazo para análise"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
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
                    className="mt-1 flex h-9 w-67 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholderText="Data de criação"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
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
                    className="mt-1 flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-3">
                <div>
                  <label className="text-sm font-medium text-gray-900">
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
                    className="mt-1 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Arquivo do Documento
                  </label>
                  <div className="mt-1">
                    {formData.arquivo ? (
                      <div className="flex items-center gap-2 p-2 bg-[#eaeaea] rounded-md mb-2">
                        <HiDocumentText className="text-blue-600" />
                        <span className="text-sm">{formData.arquivo.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              arquivo: null,
                            }))
                          }
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Remover
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md mb-2">
                        <span className="text-[15px] text-gray-500 italic">
                          Nenhum arquivo foi anexado a este documento.
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          arquivo: e.target.files?.[0] || null,
                        }))
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
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
                    className="mt-1 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-500 h-[40px] mt-2 flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white"
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-black h-[40px] mt-2 flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white"
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
