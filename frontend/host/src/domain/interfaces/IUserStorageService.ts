import { User } from "../entities/User";

export interface IUserStorageService {
  saveUser: (user: User) => void;
  getUser: () => User | null;
  clearUser: () => void;
}
