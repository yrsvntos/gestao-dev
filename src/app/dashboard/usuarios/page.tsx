"use client"

import { useState, useEffect } from "react";
import { db } from "@/services/firebaseConnection";
import { getDocs, collection, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import Container from "@/components/container";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import { HiUserAdd } from "react-icons/hi";
import { useUserRole } from "@/hooks/userRole";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


interface Users{
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Editor" | "Visitante",
}

const tableHeaders = [
    "Nome",
    "Email",
    "Nível de Acesso",
    "Ações"
]


export default function Usuarios(){

    const [users, setUsers] = useState<Users[]>([]);
    const [showModal, setShowModal] = useState(false)
    const [showUserInfo, setShowUserInfo] = useState(false)
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<Users | null>(null)
    
    const {role} =  useUserRole()
    const router = useRouter()

    useEffect(() => {

        function loadUsuarios(){
            const getRef = collection(db, "users");
            const queryRef = query(getRef, orderBy("createdAt", "asc"))
            getDocs(queryRef)
            .then((snapshot) => {
                let usersList = [] as Users[];
    
                snapshot.forEach((doc) => {
                   usersList.push({
                        id: doc.id,
                        name: doc.data().name,
                        email: doc.data().email,
                        role: doc.data().role
                   })
    
                })
    
                setUsers(usersList)
                setLoading(false)
            })
        }
       
        loadUsuarios()

    }, [])

    async function handleDelete(user: Users){

        try {
            const getRef = doc(db, "users", user.id);
            await deleteDoc(getRef)
            toast.success("Usuário excluído com sucesso!")
            setUsers(prev => prev.filter(u => u.id !== user.id))
            setShowModal(false)   
        } catch (error) {
            toast.error("Erro ao excluir o usuário!");
            return
        }
        
    }


    if(loading){
        return(
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600"></div>
              <p className="text-gray-600 font-medium">Carregando usuários...</p>
            </div>
        )
    }
    if(role !== "Admin"){
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-center p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Acesso limitado
              </h2>
              <p className="text-gray-600 max-w-md">
                Lamentamos, mas a sua conta não possui permissões para cadastrar novos projectos.
                Se acredita que isto é um erro, entre em contacto com o administrador do sistema.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="mt-6 bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
              >
                Voltar ao painel
              </button>
            </div>
        );
    }


    return(
        <Container>
            <div className="flex items-center justify-between">
                <h2 className="font-bold">Usuários cadastrados no sistema</h2>
                <Link 
                    href="/dashboard/usuarios/cadastro"
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-900 text-white text-sm font-extrabold rounded-md px-4 py-2"
                >
                    Cadastrar usuário <HiUserAdd size={18} />
                </Link>
            </div>
            <div className="overflow-x-auto mt-6">
                <table className="border-collapse border-2 border-gray-500 w-full">
                    <thead>
                        <tr>
                        {tableHeaders.map(item => (
                            <th key={item} className="border border-gray-400 px-4 py-2 text-gray-800 text-start">{item}</th>
                        ))}
                        </tr>
                    </thead>
                    
                    <tbody className="text-sm">
                        {users.map(user => (
                            <tr key={user.id} className="bg-gray-100" >
                                <td className="border border-gray-400 px-4 py-2">{user.name}</td>
                                <td className="border border-gray-400 px-4 py-2">{user.email}</td>
                                <td className="border border-gray-400 px-4 py-2">
                                    <span 
                                        className={`p-1 rounded px-2 
                                            ${user.role === "Admin"
                                                ? "bg-green-500 text-white"
                                                : user.role === "Editor"
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-500 text-white"

                                            }`}>{user.role}
                                    </span>
                                </td>
                                <td className="border border-gray-400 px-4 py-2">
                                    <div className="flex justify-end items-center gap-3">
                                        <button
                                            onClick={() => {
                                                    setSelectedUser(user)
                                                    setShowUserInfo(true)
                                                }
                                        
                                            }
                                            className="bg-transparent rounded p-2 text-sm  transition-all  hover:bg-zinc-100 cursor-pointer flex items-center border border-bg-black gap-2 duration-500"
                                            title="Visualizar"

                                        >
                                            <FiEye/>
                                        </button>
                                        {showUserInfo && selectedUser && (
                                           
                                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                                <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
                                                    
                                                    <div className="flex flex-col items-center mb-4">
                                                        <h2 className="text-xl font-bold text-center">{selectedUser?.name}</h2>
                                                        <p className="text-gray-500 text-center">Detalhes do usuário</p>
                                                    </div>

                            
                                                    <div className="grid grid-cols-1 gap-3 text-gray-700 text-sm">
                                                        <div>
                                                            <span className="font-semibold">Nome:</span> {selectedUser.name}
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold">Email:</span> {selectedUser.email}
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold">Nível de acesso:</span> {selectedUser.role}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3 mt-6">
                                                        {/* <button
                                                            onClick={() => selectedProject &&
                                                                exportProjectoPDF(selectedProject)
                                                            }
                                                            className="flex-1 py-2 border rounded-md font-medium bg-black text-white cursor-pointer transition"
                                                        >
                                                            Exportar PDF
                                                        </button> */}
                                                        <button
                                                            onClick={() => setShowUserInfo(false)}
                                                            className="flex-1 py-2 border rounded-md font-medium hover:bg-zinc-100 cursor-pointer transition"
                                                        >
                                                            Fechar
                                                        </button>
                                                        
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <Link 
                                            href={`/dashboard/usuarios/editar/${user.id}`}
                                            className="bg-zinc-800 hover:bg-zinc-500 text-white border-0 text-sm rounded p-2  cursor-pointer flex items-center gap-2 duration-500"
                                            title="Editar"
                                        >
                                            <FiEdit/>
                                        </Link>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="bg-red-500 hover:bg-red-300 text-white rounded p-2 text-sm  transition-all cursor-pointer flex items-center gap-2 duration-500"
                                            title="Excluir"
                                        >
                                            <FiTrash/>
                                        </button>

                                        {showModal && (
                                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                                <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 animate-fadeIn">
                                                    <div className="flex flex-col items-center">
                                                        <h2 className="text-xl font-bold mb-1 text-center">Deseja excluir o usuário?</h2>
                                                        <p className="text-gray-500 text-center mb-4">
                                                            Ao excluir este usuário, a ação será permanente e não poderá ser revertida.
                                                        </p>
                                                        <div className="flex gap-3 w-full">
                                                            <button
                                                            onClick={() => setShowModal(false)}
                                                            className="flex-1 py-2 border cursor-pointer rounded-md font-medium hover:bg-gray-100 transition"
                                                            >
                                                            Cancelar
                                                            </button>
                                                            <button
                                                            onClick={() => handleDelete(user)}
                                                            className="flex-1 py-2 bg-red-500 cursor-pointer text-white rounded-md font-medium hover:bg-red-600 transition"
                                                            >
                                                            Excluir
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    
                </table>
            </div>
        </Container>
    );

}