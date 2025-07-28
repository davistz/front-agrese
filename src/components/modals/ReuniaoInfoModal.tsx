import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { ReuniaoModalData } from "../../types/interfaces";

interface ReuniaoModalInfoProps {
  onClose: () => void;
  evento: ReuniaoModalData;
  onSave?: (data: ReuniaoModalData) => void;
}

export const ReuniaoModalInfo: React.FC<ReuniaoModalInfoProps> = ({
  onClose,
  evento,
  onSave,
}) => {
  const [formData, setFormData] = useState<ReuniaoModalData>({
    id: evento.id,
    titulo: evento.titulo || "",
    setorResponsavel: evento.setorResponsavel || "",
    descricao: evento.descricao || "",
    autor: evento.autor || "",
    dataHoraInicio: evento.dataHoraInicio || new Date(),
    dataHoraTermino: evento.dataHoraTermino || new Date(),
    local: evento.local || "presencial",
    participantes: evento.participantes || [],
    status: evento.status || "agendada",
    responsavelAta: evento.responsavelAta || "",
    linkReuniao: evento.linkReuniao || "",
    notificacao: evento.notificacao || 30,
  });

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="">
      <section className="rounded-md p-2 bg-white">
        <div className="flex items-center justify-center my-3">
          <div className="xl:mx-auto flex flex-col items-center p-4 xl:w-full xl:max-w-sm 2xl:max-w-md">
            <div className="relative w-full">
              <h2 className="text-2xl font-bold leading-tight text-center">
                Detalhes da Reunião
              </h2>
              <IoMdClose
                onClick={onClose}
                className="absolute top-0 right-0 text-2xl cursor-pointer hover:text-gray-600 transition-colors"
              />
            </div>
            <p className="mt-2 text-base text-gray-600 text-center">
              Visualizar e editar os detalhes da reunião
            </p>

            <form className="mt-5 w-full">
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-base font-medium text-gray-900">
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
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="text-base font-medium text-gray-900">
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
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-base font-medium text-gray-900">
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
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-base font-medium text-gray-900">
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
                      className="mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                    >
                      <option value="presencial">Presencial</option>
                      <option value="virtual">Virtual</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="text-base font-medium text-gray-900">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as
                            | "agendada"
                            | "realizada"
                            | "cancelada",
                        }))
                      }
                      className="mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                    >
                      <option value="agendada">Agendada</option>
                      <option value="realizada">Realizada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-base font-medium text-gray-900">
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
                      className="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="text-base font-medium text-gray-900">
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
                      className="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-base font-medium text-gray-900">
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
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-base font-medium text-gray-900">
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
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                      />
                    </div>
                  </div>
                </div>

                {formData.local === "virtual" && (
                  <div>
                    <label className="text-base font-medium text-gray-900">
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
                      className="mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="text-base font-medium text-gray-900">
                    Participantes
                  </label>
                  <div className="mt-2 max-h-32 overflow-y-auto">
                    {formData.participantes.length > 0 ? (
                      formData.participantes.map((participante, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-[#eaeaea] rounded-md mb-1"
                        >
                          <FaUserCircle />
                          <span className="text-[15px]">{participante}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                        <span className="text-[15px] text-gray-500 italic">
                          Não foi adicionado participantes a essa reunião.
                        </span>
                      </div>
                    )}
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
