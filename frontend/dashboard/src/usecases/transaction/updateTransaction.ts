import { Transaction } from "@shared/interfaces/transaction";
import { User } from "@shared/interfaces/user";
import { parseCurrencyToFloat } from "../../utils/formatters";
import { UserStorageService } from "../../infrastructure/storage/UserStorageService";

type Params = {
  transaction: Transaction;
  user: User;
  newValue: string;
  newType?: string;
};

export async function updateTransaction({ transaction, user, newValue, newType }: Params): Promise<User> {
  const transactionValue = parseCurrencyToFloat(newValue);
  const newBalance = user.balance + transactionValue;

  const patchResponse = await fetch(`/api/dashboard/user?userId=${user.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ balance: newBalance }),
  });

  if (!patchResponse.ok) throw new Error("Erro ao atualizar saldo");

  const updateResponse = await fetch(`/api/dashboard/transactionalHistory`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...transaction,
      value: newValue,
      type: newType ?? transaction.type,
    }),
  });

  if (!updateResponse.ok) throw new Error("Erro ao atualizar transação");

  const updatedUser = { ...user, balance: newBalance };
  UserStorageService.saveUser(updatedUser);
  return updatedUser;
}
