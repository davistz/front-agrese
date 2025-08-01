import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";

interface EventModalProps {
  onClose: () => void;
  evento: {
    id: number;
    title: string;
    start: Date;
    end: Date;
    desc: string;
    autor: string;
    setor: string;
    tipo: string;
  };
}

export const EventModal: React.FC<EventModalProps> = ({ onClose, evento }) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    evento.start ? new Date(evento.start) : null,
    evento.end ? new Date(evento.end) : null,
  ]);
  const [startDate, endDate] = dateRange;

  const [title, setTitle] = useState(evento.title);
  const [desc, setDesc] = useState(evento.desc);
  console.log(evento);

  return (
    <div className="">
      <section className="rounded-md p-2 bg-white">
        <div className="flex items-center justify-center my-3">
          <div className="xl:mx-auto flex flex-col items-center  p-4 xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-2xl font-bold leading-tight">Editar Evento</h2>
            <IoMdClose
              onClick={onClose}
              className="absolute top-45 left-245 text-2xl cursor-pointer"
            />
            <p className="mt-2 text-base text-gray-600">
              Editar os detalhes do evento
            </p>
            <form className="mt-5">
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div>
                    <label className="text-base font-medium text-gray-900">
                      Titulo do Evento
                    </label>
                    <div className="mt-2">
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Titulo do Evento"
                        type="text"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        name="user_name"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-base font-medium text-gray-900">
                        Setor de Origem
                      </label>
                    </div>
                    <div className="mt-2">
                      <input
                        value={evento.tipo}
                        placeholder="Setor de Origem"
                        type="text"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        name="setor_origem"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-base font-medium text-gray-900">
                    Descrição do Evento
                  </label>
                  <div className="mt-2">
                    <input
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="Descrição do Evento"
                      type="text"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      name="descricao_evento"
                    />
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-base font-medium text-gray-900">
                          Criador do Evento
                        </label>
                      </div>
                      <div className="mt-2">
                        <input
                          value={evento.autor}
                          placeholder="Criador do Evento"
                          type="text"
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                          name="criador_evento"
                        />
                      </div>
                    </div>
                    <div className="">
                      <label className="text-sm font-medium text-gray-900">
                        Data de início e fim do evento
                      </label>
                      <div className="mt-2">
                        <DatePicker
                          selectsRange
                          startDate={startDate}
                          endDate={endDate}
                          onChange={(update) => setDateRange(update)}
                          isClearable={true}
                          className="w-[195px] h-10 rounded-md border border-gray-300 px-3 py-2 text-sm"
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Selecione o período"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full bg-black h-[50px] mt-4 flex items-center justify-center rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-500 hover:scale-105 text-white"
                    type="button"
                  >
                    Salvar Evento
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
