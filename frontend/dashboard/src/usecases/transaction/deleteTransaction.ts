import { User } from "@shared/interfaces/user";
import { parseCurrencyToFloat } from "../../utils/formatters";
import { UserStorageService } from "../../infrastructure/storage/UserStorageService";

export async function deleteTransaction(transactionId: string, user: User, value: string): Promise<User> {
  const transactionValue = parseCurrencyToFloat(value);
  const newBalance = user.balance + transactionValue;

  const patchResponse = await fetch(`/api/dashboard/user?userId=${user.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ balance: newBalance }),
  });

  if (!patchResponse.ok) throw new Error("Erro ao atualizar saldo");

  const deleteResponse = await fetch(`/api/dashboard/transactionalHistory?id=${transactionId}`, {
    method: "DELETE",
  });

  if (!deleteResponse.ok) throw new Error("Erro ao remover transação");

  const updatedUser = { ...user, balance: newBalance };
  UserStorageService.saveUser(updatedUser);
  return updatedUser;
}
