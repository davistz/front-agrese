import { useEffect, useState } from "react";
import { AtividadeExternaFormData } from "../../../types/interfaces";
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdGroups } from "react-icons/md";
import { useTheme } from "../../../contexts/ThemeContext";
import { sectorServices } from "../../../services/sectorsServices";

interface AtividadeExternaFormProps {
  initialData?: Partial<AtividadeExternaFormData>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const AtividadeExternaForm: React.FC<AtividadeExternaFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<AtividadeExternaFormData>({
    titulo: initialData?.titulo || "",
    setorResponsavel: initialData?.setorResponsavel || "",
    descricao: initialData?.descricao || "",
    autor: initialData?.autor || "",
    dataHoraSaida: initialData?.dataHoraSaida || new Date(),
    dataHoraRetorno: initialData?.dataHoraRetorno || new Date(),
    destino: initialData?.destino || "",
    equipeEnvolvida: initialData?.equipeEnvolvida || [],
    status: initialData?.status || "planejada",
    meioTransporte: initialData?.meioTransporte || "",
  });

  const [novoMembro, setNovoMembro] = useState("");
  const [setores, setSetores] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const data = await sectorServices.getSectors();
        if (Array.isArray(data)) {
          setSetores(data.map((s: any) => ({ id: s.id, name: s.name })));
        }
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
        setSetores([]);
      }
    };
    fetchSectors();
  }, []);

  const handleAddMembro = () => {
    if (novoMembro.trim()) {
      setFormData((prev) => ({
        ...prev,
        equipeEnvolvida: [...prev.equipeEnvolvida, novoMembro.trim()],
      }));
      setNovoMembro("");
    }
  };

  return (
    <div className="">
      {" "}
      <section
        className={`rounded-md p-2 w-[900px] ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="relative px-6 py-3">
          {" "}
          <h2
            className={`text-xl font-bold leading-tight text-center ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {" "}
            Nova Atividade Externa
          </h2>
          <IoMdClose
            onClick={onCancel}
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
            {" "}
            Preencha os detalhes da atividade externa
          </p>
          <form className="w-full">
            <div className="space-y-3">
              {" "}
              <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                
                {" "}
                <div>
                  <label
                    className={`text-base font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    Título
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
                      placeholder="Título da Atividade"
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
                    Setor Responsável
                  </label>
                  <div className="mt-2">
                    <select
                      value={formData.setorResponsavel}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          setorResponsavel: e.target.value,
                        }));
                      }}
                      className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-400"
                          : "bg-transparent border-gray-300 text-gray-900 focus:ring-gray-400"
                      }`}
                      required
                    >
                      <option value="" disabled hidden>Selecione um setor</option>
                      {setores.map((setor) => (
                        <option key={setor.id} value={setor.id}>{setor.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    className={`text-base font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
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
                    className={`mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-transparent border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div>
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
                        status: e.target
                          .value as AtividadeExternaFormData["status"],
                      }))
                    }
                    className={`mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-transparent border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="planejada">Planejada</option>
                    <option value="em-execucao">Em Execução</option>
                    <option value="realizada">Realizada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                
                <div>
                  <label
                    className={`text-base font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
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
                    placeholder="Opcional"
                    className={`mt-2 flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-transparent border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div className="col-span-2 flex">
                  {" "}
                  <div>
                    <label
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Hora de Saída
                    </label>
                    <div className="grid grid-cols-2 gap-2">
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
                        className={`flex h-9 w-[270px] rounded-md border px-3 py-2 text-sm ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-transparent border-gray-300 text-gray-900"
                        }`}
                        placeholderText="Data/Hora de Saída"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      Hora de Retorno
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
                      className={`flex h-9 w-[270px] rounded-md border px-3 py-2 text-sm ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-transparent border-gray-300 text-gray-900"
                      }`}
                      placeholderText="Data/Hora de Retorno"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 mt-3">
                {" "}
                <div>
                  {/* Campo 'motivo da atividade' removido */}
                </div>
                <div className="col-span-3">
                  <label
                    className={`text-base font-medium ${
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
                    placeholder="Descrição da atividade externa"
                    className={`mt-2 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-transparent border-gray-300 text-gray-900"
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
                    Equipe Envolvida
                  </label>
                  <div className="mt-1 space-y-1">
                    {" "}
                    <div className="flex gap-2">
                      <input
                        value={novoMembro}
                        onChange={(e) => setNovoMembro(e.target.value)}
                        placeholder="Adicionar membro"
                        className={`flex-1 h-10 rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-transparent border-gray-300 text-gray-900"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleAddMembro}
                        className={`px-4 py-2 rounded-md text-white ${
                          theme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-800 hover:bg-gray-700"
                        }`}
                      >
                        Adicionar
                      </button>
                    </div>
                    <div className="max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                      {" "}
                      {formData.equipeEnvolvida.map((membro, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded-md mb-1 ${
                            theme === "dark"
                              ? "bg-gray-700 text-gray-200"
                              : "bg-[#eaeaea] text-gray-900"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MdGroups
                              className={
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }
                            />
                            <span className="text-[15px]">{membro}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                equipeEnvolvida: prev.equipeEnvolvida.filter((_, i) => i !== index),
                              }));
                            }}
                            className={`ml-2 px-2 py-1 rounded text-xs ${theme === "dark" ? "bg-red-700 text-white" : "bg-red-200 text-red-800"}`}
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
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
                    // Log para debug
                    console.log('Valor do setor selecionado:', formData.setorResponsavel);
                    // Validação reforçada para setor
                    const setorId = Number(formData.setorResponsavel);
                    if (!formData.setorResponsavel || isNaN(setorId) || setorId === 0) {
                      alert("Selecione um setor válido antes de salvar.");
                      return;
                    }
                    // Validação obrigatória para descrição
                    if (!formData.descricao || formData.descricao.trim().length === 0) {
                      alert("Preencha a descrição da atividade externa.");
                      return;
                    }
                    const payload = {
                      title: formData.titulo,
                      description: formData.descricao,
                      type: "EXTERNAL_ACTIVITY",
                      priority: "MEDIUM",
                      startDate: formData.dataHoraSaida ? new Date(formData.dataHoraSaida).toISOString() : new Date().toISOString(),
                      endDate: formData.dataHoraRetorno ? new Date(formData.dataHoraRetorno).toISOString() : new Date().toISOString(),
                      isAllDay: false,
                      location: formData.destino || "",
                      sectorId: setorId,
                      setorResponsavel: setorId,
                      externalStatus: "PLANNED",
                      destino: formData.destino || "",
                      dataHoraSaida: formData.dataHoraSaida ? new Date(formData.dataHoraSaida).toISOString() : null,
                      dataHoraRetorno: formData.dataHoraRetorno ? new Date(formData.dataHoraRetorno).toISOString() : null,
                      meioTransporte: formData.meioTransporte || "",
                      motivoAtividade: "",
               equipeEnvolvida: formData.equipeEnvolvida,
                    };
                    onSubmit(payload);
                  }}
                  className="flex-1 h-12 rounded-lg font-medium text-white transition-all duration-200 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                  Salvar Atividade Externa
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
