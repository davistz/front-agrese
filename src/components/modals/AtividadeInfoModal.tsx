import React, { useState, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { IoMdClose } from "react-icons/io";
import { BsListTask } from "react-icons/bs";
import { FaTrash, FaLock } from "react-icons/fa";
import { AtividadeModalData } from "../../types/interfaces";

interface AtividadeModalInfoProps {
  onClose: () => void;
  evento: AtividadeModalData;
  onSave?: (data: AtividadeModalData) => void;
  onDelete?: (id: number) => void;
}

export const AtividadeModalInfo: React.FC<AtividadeModalInfoProps> = ({
  onClose,
  evento,
  onSave,
  onDelete,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  // Verificar se o usuário pode editar/excluir
  // Apenas o criador ou ADMIN podem editar/excluir
  const canEditOrDelete = useMemo(() => {
    if (!user) return false;
    if (user.role === "ADMIN") return true;
    
    // Verificar se é o criador
    const isCreator = 
      evento.autor === user.name || 
      (evento as any).autorId === user.id || 
      (evento as any).createdById === user.id ||
      (evento as any).createdBy?.id === user.id;
    
    return isCreator;
  }, [user, evento]);
  
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
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/10 flex items-center justify-center p-4 z-50">
      <section
        className={`rounded-md w-120 max-w-4xl max-h-[90vh] overflow-y-auto scrollbar scrollbar-track-transparent ${
          theme === "dark"
            ? "bg-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
            : "bg-white scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
        } scrollbar-thumb-rounded-full scrollbar-w-2`}
      >
        <div className="flex items-center justify-center my-3">
          <div className="xl:mx-auto flex flex-col items-center p-4 xl:w-full xl:max-w-sm 2xl:max-w-md">
            <div className="relative w-full">
              <h2
                className={`text-2xl font-bold leading-tight text-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Detalhes da Atividade
              </h2>
              <IoMdClose
                onClick={onClose}
                className={`absolute top-0 right-0 text-2xl cursor-pointer transition-colors ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              />
            </div>
            <p
              className={`mt-2 text-base text-center ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Visualizar e editar os detalhes da atividade
            </p>

            <form className="mt-5 w-full">
              <div className="space-y-3">
                <div className="flex gap-4"></div>

                <div className="flex gap-4">
                  <div className="flex-1">
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
                        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-gray-500"
                            : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-gray-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex-1">
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
                            status: e.target
                              .value as AtividadeModalData["status"],
                          }))
                        }
                        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-transparent border-gray-300 text-gray-900"
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

                <div className="flex gap-4">
                  <div className="flex-1">
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
                              .value as AtividadeModalData["prioridade"],
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

                  <div className="flex-1">
                    <label
                      className={`text-base font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
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
                        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-gray-500"
                            : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-gray-400"
                        }`}
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
                        className={`flex-1 h-10 rounded-md border px-3 py-2 text-sm ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                            : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleAddSubtarefa}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          theme === "dark"
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-gray-800 text-white hover:bg-gray-700"
                        }`}
                      >
                        Adicionar
                      </button>
                    </div>
                    <div
                      className={`max-h-32 overflow-y-auto scrollbar scrollbar-track-transparent ${
                        theme === "dark"
                          ? "scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
                          : "scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
                      } scrollbar-thumb-rounded-full scrollbar-w-2`}
                    >
                      {formData.subtarefas.length > 0 ? (
                        formData.subtarefas.map((subtarefa, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-2 rounded-md mb-1 ${
                              theme === "dark" ? "bg-gray-700" : "bg-[#eaeaea]"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <BsListTask
                                className={
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }
                              />
                              <span
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {subtarefa}
                              </span>
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
                        <div
                          className={`flex items-center gap-2 p-2 rounded-md ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                          }`}
                        >
                          <span
                            className={`text-[15px] italic ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            Nenhuma subtarefa foi adicionada a esta atividade.
                          </span>
                        </div>
                      )}
                    </div>
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
                      className={`w-full rounded-md border px-3 py-2 text-sm ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                          : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"
                      }`}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {onDelete && canEditOrDelete && (
                    <button
                      onClick={() => onDelete(formData.id)}
                      className="h-[50px] mt-4 px-4 flex items-center justify-center gap-2 rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white bg-red-600 hover:bg-red-700"
                      type="button"
                    >
                      <FaTrash /> Excluir
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className={`flex-1 h-[50px] mt-4 flex items-center justify-center rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 ${
                      theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-500 text-white"
                        : "bg-gray-500 hover:bg-gray-600 text-white"
                    }`}
                    type="button"
                  >
                    {canEditOrDelete ? "Cancelar" : "Fechar"}
                  </button>
                  {canEditOrDelete ? (
                    <button
                      onClick={handleSave}
                      className={`flex-1 h-[50px] mt-4 flex items-center justify-center rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white ${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-black hover:bg-gray-800"
                      }`}
                      type="button"
                    >
                      Salvar Alterações
                    </button>
                  ) : (
                    <div
                      className={`flex-1 h-[50px] mt-4 flex items-center justify-center gap-2 rounded-2xl text-gray-400 ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <FaLock className="text-sm" />
                      <span className="text-sm">Somente leitura</span>
                    </div>
                  )}
                </div>
                
                {!canEditOrDelete && (
                  <p className={`text-xs text-center mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    Apenas o criador ou administradores podem editar este evento
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
