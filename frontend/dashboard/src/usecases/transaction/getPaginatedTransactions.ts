import { Transaction } from '@shared/interfaces/transaction';
import { handleRequest } from '@shared/utils/fetch-api';

type GetTransactionsResponse = {
  result: {
    transactions: Transaction[];
  };
};

export async function getPaginatedTransactions(
  token: string,
  accountId: string
): Promise<Transaction[]> {
  const response = await handleRequest(`account/${accountId}/statement`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erro ao buscar transações: ${errorBody}`);
  }

  const data = (await response.json()) as GetTransactionsResponse;
  return data.result.transactions;
}
