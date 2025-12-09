import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { AtividadeExternaModalData } from "../../types/interfaces";

interface AtividadeExternaModalInfoProps {
  onClose: () => void;
  evento: AtividadeExternaModalData;
  onSave?: (data: AtividadeExternaModalData) => void;
  onDelete?: (id: number) => void;
}

export const AtividadeExternaModalInfo: React.FC<
  AtividadeExternaModalInfoProps
> = ({ onClose, evento, onSave, onDelete }) => {
  const { theme } = useTheme();
  const eventoData: any = evento;
  const [formData, setFormData] = useState({
    id: eventoData.id,
    titulo: eventoData.title || eventoData.titulo || "",
    setorResponsavel: eventoData.sector?.name || eventoData.setorResponsavel || "",
  descricao: eventoData.description ?? eventoData.descricao ?? "",
    autor: eventoData.creator?.name || eventoData.autor || "",
    dataHoraSaida: eventoData.departureTime ? new Date(eventoData.departureTime) : (eventoData.dataHoraSaida ? new Date(eventoData.dataHoraSaida) : new Date()),
    dataHoraRetorno: eventoData.returnTime ? new Date(eventoData.returnTime) : (eventoData.dataHoraRetorno ? new Date(eventoData.dataHoraRetorno) : new Date()),
    destino: eventoData.destination || eventoData.destino || "",
    equipeEnvolvida: eventoData.equipeEnvolvida || [],
    status: eventoData.status || "planejada",
    meioTransporte: eventoData.transportMode || eventoData.meioTransporte || "",
    motivoAtividade: eventoData.activityReason || "",
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
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/10 flex items-center justify-center z-50 p-4">
      <section
        className={`rounded-md p-2 w-[900px] max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="relative px-6 py-3">
          <h2
            className={`text-xl font-bold leading-tight text-center ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Detalhes da Atividade Externa
          </h2>
          <IoMdClose
            onClick={onClose}
            className={`absolute top-4 right-4 text-2xl cursor-pointer transition-colors ${
              theme === "dark"
                ? "text-gray-300 hover:text-gray-100"
                : "text-gray-600 hover:text-gray-800"
            }`}
          />
          <p
            className={`mt-1 text-sm text-center mb-3 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Visualizar e editar os detalhes da atividade externa
          </p>

          <form className="w-full">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                <div>
                  <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>Título</label>
                  <input value={formData.titulo} onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))} placeholder="Título da atividade" className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"}`} />
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>Setor Responsável</label>
                  <input value={formData.setorResponsavel} onChange={(e) => setFormData((prev) => ({ ...prev, setorResponsavel: e.target.value }))} placeholder="Setor responsável" className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"}`} />
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>Destino</label>
                  <input value={formData.destino} onChange={(e) => setFormData((prev) => ({ ...prev, destino: e.target.value }))} placeholder="Destino" className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"}`} />
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as AtividadeExternaModalData["status"] }))} className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-transparent border-gray-300 text-gray-900"}`}>
                    <option value="planejada">Planejada</option>
                    <option value="em-execucao">Em Execução</option>
                    <option value="realizada">Realizada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>Meio de Transporte</label>
                  <input value={formData.meioTransporte} onChange={(e) => setFormData((prev) => ({ ...prev, meioTransporte: e.target.value }))} placeholder="Meio de transporte" className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"}`} />
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>Data/Hora de Saída</label>
                  <DatePicker selected={formData.dataHoraSaida} onChange={(date) => setFormData((prev) => ({ ...prev, dataHoraSaida: date || new Date() }))} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="dd/MM/yyyy HH:mm" className={`mt-1 flex h-9 w-67 rounded-md border px-3 py-2 text-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-transparent border-gray-300 text-gray-900"}`} placeholderText="Data/Hora de saída" />
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>Data/Hora de Retorno</label>
                  <DatePicker selected={formData.dataHoraRetorno} onChange={(date) => setFormData((prev) => ({ ...prev, dataHoraRetorno: date || new Date() }))} showTimeSelect timeFormat="HH:mm" timeIntervals={15} dateFormat="dd/MM/yyyy HH:mm" className={`mt-1 flex h-9 w-67 rounded-md border px-3 py-2 text-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-transparent border-gray-300 text-gray-900"}`} placeholderText="Data/Hora de retorno" />
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>Autor</label>
                  <input value={formData.autor} onChange={(e) => setFormData((prev) => ({ ...prev, autor: e.target.value }))} placeholder="Autor da atividade" className={`mt-1 flex h-9 w-full rounded-md border px-3 py-2 text-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 mt-2">
                <div>
                  <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>Descrição</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descrição da atividade externa"
                    className={`mt-1 w-full rounded-md border px-3 py-2 text-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"}`}
                    rows={2}
                  />
                </div>

                <div>
                  {/* Campo 'motivo da atividade' removido */}
                </div>

                <div>
                  <label className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>Equipe Envolvida</label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <input
                        value={novoMembro}
                        onChange={(e) => setNovoMembro(e.target.value)}
                        placeholder="Adicionar membro"
                        className={`flex-1 h-9 rounded-md border px-3 py-2 text-sm ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-transparent border-gray-300 text-gray-900 placeholder:text-gray-400"}`}
                      />
                      <button
                        type="button"
                        onClick={handleAddMembro}
                        className={`px-4 py-2 rounded-md text-sm text-white ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-800 hover:bg-gray-700"}`}
                      >Adicionar</button>
                    </div>
                    <div className="max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                      {formData.equipeEnvolvida.length > 0 ? (
                        formData.equipeEnvolvida.map((membro: string, index: number) => (
                          <div key={index} className={`flex items-center justify-between p-2 rounded-md mb-1 ${theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-[#eaeaea] text-gray-900"}`}>
                            <div className="flex items-center gap-2">
                              <MdGroups className={theme === "dark" ? "text-gray-400" : "text-gray-600"} />
                              <span className="text-sm">{membro}</span>
                            </div>
                            <button type="button" onClick={() => setFormData((prev) => ({ ...prev, equipeEnvolvida: prev.equipeEnvolvida.filter((_: string, i: number) => i !== index) }))} className="text-red-500 text-sm hover:text-red-700">Remover</button>
                          </div>
                        ))
                      ) : (
                        <div className={`flex items-center gap-2 p-2 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                          <span className={`text-sm italic ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Nenhum membro foi adicionado à equipe.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {onDelete && (
                  <button
                    onClick={() => onDelete(formData.id)}
                    className="h-[40px] px-4 flex items-center justify-center gap-2 rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white bg-red-600 hover:bg-red-700"
                    type="button"
                  ><FaTrash /> Excluir</button>
                )}
                <button
                  onClick={onClose}
                  className={`flex-1 h-[40px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white ${theme === "dark" ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-500 hover:bg-gray-600"}`}
                  type="button"
                >Cancelar</button>
                <button
                  onClick={handleSave}
                  className={`flex-1 h-[40px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-black hover:bg-gray-800"}`}
                  type="button"
                >Salvar Alterações</button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
