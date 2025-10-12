"use client";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebaseConnection";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Header() {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
  
    async function handleConfirmLogout() {
      try {
        await signOut(auth);
        toast.success("Sessão encerrada com sucesso!");
        setShowModal(false);
        router.push("/login");
      } catch (error) {
        toast.error("Erro ao encerrar sessão!");
      }
    }

  return (
    <header className="flex items-center justify-between px-9 py-5 border-b border-zinc-200">
      <h2 className="text-lg font-semibold text-gray-800"></h2>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition"
      >
        <FiLogOut size={20} />
        <span>Sair</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm animate-fade-in">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Confirmar logout
            </h2>
            <p className="text-gray-600 mb-6">
              Tens a certeza de que desejas encerrar a sessão?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
