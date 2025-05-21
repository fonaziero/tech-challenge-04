import { User } from "@shared/interfaces/user";

const USER_KEY = "user";

export const UserStorageService = {
  saveUser: (user: User): void => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (err) {
      console.error("Erro ao salvar usuário no localStorage:", err);
    }
  },

  getUser: (): User | null => {
    try {
      const data = localStorage.getItem(USER_KEY);
      if (!data) return null;

      const parsed = JSON.parse(data);

      // Validação mínima (opcional)
      if (typeof parsed.id === "string" && typeof parsed.token === "string") {
        return parsed as User;
      }

      return null;
    } catch (err) {
      console.error("Erro ao recuperar usuário do localStorage:", err);
      return null;
    }
  },

  clearUser: (): void => {
    localStorage.removeItem(USER_KEY);
  }
};
