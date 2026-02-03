import { ReactNode } from 'react';

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    titulo?: string;
    descricao?: ReactNode;
    carregando?: boolean;
};

export const ModalDelete = ({
    open,
    onClose,
    onConfirm,
    titulo = 'Excluir item',
    descricao = 'Tem certeza que deseja excluir? Essa ação não pode ser desfeita.',
    carregando = false,
}: Props) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {titulo}
                </h3>

                <p className="text-sm text-gray-500 mb-6">
                    {descricao}
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={carregando}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {carregando ? 'Excluindo...' : 'Excluir'}
                    </button>
                </div>
            </div>
        </div>
    );
};
