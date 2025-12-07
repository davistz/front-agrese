import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { FaUserCircle, FaTrash } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { ReuniaoModalData } from "../../types/interfaces";

interface ReuniaoModalInfoProps {
  onClose: () => void;
  evento: any;
  onSave?: (data: ReuniaoModalData) => void;
  onDelete?: (id: number) => void;
}

export const ReuniaoModalInfo: React.FC<ReuniaoModalInfoProps> = ({
  onClose,
  evento,
  onSave,
  onDelete,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<ReuniaoModalData>({
    id: evento.id,
    titulo: evento.titulo || "",
    setorResponsavel: evento.setorResponsavel || "",
    descricao: evento.descricao || "",
    autor: evento.autor || "",
    dataHoraInicio: evento.dataHoraInicio || new Date(),
    dataHoraTermino: evento.dataHoraTermino || new Date(),
    local: evento.local || "presencial",
    sala: evento.sala || "",
    participantes: evento.participantes || [],
    status: evento?.status,
    responsavelAta: evento.responsavelAta || "",
    linkReuniao: evento.linkReuniao || "",
    notificacao: evento.notificacao || 30,
  });
  console.log("Evento recebido no modal:", evento);

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/10 flex items-center justify-center z-50 p-4">
      <section
        className={`rounded-md p-2 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-center my-3">
          <div className="xl:mx-auto flex flex-col items-center p-4 xl:w-full xl:max-w-sm 2xl:max-w-md">
            <div className="relative w-full">
              <h2
                className={`text-2xl font-bold leading-tight text-center ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Detalhes da Reunião
              </h2>
              <IoMdClose
                onClick={onClose}
                className={`absolute top-0 right-0 text-2xl cursor-pointer transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-gray-100"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              />
            </div>
            <p
              className={`mt-2 text-base text-center ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Visualizar e editar os detalhes da reunião
            </p>

            <form className="mt-5 w-full">
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      className={`text-base font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Título da Reunião
                    </label>
                    <div className="mt-2">
                      <input
                        value={formData.titulo}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            titulo: e.target.value,
                          }))
                        }
                        placeholder="Título da Reunião"
                        type="text"
                        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-400"
                            : "bg-transparent border-gray-300 text-gray-900 focus:ring-gray-400"
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
                      Setor Responsável
                    </label>
                    <div className="mt-2">
                      <input
                        value={formData.setorResponsavel}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            setorResponsavel: e.target.value,
                          }))
                        }
                        placeholder="Setor Responsável"
                        type="text"
                        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-400"
                            : "bg-transparent border-gray-300 text-gray-900 focus:ring-gray-400"
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
                    Descrição
                  </label>
                  <div className="mt-2">
                    <input
                      value={formData.descricao}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          descricao: e.target.value,
                        }))
                      }
                      placeholder="Descrição da reunião"
                      type="text"
                      className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-400"
                          : "bg-transparent border-gray-300 text-gray-900 focus:ring-gray-400"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      className={`text-base font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Local
                    </label>
                    <select
                      value={formData.local}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          local: e.target.value as "presencial" | "virtual",
                        }))
                      }
                      className={`mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-transparent border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="presencial">Presencial</option>
                      <option value="virtual">Virtual</option>
                    </select>
                  </div>
                </div>

                {formData.local === "presencial" && (
                  <div>
                    <label
                      className={`text-base font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Sala de Reunião
                    </label>
                    <div className="mt-2">
                      <select
                        value={formData.sala || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            sala: e.target.value,
                          }))
                        }
                        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-transparent border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="">Selecione uma sala</option>
                        <option value="auditorio">🎭 Auditório</option>
                        <option value="sala-reuniao">🏢 Sala de Reunião</option>
                        <option value="sala-multiuso">🎯 Sala Multiuso</option>
                      </select>
                    </div>
                    {formData.sala && (
                      <div
                        className={`mt-2 p-3 rounded-lg ${
                          theme === "dark" ? "bg-gray-700" : "bg-blue-50"
                        }`}
                      >
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-blue-800"
                          }`}
                        >
                          📍 Local selecionado:{" "}
                          {formData.sala === "auditorio"
                            ? "Auditório"
                            : formData.sala === "sala-reuniao"
                            ? "Sala de Reunião"
                            : formData.sala === "sala-multiuso"
                            ? "Sala Multiuso"
                            : ""}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            theme === "dark" ? "text-gray-400" : "text-blue-600"
                          }`}
                        >
                          {formData.sala === "auditorio" &&
                            "Capacidade: até 100 pessoas | Equipamentos: projetor, som, microfone"}
                          {formData.sala === "sala-reuniao" &&
                            "Capacidade: até 20 pessoas | Equipamentos: TV, quadro branco"}
                          {formData.sala === "sala-multiuso" &&
                            "Capacidade: até 50 pessoas | Equipamentos: flexível conforme necessidade"}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      className={`text-base font-medium ${
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
                                                  status: e.target.value
                                                }))
                      }
                      className={`mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-transparent border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="PENDING">Agendada</option>
                      <option value="IN_PROGRESS">Em andamento</option>
                      <option value="COMPLETED">Realizada</option>
                      <option value="CANCELLED">Cancelada</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      className={`text-base font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Data/Hora Início
                    </label>
                    <DatePicker
                      selected={formData.dataHoraInicio}
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          dataHoraInicio: date || new Date(),
                        }))
                      }
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy HH:mm"
                      className={`mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-transparent border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      className={`text-base font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Data/Hora Término
                    </label>
                    <DatePicker
                      selected={formData.dataHoraTermino}
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          dataHoraTermino: date || new Date(),
                        }))
                      }
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy HH:mm"
                      className={`mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-transparent border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`text-base font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Autor
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
                        placeholder="Autor da reunião"
                        type="text"
                        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-400"
                            : "bg-transparent border-gray-300 text-gray-900 focus:ring-gray-400"
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
                      Responsável da Ata
                    </label>
                    <div className="mt-2">
                      <input
                        value={formData.responsavelAta}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            responsavelAta: e.target.value,
                          }))
                        }
                        placeholder="Responsável pela ata"
                        type="text"
                        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-400"
                            : "bg-transparent border-gray-300 text-gray-900 focus:ring-gray-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {formData.local === "virtual" && (
                  <div>
                    <label
                      className={`text-base font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Link da Reunião
                    </label>
                    <input
                      value={formData.linkReuniao}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          linkReuniao: e.target.value,
                        }))
                      }
                      placeholder="Link da reunião virtual"
                      type="url"
                      className={`mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-transparent border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                )}

                <div>
                  <label
                    className={`text-base font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Participantes
                  </label>
                  <div className="mt-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                    {formData.participantes.length > 0 ? (
                      formData.participantes.map((participante, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 p-2 rounded-md mb-1 ${
                            theme === "dark"
                              ? "bg-gray-700 text-gray-200"
                              : "bg-[#eaeaea] text-gray-900"
                          }`}
                        >
                          <FaUserCircle
                            className={
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }
                          />
                          <span className="text-[15px]">{participante}</span>
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
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Não foi adicionado participantes a essa reunião.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {onDelete && (
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
                    className={`flex-1 h-[50px] mt-4 flex items-center justify-center rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white ${
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
                    className={`flex-1 h-[50px] mt-4 flex items-center justify-center rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white ${
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
        </div>
      </section>
    </div>
  );
};
