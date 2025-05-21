import { handleRequest } from "@shared/utils/fetch-api";

export async function createTransaction(token: string, accountId: string, value: number) {
  const response = await handleRequest("account/transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      accountId,
      value,
      type: "Debit",
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao adicionar transação");
  }

  return value;
}
