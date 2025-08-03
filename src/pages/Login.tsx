import { Logo1 } from "../assets";
import { CiLock } from "react-icons/ci";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);

      if (success) {
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        setError("Email ou senha incorretos");
      }
    } catch (error) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-[#34448C] via-[#34448C] to-[#049454]">
      <div className="bg-gray-900 border-[4px] border-blue-900 rounded-2xl px-12 py-8 transition-all duration-200">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4 font-semibold text-gray-500"
        >
          <Logo1 className="w-20 h-20" />
          <h1 className="text-white text-2xl">Seja bem-vindo!</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="text-white shadow-lg bg-blue-900 flex gap-2 items-center p-2 rounded-md group duration-300">
            <CiLock className="group-hover:rotate-[360deg] duration-300" />
            <input
              type="password"
              className="flex-1 bg-transparent focus:outline-none"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-[230px] bg-black h-[35px] flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#34448C] before:via-[#34448C] before:to-[#049454] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-white">
            Não possui uma conta?{" "}
            <button
              type="button"
              className="font-semibold text-white hover:text-blue-500 transition-all duration-200 underline"
              onClick={() => handleClick()}
              disabled={isLoading}
            >
              Criar Conta
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
