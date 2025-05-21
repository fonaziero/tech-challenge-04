import { handleRequest } from "@shared/utils/fetch-api";
import { User } from "../../domain/entities/User";

export async function registerUser(username: string, email: string, password: string): Promise<User> {
  const registerResponse = await handleRequest("user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!registerResponse.ok) {
    throw new Error("Erro ao registrar usuário");
  }

  const loginResponse = await handleRequest("user/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }); 

  const loginData = await loginResponse.json();

  const userInfo = await handleRequest("account", {
    method: "GET",
    headers: { Authorization: `Bearer ${loginData.result.token}` },
  });

  const dataInfo = await userInfo.json();

  return {
    id: dataInfo.result.account[0].userId,
    accountId: dataInfo.result.account[0].id,
    name: dataInfo.result.cards[0].name,
    email,
    balance: +dataInfo.result.cards[0].cvc,
    transactionType: dataInfo.result.cards[0].type,
    token: loginData.result.token,
  };
}
