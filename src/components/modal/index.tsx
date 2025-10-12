"use client";

import { FiLogOut } from "react-icons/fi";

interface ModalConfirmLogoutProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ModalConfirmLogout({ isOpen, onConfirm, onCancel }: ModalConfirmLogoutProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 animate-fadeIn">
        <div className="flex flex-col items-center">
          <FiLogOut size={40} className="text-red-500 mb-2" />
          <h2 className="text-xl font-bold mb-1 text-center">Deseja realmente sair?</h2>
          <p className="text-gray-500 text-center mb-4">
            Você será desconectado da sua conta e precisará fazer o login novamente.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-2 border cursor-pointer rounded-md font-medium hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 bg-red-500 cursor-pointer text-white rounded-md font-medium hover:bg-red-600 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
