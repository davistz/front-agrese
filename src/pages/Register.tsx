import { useState } from "react";
import { Logo1 } from "../assets";
import { CiLock } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-[#34448C] via-[#34448C] to-[#049454]">
      <div className="bg-gray-900 border-[4px] border-blue-900 rounded-2xl px-12 py-8 transition-all duration-200">
        <div className="flex flex-col items-center space-y-4 font-semibold text-gray-500">
          <Logo1 className="w-20 h-20" />
          <h1 className="text-white text-2xl">Crie sua conta</h1>

          <div className="text-white shadow-lg bg-blue-900 flex gap-2 items-center p-2 rounded-md group duration-300">
            <svg
              className="group-hover:rotate-[360deg] duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <path d="M22 6l-10 7L2 6"></path>
            </svg>
            <input
              type="email"
              className="flex-1 bg-transparent focus:outline-none"
              placeholder="Email"
            />
          </div>

          <div className="text-white shadow-lg bg-blue-900 flex gap-2 items-center p-2 rounded-md group duration-300">
            <CiLock className="group-hover:rotate-[360deg] duration-300" />
            <input
              type="password"
              className="flex-1 bg-transparent focus:outline-none"
              placeholder="Senha"
            />
          </div>

          <div className="text-white shadow-lg bg-blue-900 flex gap-2 items-center p-2 rounded-md group duration-300">
            <CiLock className="group-hover:rotate-[360deg] duration-300" />
            <input
              type="password"
              className="flex-1 bg-transparent focus:outline-none"
              placeholder="Confirmar senha"
            />
          </div>

          <button className="w-[230px] bg-black h-[35px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#34448C] before:via-[#34448C] before:to-[#049454] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-white">
            Cadastrar
          </button>

          <p className="text-white">
            Já possui uma conta?{" "}
            <button
              className="font-semibold text-white hover:text-blue-500 transition-all duration-200 underline"
              onClick={() => handleClick()}
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
