import { useEffect, useState, useRef } from 'react';
import { Header } from './header';
import History from './history';
import { Transaction } from '@shared/interfaces/transaction';
import { handleFetchError } from '../../../utils/formatters';
import { handleScroll } from '../../../utils/scroll';
import { User } from '@shared/interfaces/user';
import { formatDate, getMonth } from '@shared/utils/date';
import { getPaginatedTransactions } from '../../../usecases/transaction/getPaginatedTransactions';
import { usePagination } from '../../hooks/usePagination';

interface TransactionHistoryProps {
  user: User;
  updateHistoryTrigger: boolean;
  updateUser: () => void;
}

export default function TransactionHistory({ user, updateHistoryTrigger, updateUser }: TransactionHistoryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);
  const LIMIT = 10;

  const {
    items: history,
    offset,
    hasMore,
    loading,
    resetPagination,
    loadMore,
  } = usePagination<Transaction>(LIMIT);

  useEffect(() => {
    const loadHistory = async () => {
      resetPagination();
      await loadMore(() => getPaginatedTransactions(user.token, user.accountId));
    };
    loadHistory();
  }, [updateHistoryTrigger, updateTrigger]);

  useEffect(() => {
    if (offset > 0 && hasMore) {
      loadMore(() => getPaginatedTransactions(user.token, user.accountId)).catch(handleFetchError);
    }
  }, [offset]);

  return (
    <div className="flex-1 flex p-0">
      <div
        ref={containerRef}
        onScroll={() =>
          handleScroll(containerRef, loading, hasMore, () => {
            loadMore(() => getPaginatedTransactions(user.token, user.accountId));
          })
        }
        className="bg-white rounded-lg shadow-md w-full p-8 pt-0 lg:min-w-[282px] lg:h-full lg:min-h-screen overflow-y-auto"
        style={{ maxHeight: '500px' }}
      >
        <Header
          history={history}
          onUpdateHistory={() => setUpdateTrigger((prev) => !prev)}
          updateUser={updateUser}
        />
        <ul className="space-y-4">
          {history.length > 0 ? (
            history.map((item) => (
              <li key={item.id}>
                <History
                  {...item}
                  date={formatDate(item.date)}
                  month={getMonth(item.date)}
                />
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">Nenhuma transação disponível.</p>
          )}
        </ul>
        {loading && <p className="text-center text-gray-500 mt-4">Carregando mais transações...</p>}
      </div>
    </div>
  );
}
