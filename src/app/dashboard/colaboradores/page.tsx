"use client";

import { useEffect, useState } from "react";
import { db } from "@/services/firebaseConnection";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { HiUserAdd } from "react-icons/hi";
import { FiEdit, FiTrash } from "react-icons/fi";
import "./../../globals.css";


interface UserProps{
    id: string,
    nome: string;
    apelido: string;
    email: string;
    telefone: string;
    funcao: string;
    departamento: string;
    estado: string;
}

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
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        
        async function getUsers() {
            const getRef = collection(db, "colaboradores");
            const queryRef = query(getRef, orderBy("criadoEm", "asc"));

            getDocs(queryRef)
            .then((snapshot) => {

                let usersList = [] as UserProps[];

                snapshot.forEach((doc) => {
                    usersList.push({
                        id: doc.id,
                        nome: doc.data().nome,
                        apelido: doc.data().apelido,
                        email: doc.data().email,
                        funcao: doc.data().funcao,
                        departamento: doc.data().departamento,
                        telefone: doc.data().telefone,
                        estado: doc.data().estado
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
    


    if(loading){
        return <p>A carregar usuários....</p>
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
                                                className="bg-zinc-800 hover:bg-zinc-500 text-white border-0 text-sm rounded p-2  cursor-pointer flex items-center gap-2"
                                                title="Editar"
                                            >
                                               <FiEdit size={17} color="#fff"/>
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-300 text-white rounded p-2 text-sm  transition-all cursor-pointer flex items-center gap-2"
                                                title="Excluir"
                                            >
                                                <FiTrash size={17} color="#fff"/>
                                            </button>
    
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