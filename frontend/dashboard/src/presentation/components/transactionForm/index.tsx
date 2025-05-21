import { useState } from 'react';
import CreditCard from "@shared/images/card.png";
import { User } from '@shared/interfaces/user';
import { options } from '../../../types/transactionType';
import { createTransaction } from '../../../usecases/transaction/createTransaction';
import { UserStorageService } from '../../../infrastructure/storage/UserStorageService';

const ButtonModule = await import('host/Button');
const Button = ButtonModule.default;

const InputModule = await import('host/Input');
const FormInput = InputModule.default;

const SelectModule = await import('host/Select');
const DropdownSelect = SelectModule.default;

type TransactionFormProps = {
  user: User;
  updateUser: () => void;
  onTransactionSubmit: () => void;
};

export default function TransactionForm({ user, updateUser, onTransactionSubmit }: TransactionFormProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');

  const handleInputChange = (inputValue: string) => {
    setValue(inputValue);
    setError('');

    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue)) {
      if (parsedValue < 0) {
        setTransactionType('Transferência');
      } else {
        setTransactionType('Depósito');
      }
    } else {
      setTransactionType('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!value || !selectedMethod || !transactionType) {
      setError("Preencha todos os campos");
      return;
    }

    const transactionValue = parseFloat(value);

    try {
      await createTransaction(user.token, user.accountId, transactionValue);

      const updatedUser = { ...user, balance: user.balance - transactionValue };
      UserStorageService.saveUser(updatedUser);

      updateUser();
      onTransactionSubmit();
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      setError("Erro ao adicionar a transação");
    }
  };

  return (
    <>
      <h3 className="text-xl mb-4">Nova transação</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <DropdownSelect
            placeholder="Selecione o método"
            color="darkBlue"
            options={options}
            onChange={setSelectedMethod}
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-5 items-center sm:items-start">
          <div className="w-full max-w-min sm:max-w-fit sm:w-auto flex flex-1 flex-col gap-3">
            <label className="block mb-2 text-sm self-center sm:self-start">Valor</label>
            <FormInput
              type="number"
              value={value}
              onChange={(value: any) => handleInputChange(value)}
              placeholder="00,00"
              required={true}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" bg="bg-darkBlue" className="w-full h-full text-white p-2 rounded">
              Concluir transação
            </Button>
          </div>
          <img src={CreditCard} alt="img" className="lg:hidden -z-10" />
        </div>
      </form>
    </>
  );
}


