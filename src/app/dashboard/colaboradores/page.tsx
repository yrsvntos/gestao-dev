"use client";

import { useEffect, useState } from "react";
import { db } from "@/services/firebaseConnection";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { UserProps } from "@/utils/user";
import Link from "next/link";
import { HiUserAdd } from "react-icons/hi";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import "./../../globals.css";
import toast from "react-hot-toast";


const tableHeader = [
    "Nome Completo",
    "Email",
    "Telefone",
    "Função",
    "Departamento",
    "Estado",
    "Ações"
]
export default function Usuarios(){

    const [users, setUsers] = useState<UserProps[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false);
    const [showUserInfo, setShowUserInfo] = useState(false)

    

    useEffect(() => {
        
        async function getUsers() {
            const getRef = collection(db, "colaboradores");
            const queryRef = query(getRef, orderBy("criadoEm", "asc"));

            

            getDocs(queryRef)
            .then((snapshot) => {

                let usersList = [] as UserProps[];

                snapshot.forEach((doc) => {
                    // 🔹 Converte data de nascimento (Timestamp → Date → string)
                    const dataNascimento = doc.data().dataNascimento?.toDate?.().toISOString().split("T")[0] ||
                    doc.data()?.dataNascimento ||
                    "";
                    usersList.push({
                        id: doc.id,
                        nome: doc.data().nome,
                        apelido: doc.data().apelido,
                        email: doc.data().email,
                        funcao: doc.data().funcao,
                        departamento: doc.data().departamento,
                        telefone: doc.data().telefone,
                        estado: doc.data().estado,
                        contrato: doc.data().contrato,
                        genero: doc.data().genero,
                        dataNascimento: doc.data().dataNascimento,
                        morada: doc.data().morada,  
                    })
                })
                setUsers(usersList);
                setLoading(false)
            })
            .catch((error) => {
                console.error("Erro ao carregar usuários:", error);
                setLoading(false);
            });
            
            
        }
        getUsers();

    }, [])

    async function handleDeleteUser(colaborador: UserProps){
        const itemColaborador = colaborador;
        const getDoc = doc(db, "colaboradores", itemColaborador.id);
        await deleteDoc(getDoc)
        .then(() => {
            toast.success("Colaborador excluído com sucesso!");
            setUsers(users.filter(colaborador => colaborador.id !== itemColaborador.id));
            setShowModal(false);
        })
        .catch((error) => {
            toast.error("Erro ao excluír o colaborador!");
        })

        
    }

    function formatDate(timestamp?: any) {
        if (!timestamp) return "";
        if (timestamp.toDate) return timestamp.toDate().toLocaleDateString("pt-PT");
        return timestamp; 
    }
      
    if(loading){
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600"></div>
              <p className="text-gray-600 font-medium">Carregando colaboradores...</p>
            </div>
          );
    }
    return(
        <main> 
            <div className="flex items-center justify-between">
                <h2 className="font-bold">Colaboradores cadastrados no sistema</h2>
                <Link 
                    href="/dashboard/colaboradores/cadastro"
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-500 text-white text-sm font-extrabold rounded-md px-4 py-2"
                >
                    Cadastrar colaborador <HiUserAdd size={18} />
                </Link>
            </div>
            
            <div className="overflow-x-auto mt-6">
                <table className="border-collapse border-2 border-gray-500 w-full">
                    <thead>
                        <tr>
                            {tableHeader.map((item) => (
                                <th key={item} className="border border-gray-400 px-4 py-2 text-gray-800">{item}</th>
                            ))}
                            
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center font-bold py-4">
                                        Sem usuários cadastrados no sistema!
                                    </td>
                                </tr>
                            ) : ( 
                                
                                users.map((user) => (
                                    <tr key={user.id} className="bg-gray-100" >
                                        <td className="border border-gray-400 px-4 py-2">{user.nome} {user.apelido}</td>
                                        <td className="border border-gray-400 px-4 py-2">{user.email}</td>
                                        <td className="border border-gray-400 px-4 py-2">{user.telefone}</td>
                                        <td className="border border-gray-400 px-4 py-2">{user.funcao}</td>
                                        <td className="border border-gray-400 px-4 py-2">{user.departamento}</td>
                                        <td 
                                            className="border border-gray-400 px-4 py-2 text-center"
                                        >
                                            <span className={`p-1 rounded px-2 ${user.estado === "Ativo" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{user.estado}</span>
                                        
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2 ">
                                            <div className="flex justify-end items-center gap-3
                                            ">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user); 
                                                        setShowUserInfo(true)
                                                    }}
                                                    
                                                    className="bg-slate-600 hover:bg-slate-400 text-white rounded p-2 text-sm  transition-all cursor-pointer flex items-center gap-2"
                                                    title="Visualizar"
                                                >
                                                    <FiEye size={17} color="#fff"/>
                                                </button>
                                                {showUserInfo && selectedUser && (
                                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                                        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
                                                            {/* Header */}
                                                            <div className="flex flex-col items-center mb-4">
                                                                <h2 className="text-xl font-bold text-center">{selectedUser.nome} {selectedUser.apelido}</h2>
                                                                <p className="text-gray-500 text-center">{selectedUser.funcao} — {selectedUser.departamento}</p>
                                                            </div>

                                                            {/* Dados principais */}
                                                            <div className="grid grid-cols-1 gap-3 text-gray-700 text-sm">
                                                                <div>
                                                                    <span className="font-semibold">Email:</span> {selectedUser.email}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Telefone:</span> {selectedUser.telefone}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Morada:</span> {selectedUser.morada}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Género:</span> {selectedUser.genero}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Data Nascimento:</span> {formatDate(selectedUser.dataNascimento)}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Contrato:</span> {selectedUser.contrato}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Estado:</span> {selectedUser.estado}
                                                                </div>
                                                            
                                                            </div>
                                                            {/* Ações */}
                                                            <div className="flex gap-3 mt-6">
                                                                <button
                                                                    onClick={() => setShowUserInfo(false)}
                                                                    className="flex-1 py-2 border rounded-md font-medium hover:bg-gray-100 transition"
                                                                >
                                                                    Fechar
                                                                </button>
                                                                <Link
                                                                    href={`/dashboard/colaboradores/editar/${selectedUser.id}`}
                                                                    className="bg-zinc-800 hover:bg-zinc-500 text-white border-0 text-sm rounded p-2  cursor-pointer flex items-center gap-2"
                                                                    title="Editar"
                                                                >
                                                                    Editar
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <Link
                                                    href={`/dashboard/colaboradores/editar/${user.id}`}
                                                    className="bg-zinc-800 hover:bg-zinc-500 text-white border-0 text-sm rounded p-2  cursor-pointer flex items-center gap-2"
                                                    title="Editar"
                                                >
                                                    <FiEdit size={17} color="#fff"/>
                                                </Link>
                                                <button
                                                    onClick={() => setShowModal(true)}
                                                    
                                                    className="bg-red-500 hover:bg-red-300 text-white rounded p-2 text-sm  transition-all cursor-pointer flex items-center gap-2"
                                                    title="Excluir"
                                                >
                                                    <FiTrash size={17} color="#fff"/>
                                                </button>

                                                {showModal && (
                                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                                        <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 animate-fadeIn">
                                                            <div className="flex flex-col items-center">
                                                            <h2 className="text-xl font-bold mb-1 text-center">Deseja excluir o colaborador?</h2>
                                                            <p className="text-gray-500 text-center mb-4">
                                                                Ao excluir este colaborador, a ação será permanente e não poderá ser revertida.
                                                            </p>
                                                            <div className="flex gap-3 w-full">
                                                                <button
                                                                onClick={() => setShowModal(false)}
                                                                className="flex-1 py-2 border cursor-pointer rounded-md font-medium hover:bg-gray-100 transition"
                                                                >
                                                                Cancelar
                                                                </button>
                                                                <button
                                                                onClick={() => handleDeleteUser(user)}
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
                                    
                                ))
                                
                            ) }
                    </tbody>
                </table>
            </div>

           
        </main>
    )
}