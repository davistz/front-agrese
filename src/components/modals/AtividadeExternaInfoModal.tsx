import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { AtividadeExternaModalData } from "../../types/interfaces";

interface AtividadeExternaModalInfoProps {
  onClose: () => void;
  evento: AtividadeExternaModalData;
  onSave?: (data: AtividadeExternaModalData) => void;
}

export const AtividadeExternaModalInfo: React.FC<
  AtividadeExternaModalInfoProps
> = ({ onClose, evento, onSave }) => {
  const [formData, setFormData] = useState<AtividadeExternaModalData>({
    id: evento.id,
    titulo: evento.titulo || "",
    setorResponsavel: evento.setorResponsavel || "",
    descricao: evento.descricao || "",
    autor: evento.autor || "",
    dataHoraSaida: evento.dataHoraSaida || new Date(),
    dataHoraRetorno: evento.dataHoraRetorno || new Date(),
    destino: evento.destino || "",
    responsavel: evento.responsavel || "",
    equipeEnvolvida: evento.equipeEnvolvida || [],
    status: evento.status || "planejada",
    motivoAtividade: evento.motivoAtividade || "",
    meioTransporte: evento.meioTransporte || "",
  });

  const [novoMembro, setNovoMembro] = useState("");

  const handleAddMembro = () => {
    if (novoMembro.trim()) {
      setFormData((prev) => ({
        ...prev,
        equipeEnvolvida: [...prev.equipeEnvolvida, novoMembro.trim()],
      }));
      setNovoMembro("");
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
      <section className="rounded-md p-2 bg-white w-[900px] max-h-[85vh] overflow-y-auto">
        <div className="relative px-6 py-3">
          <h2 className="text-xl font-bold leading-tight text-center">
            Detalhes da Atividade Externa
          </h2>
          <IoMdClose
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl cursor-pointer hover:text-gray-600 transition-colors"
          />
          <p className="mt-1 text-sm text-gray-600 text-center mb-3">
            Visualizar e editar os detalhes da atividade externa
          </p>

          <form className="w-full">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Título
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
                    className="mt-1 flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Setor Responsável
                  </label>
                  <input
                    value={formData.setorResponsavel}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        setorResponsavel: e.target.value,
                      }))
                    }
                    placeholder="Setor responsável"
                    className="mt-1 flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Destino
                  </label>
                  <input
                    value={formData.destino}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        destino: e.target.value,
                      }))
                    }
                    placeholder="Local da atividade"
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
                        status: e.target
                          .value as AtividadeExternaModalData["status"],
                      }))
                    }
                    className="mt-1 flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="planejada">Planejada</option>
                    <option value="em-execucao">Em Execução</option>
                    <option value="realizada">Realizada</option>
                    <option value="cancelada">Cancelada</option>
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
                    Meio de Transporte
                  </label>
                  <input
                    value={formData.meioTransporte}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meioTransporte: e.target.value,
                      }))
                    }
                    placeholder="Meio de transporte"
                    className="mt-1 flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Data/Hora de Saída
                  </label>
                  <DatePicker
                    selected={formData.dataHoraSaida}
                    onChange={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        dataHoraSaida: date || new Date(),
                      }))
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    className="mt-1 flex h-9 w-67 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholderText="Data/Hora de saída"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Data/Hora de Retorno
                  </label>
                  <DatePicker
                    selected={formData.dataHoraRetorno}
                    onChange={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        dataHoraRetorno: date || new Date(),
                      }))
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    className="mt-1 flex h-9 w-67 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholderText="Data/Hora de retorno"
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
                    placeholder="Autor da atividade"
                    className="mt-1 flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 mt-2">
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
                    placeholder="Descrição da atividade externa"
                    className="mt-1 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Motivo da Atividade
                  </label>
                  <textarea
                    value={formData.motivoAtividade}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        motivoAtividade: e.target.value,
                      }))
                    }
                    placeholder="Descreva o motivo da atividade externa"
                    className="mt-1 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Equipe Envolvida
                  </label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <input
                        value={novoMembro}
                        onChange={(e) => setNovoMembro(e.target.value)}
                        placeholder="Adicionar membro"
                        className="flex-1 h-9 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddMembro}
                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-sm"
                      >
                        Adicionar
                      </button>
                    </div>
                    <div className="max-h-24 overflow-y-auto">
                      {formData.equipeEnvolvida.length > 0 ? (
                        formData.equipeEnvolvida.map((membro, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-[#eaeaea] rounded-md mb-1"
                          >
                            <div className="flex items-center gap-2">
                              <MdGroups className="text-gray-600" />
                              <span className="text-sm">{membro}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  equipeEnvolvida: prev.equipeEnvolvida.filter(
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
                          <span className="text-sm text-gray-500 italic">
                            Nenhum membro foi adicionado à equipe.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-500 h-[40px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white"
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-black h-[40px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white"
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
