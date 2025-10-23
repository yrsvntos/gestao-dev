"use client";
import { useState, useEffect } from "react";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";
import { auth } from "@/services/firebaseConnection";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";




export default function Header() {
    const [userName, setUserName] = useState<string | null>("");
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          
          if (user.displayName) {
            setUserName(user.displayName);
          } else {
  
            try {
              const docRef = doc(db, "users", user.uid);
              const docSnap = await getDoc(docRef);
  
              if (docSnap.exists()) {
                const data = docSnap.data();
                setUserName(data.name || "Usuário");
              } else {
                setUserName("Usuário");
              }
            } catch (err) {
              console.error("Erro ao buscar nome:", err);
              setUserName("Usuário");
            }
          }
        } else {
          setUserName(null);
        }
      });
      return () => unsubscribe();
    }, []);

    async function handleConfirmLogout() {
      try {
        await signOut(auth);
        toast.success("Sessão encerrada com sucesso!");
        setShowModal(false);
        router.push("/");
      } catch (error) {
        toast.error("Erro ao encerrar sessão!");
      }
    }

  return (
    <header className="flex items-center justify-between px-9 h-16.5 border-b border-zinc-200">
      <h2 className="text-sm font-semibold text-gray-800">{userName ? `Olá, ${userName}!` : "Carregando..."}</h2>
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
