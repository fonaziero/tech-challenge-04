import { handleRequest } from "@shared/utils/fetch-api";
import { User } from "src/domain/entities/User";

export async function loginUser(email: string, password: string): Promise<User | null> {
  const response = await handleRequest('user/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || 'Erro ao fazer login');

  if (!data.result.token) return null;

  const userInfo = await handleRequest('account', {
    method: 'GET',
    headers: { Authorization: `Bearer ${data.result.token}` },
  });

  const dataInfo = await userInfo.json();

  return {
    id: dataInfo.result.account[0].userId,
    accountId: dataInfo.result.account[0].id,
    name: dataInfo.result.cards[0].name,
    email: dataInfo.email,
    password: dataInfo.password,
    balance: +dataInfo.result.cards[0].cvc,
    transactionType: dataInfo.result.cards[0].type,
    token: data.result.token,
  };
}
