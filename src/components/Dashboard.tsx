import { Logo1 } from "../assets";
import { FaRegCalendarAlt, FaUserCircle } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";
import { useState } from "react";
import { Calendario } from "./elements/Calendario";

export const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div>
      <div className="flex">
        <nav className="fixed font-[Outfit] top-0 z-50 w-full bg-white dark:bg-gray-800 ">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start rtl:justify-end">
                <Logo1 className="w-10 h-10 mr-4" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Agrese
                </span>
              </div>

              <div className=" relative flex justify-center items-center text-zinc-600 text-sm font-bold">
                <label className="relative mr-5 inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" />
                  <div
                    className="group peer ring-2 bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600 rounded-full outline-none duration-1000 after:duration-300 w-16 h-8 shadow-md peer-focus:outline-none
                    after:content-[''] after:rounded-full after:absolute after:outline-none after:w-6 after:h-6 after:top-1 after:left-1 
                    after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9,_#ffffff,_#b2a8a8)]
                    peer-checked:after:translate-x-8 peer-checked:after:rotate-180 peer-hover:after:scale-110"
                  ></div>
                </label>

                <div
                  className="shadow-md group flex items-center group-hover:gap-2 p-3 rounded-full cursor-pointer duration-300"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(18, 26, 61, 1) 10%, rgba(4, 61, 37, 1) 90%)",
                  }}
                >
                  <FaUserCircle className="w-9 h-9 text-white" />
                  <div className="flex flex-col">
                    <span className="text-[0px] group-hover:text-sm duration-300 text-white">
                      Davi Souza
                    </span>
                    <span className="text-[0px] group-hover:text-[10px] duration-300 text-[#ab0505]">
                      Diretor Geral
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div
          onClick={() => toggleSidebar()}
          className={`flex flex-col justify-between bg-gray-800 text-white h-screen pt-20 ${
            isOpen ? "w-50" : "w-18"
          } duration-300`}
        >
          <div>
            <div className="">
              <div className="px-2">
                <ul className="space-y-3 pt-4">
                  <li>
                    <a
                      href="#"
                      className={`group relative flex items-center rounded-sm px-2 py-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-700 ${
                        isOpen ? "justify-start gap-4 pl-4" : "justify-center"
                      }`}
                    >
                      <FaRegCalendarAlt className="w-6 h-6" />
                      {isOpen && (
                        <h1 className="font-bold text-[15px]">Calendário</h1>
                      )}
                      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                        Calendário
                      </span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className={`group relative flex items-center rounded-sm px-2 py-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-700 ${
                        isOpen ? "justify-start gap-4 pl-4" : "justify-center"
                      }`}
                    >
                      <MdGroups2 className="w-6 h-6" />
                      {isOpen && (
                        <h1 className="font-bold text-[15px]">Setores</h1>
                      )}
                      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                        Setores
                      </span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className={`group relative flex items-center rounded-sm px-2 py-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-700 ${
                        isOpen ? "justify-start gap-4 pl-4" : "justify-center"
                      }`}
                    >
                      <FaGear className="w-6 h-6 group-hover:rotate-[360deg] duration-300" />
                      {isOpen && (
                        <h1 className="font-bold text-[15px]">Configurações</h1>
                      )}
                      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                        Configurações
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="sticky inset-x-0 bottom-0  p-2">
            <a
              href="#"
              className={`group relative flex items-center rounded-sm px-2 py-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-700 ${
                isOpen ? "justify-start gap-4 pl-4" : "justify-center"
              }`}
            >
              <TbLogout className="w-6 h-6" />
              {isOpen && <h1 className="font-bold text-[15px]">Sair</h1>}
              <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                Sair
              </span>
            </a>
          </div>
        </div>
        <Calendario />
      </div>
    </div>
  );
};
