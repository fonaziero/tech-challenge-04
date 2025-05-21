import { User } from "src/domain/entities/User";

export function saveUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}
