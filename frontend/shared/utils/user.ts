import { User } from "../interfaces/user";

export const getStoredUser = (router: any): User | null => {
  const storedUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;
  if (!storedUser) {
    router("/");
    return null;
  }
  return storedUser;
};

export const getAuthenticatedUser = (
  setError: (msg: string) => void,
  router: any
): User | null => {
  const user = getStoredUser(router);
  if (!user) setError("Usuário não autenticado.");
  return user;
};
