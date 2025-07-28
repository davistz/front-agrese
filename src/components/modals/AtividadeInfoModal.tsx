import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { BsListTask } from "react-icons/bs";
import { AtividadeModalData } from "../../types/interfaces";

interface AtividadeModalInfoProps {
  onClose: () => void;
  evento: AtividadeModalData;
  onSave?: (data: AtividadeModalData) => void;
}

export const AtividadeModalInfo: React.FC<AtividadeModalInfoProps> = ({
  onClose,
  evento,
  onSave,
}) => {
  const [formData, setFormData] = useState<AtividadeModalData>({
    id: evento.id,
    titulo: evento.titulo || "",
    setorResponsavel: evento.setorResponsavel || "",
    descricao: evento.descricao || "",
    autor: evento.autor || "",
    dataInicioPrevista: evento.dataInicioPrevista || new Date(),
    prazoFinal: evento.prazoFinal || new Date(),
    responsavel: evento.responsavel || "",
    status: evento.status || "pendente",
    prioridade: evento.prioridade || "media",
    subtarefas: evento.subtarefas || [],
    comentarios: evento.comentarios || "",
    dataConclusaoReal: evento.dataConclusaoReal || null,
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

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="">
      <section className="rounded-md w-120 bg-white">
        <div className="flex items-center justify-center my-3">
          <div className="xl:mx-auto flex flex-col items-center p-4 xl:w-full xl:max-w-sm 2xl:max-w-md">
            <div className="relative w-full">
              <h2 className="text-2xl font-bold leading-tight text-center">
                Detalhes da Atividade
              </h2>
              <IoMdClose
                onClick={onClose}
                className="absolute top-0 right-0 text-2xl cursor-pointer hover:text-gray-600 transition-colors"
              />
            </div>
            <p className="mt-2 text-base text-gray-600 text-center">
              Visualizar e editar os detalhes da atividade
            </p>

            <form className="mt-5 w-full">
              <div className="space-y-3">
                <div className="flex gap-4"></div>

                <div className="flex gap-4">
                  <div className="flex-1">
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

                  <div className="flex-1">
                    <label className="text-base font-medium text-gray-900">
                      Status
                    </label>
                    <div className="mt-2">
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: e.target
                              .value as AtividadeModalData["status"],
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

                <div className="flex gap-4">
                  <div className="flex-1">
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
                              .value as AtividadeModalData["prioridade"],
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

                  <div className="flex-1">
                    <label className="text-base font-medium text-gray-900">
                      Criador da Atividade
                    </label>
                    <div className="mt-2">
                      <input
                        value={formData.autor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            autor: e.target.value,
                          }))
                        }
                        placeholder="Autor da atividade"
                        type="text"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
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
                    <div className="max-h-32 overflow-y-auto">
                      {formData.subtarefas.length > 0 ? (
                        formData.subtarefas.map((subtarefa, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-[#eaeaea] rounded-md mb-1"
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
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                          <span className="text-[15px] text-gray-500 italic">
                            Nenhuma subtarefa foi adicionada a esta atividade.
                          </span>
                        </div>
                      )}
                    </div>
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
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-500 h-[50px] mt-4 flex items-center justify-center rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white"
                    type="button"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-black h-[50px] mt-4 flex items-center justify-center rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white"
                    type="button"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
