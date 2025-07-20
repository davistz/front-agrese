import { useState } from "react";
import { AtividadeExternaFormData } from "../../../types/interfaces";
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdGroups } from "react-icons/md";

interface AtividadeExternaFormProps {
  initialData?: Partial<AtividadeExternaFormData>;
  onSubmit: (data: AtividadeExternaFormData) => void;
  onCancel: () => void;
}

export const AtividadeExternaForm: React.FC<AtividadeExternaFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<AtividadeExternaFormData>({
    titulo: initialData?.titulo || "",
    setorResponsavel: initialData?.setorResponsavel || "",
    descricao: initialData?.descricao || "",
    autor: initialData?.autor || "",
    dataHoraSaida: initialData?.dataHoraSaida || new Date(),
    dataHoraRetorno: initialData?.dataHoraRetorno || new Date(),
    destino: initialData?.destino || "",
    responsavel: initialData?.responsavel || "",
    equipeEnvolvida: initialData?.equipeEnvolvida || [],
    status: initialData?.status || "planejada",
    motivoAtividade: initialData?.motivoAtividade || "",
    meioTransporte: initialData?.meioTransporte || "",
    anexos: initialData?.anexos || [],
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

  return (
    <div className="">
      {" "}
      <section className="rounded-md p-2 bg-white w-[900px]">
        <div className="relative px-6 py-3">
          {" "}
          <h2 className="text-xl font-bold leading-tight text-center">
            {" "}
            Nova Atividade Externa
          </h2>
          <IoMdClose
            onClick={onCancel}
            className="absolute top-4 right-4 text-2xl cursor-pointer"
          />
          <p className="mt-1 text-sm text-gray-600 text-center mb-4">
            {" "}
            Preencha os detalhes da atividade externa
          </p>
          <form className="w-full">
            <div className="space-y-3">
              {" "}
              <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                {" "}
                <div>
                  <label className="text-base font-medium text-gray-900">
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
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                    />
                  </div>
                </div>
                <div>
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
                <div>
                  <label className="text-base font-medium text-gray-900">
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
                    className="mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-base font-medium text-gray-900">
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
                    className="mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="planejada">Planejada</option>
                    <option value="em-execucao">Em Execução</option>
                    <option value="realizada">Realizada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div>
                  <label className="text-base font-medium text-gray-900">
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
                    className="mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-base font-medium text-gray-900">
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
                    className="mt-2 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  {" "}
                  <label className="text-sm font-medium text-gray-900">
                    Data/Hora de Saída e Retorno
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
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
                      className="flex h-9 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholderText="Data/Hora de Saída"
                    />
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
                      className="flex h-9 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholderText="Data/Hora de Retorno"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 mt-3">
                {" "}
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    {" "}
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
                  <div className="mt-1 space-y-1">
                    {" "}
                    <div className="flex gap-2">
                      <input
                        value={novoMembro}
                        onChange={(e) => setNovoMembro(e.target.value)}
                        placeholder="Adicionar membro"
                        className="flex-1 h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddMembro}
                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                      >
                        Adicionar
                      </button>
                    </div>
                    <div className="max-h-20 overflow-y-auto">
                      {" "}
                      {formData.equipeEnvolvida.map((membro, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-[#eaeaea] rounded-md mb-1"
                        >
                          <div className="flex items-center gap-2">
                            <MdGroups />
                            <span className="text-[15px]">{membro}</span>
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
                            className="text-[13px] text-red-500 hover:text-red-700"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Anexos
                  </label>
                  <div className="mt-1">
                    <input
                      id="anexos"
                      type="file"
                      multiple
                      className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onSubmit(formData);
                }}
                className="w-full bg-black h-[40px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white mt-2"
                type="button"
              >
                Salvar Atividade Externa
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
