import { useState } from "react";
import { ReuniaoFormData } from "../../../types/interfaces";
import { useTheme } from "../../../contexts/ThemeContext";
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaUserCircle } from "react-icons/fa";

interface ReuniaoFormProps {
  initialData?: Partial<ReuniaoFormData>;
  onSubmit: (data: ReuniaoFormData) => void;
  onCancel: () => void;
}

export const ReuniaoForm: React.FC<ReuniaoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<ReuniaoFormData>({
    titulo: initialData?.titulo || "",
    setorResponsavel: initialData?.setorResponsavel || "",
    descricao: initialData?.descricao || "",
    autor: initialData?.autor || "",
    dataHoraInicio: initialData?.dataHoraInicio || new Date(),
    dataHoraTermino: initialData?.dataHoraTermino || new Date(),
    local: initialData?.local || "presencial",
    participantes: initialData?.participantes || [],
    status: initialData?.status || "agendada",
    responsavelAta: initialData?.responsavelAta || "",
    linkReuniao: initialData?.linkReuniao || "",
    notificacao: initialData?.notificacao || 30,
  });

  const [novoParticipante, setNovoParticipante] = useState("");

  const handleAddParticipante = () => {
    if (novoParticipante.trim()) {
      setFormData((prev) => ({
        ...prev,
        participantes: [...prev.participantes, novoParticipante.trim()],
      }));
      setNovoParticipante("");
    }
  };

  return (
    <div className="">
      <section
        className={`rounded-md p-2 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-center my-3">
          <div className="xl:mx-auto flex flex-col items-center p-4 xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2
              className={`text-2xl font-bold leading-tight ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Nova Reunião
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
              className={`mt-2 text-base ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Preencha os detalhes da reunião
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
                          status: e.target.value as
                            | "agendada"
                            | "realizada"
                            | "cancelada",
                        }))
                      }
                      className={`mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-transparent border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="agendada">Agendada</option>
                      <option value="realizada">Realizada</option>
                      <option value="cancelada">Cancelada</option>
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

                <div>
                  <label
                    className={`text-base font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Participantes
                  </label>
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      <input
                        value={novoParticipante}
                        onChange={(e) => setNovoParticipante(e.target.value)}
                        placeholder="Adicionar participante"
                        className={`flex-1 h-10 rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-transparent border-gray-300 text-gray-900"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleAddParticipante}
                        className={`px-4 py-2 rounded-md text-white ${
                          theme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-800 hover:bg-gray-700"
                        }`}
                      >
                        Adicionar
                      </button>
                    </div>
                    <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                      {formData.participantes.map((participante, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded-md mb-1 ${
                            theme === "dark"
                              ? "bg-gray-700 text-gray-200"
                              : "bg-[#eaeaea] text-gray-900"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FaUserCircle
                              className={
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }
                            />
                            <span className="text-[15px]">{participante}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                participantes: prev.participantes.filter(
                                  (_, i) => i !== index
                                ),
                              }))
                            }
                            className="text-[13px] text-red-500 hover:text-red-700"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
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
                      className={`mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-transparent border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit(formData);
                  }}
                  className={`w-full h-[50px] mt-4 flex items-center justify-center rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-black hover:bg-gray-800"
                  }`}
                  type="button"
                >
                  Salvar Reunião
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
