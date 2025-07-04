import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Transaction } from "@shared/interfaces/transaction";
import { options } from "../../../../types/transactionType";
import { formatDate } from "@shared/utils/date";
import { updateTransaction } from "../../../../usecases/transaction/updateTransaction";
import { deleteTransaction } from "../../../../usecases/transaction/deleteTransaction";
import { getAuthenticatedUser } from "@shared/utils/user";
import { useSearchFilter } from "../../../hooks/useSearchFilter";

const SelectModule = await import('host/Select');
const DropdownSelect = SelectModule.default;

const ButtonModule = await import('host/Button');
const Button = ButtonModule.default;

const ModalModule = await import('host/Modal');
const Modal = ModalModule.default;

const InputModule = await import('host/Input');
const FormInput = InputModule.default;

const SearchBarModule = await import('host/SearchBar');
const SearchBar = SearchBarModule.default;

interface EditModalProps {
    history: Transaction[];
    isOpen: boolean;
    onClose: () => void;
    deleteMode: boolean;
    onTransactionUpdate: () => void;
    updateUser: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
    isOpen,
    onClose,
    history,
    deleteMode,
    onTransactionUpdate,
    updateUser,
}) => {

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const router = useNavigate();

    const {
        filtered: filteredHistory,
        setQuery: setSearchQuery
    } = useSearchFilter<Transaction>(
        history,
        (transaction, query) =>
            transaction.type.toLowerCase().includes(query) ||
            transaction.date.includes(query) ||
            transaction.value.toString().includes(query),
        200
    );

    useEffect(() => {
        if (selectedTransaction) {
            setSelectedMethod(selectedTransaction.type);
            setValue(selectedTransaction.value);
        }
    }, [selectedTransaction]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };


    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTransaction || !value.trim()) {
            setError("Preencha o valor corretamente.");
            return;
        }

        try {
            const user = getAuthenticatedUser(setError, router);
            if (!user) return;
            await updateTransaction({
                transaction: selectedTransaction,
                user,
                newValue: value,
                newType: selectedMethod,
            });
            updateUser();
            onTransactionUpdate();
            setSelectedTransaction(null);
            onClose();
        } catch (err) {
            setError("Erro ao atualizar a transação.");
        }
    };

    const handleDeleteTransaction = async () => {
        if (!selectedTransaction) return;

        try {
            const user = getAuthenticatedUser(setError, router);
            if (!user) return;
            await deleteTransaction(
                selectedTransaction.id,
                user,
                value,
            );
            updateUser();
            onTransactionUpdate();
            setSelectedTransaction(null);
            onClose();
        } catch (err) {
            setError("Erro ao remover a transação.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} height="700px" width="500px" hasFooter={false}>
            <div className="edit-modal p-6">
                <h2 className="text-2xl font-semibold mb-4 text-center">{deleteMode ? "Excluir Transação" : "Editar Transação"}</h2>
                <SearchBar onSearch={handleSearch} placeholder="Busque por tipo, data ou valor..." />
                {error && <p className="error-message text-red-600 text-sm mb-4">{error}</p>}

                {!selectedTransaction ? (
                    <div className="transaction-list mb-4">
                        <h3 className="text-lg font-bold mb-2">Selecione uma transação para {deleteMode ? "excluir" : "editar"}:</h3>
                        <ul className="space-y-2 overflow-y-auto max-h-96">
                            {filteredHistory.map((transaction) => (
                                <li key={transaction.id} className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-100 cursor-pointer">
                                    <span>{formatDate(transaction.date)} - {transaction.type} : {transaction.value}</span>
                                    <Button
                                        type="button"
                                        bg={deleteMode ? "bg-red" : "bg-green"}
                                        color="text-white"
                                        className="px-2 py-1"
                                        onClick={() => setSelectedTransaction(transaction)}
                                    >
                                        {deleteMode ? "Excluir" : "Editar"}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : deleteMode ? (
                    <>
                        <p className="mb-4">Tem certeza que deseja excluir a transação de {formatDate(selectedTransaction.date)} - {selectedTransaction.type} : {selectedTransaction.value}?</p>
                        <div className="form-actions flex justify-end gap-3 mt-6">
                            <Button type="button" bg="bg-gray" color="text-white" onClick={() => setSelectedTransaction(null)} className="px-6 py-2">
                                Cancelar
                            </Button>
                            <Button type="button" bg="bg-red" color="text-white" onClick={handleDeleteTransaction} className="px-6 py-2">
                                Confirmar
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <Button type="button" bg="bg-gray" color="text-white" onClick={() => setSelectedTransaction(null)} className="mb-4">
                            Voltar à lista
                        </Button>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <DropdownSelect
                                placeholder="Selecione o método"
                                color="darkBlue"
                                options={options}
                                onChange={setSelectedMethod}
                            />
                            <FormInput
                                label="Valor"
                                type="number"
                                value={value}
                                placeholder="Digite o valor"
                                onChange={setValue}
                                className="w-full max-w-xs sm:max-w-sm lg:w-[355px]"
                            />
                            <div className="form-actions flex justify-end gap-3 mt-6">
                                <Button type="button" bg="bg-gray-500" color="text-white" onClick={onClose} className="px-6 py-2">
                                    Cancelar
                                </Button>
                                <Button type="submit" bg="bg-blue-500" color="text-white" className="px-6 py-2">
                                    Salvar
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default EditModal;
