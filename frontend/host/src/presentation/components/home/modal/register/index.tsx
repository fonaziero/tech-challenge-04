import React, { useState, useEffect } from "react";
import BannerModal from "@shared/images/Ilustração Login.png";
import Modal from "../../../UI/modal";
import FormInput from "../../../UI/inputs/input";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../../../usecases/user/registerUser";
import { saveUser } from "../../../../../infrastructure/storage/UserStorage";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    setIsFormValid(
      !!username && !!email && !!password && isChecked && isEmailValid(email)
    );
  }, [username, email, password, isChecked]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError("");
    setLoading(true);

    try {
      const user = await registerUser(username, email, password);
      saveUser(user);
      onClose();
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao registrar");
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field: string) => {
    if (field === "name" && !username) {
      setNameError("Campo obrigatório.");
    } else if (field === "email" && !isEmailValid(email)) {
      setEmailError("Dado incorreto. Revise e digite novamente.");
    } else if (field === "password" && !password) {
      setPasswordError("Campo obrigatório.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "name") {
      setUsername(value);
      setNameError("");
    } else if (field === "email") {
      setEmail(value);
      setEmailError("");
    } else if (field === "password") {
      setPassword(value);
      setPasswordError("");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      height="100vh"
      width="792px"
      hasFooter={false}
    >
      <div className="flex items-center justify-center bg-gray-100 p-5 md:pb-6">
        <img src={BannerModal} alt="Ilustração" className="w-auto h-auto" />
      </div>

      <div className="w-full px-4 md:px-24">
        <h2 className="text-md font-bold mb-4">
          Preencha os campos abaixo para criar sua conta corrente!
        </h2>

        {error && <div className="text-red mb-4">{error}</div>}

        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <FormInput
            label="Nome"
            type="text"
            value={username}
            placeholder="Digite seu nome completo"
            error={nameError}
            onChange={(value) => handleInputChange("name", value)}
            onBlur={() => handleBlur("name")}
          />

          <FormInput
            label="Email"
            type="email"
            value={email}
            placeholder="Digite seu email"
            error={emailError}
            onChange={(value) => handleInputChange("email", value)}
            onBlur={() => handleBlur("email")}
          />

          <div className="w-full md:w-1/2">
            <FormInput
              label="Senha"
              type="password"
              value={password}
              placeholder="Digite sua senha"
              error={passwordError}
              onChange={(value) => handleInputChange("password", value)}
              onBlur={() => handleBlur("password")}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded shadow border-2 border-green checked:bg-green checked:border-green"
              id="check"
            />
            <span className="ml-2 text-sm text-black">
              Li e estou ciente quanto às condições de tratamento dos meus
              dados conforme descrito na Política de Privacidade do banco.
            </span>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className={`bg-red text-white p-4 rounded-md ${
                !isFormValid || loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red"
              }`}
              disabled={!isFormValid || loading}
            >
              {loading ? "Carregando..." : "Criar conta"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RegisterModal;
