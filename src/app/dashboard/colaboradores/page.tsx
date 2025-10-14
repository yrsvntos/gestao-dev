"use client";

import { useEffect, useState } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { HiUserAdd } from "react-icons/hi";
import "./../../globals.css";

interface UserProps{
    id: number;
    name: string;
    email: string;
    phone: string;
}

const tableHeader = [
    "ID",
    "Nome",
    "Email",
    "Telefone",
    "Ações"
]
const metadata: Metadata = {
    title: "Dashboard - Lista de Usuários Cadastrados",
    description: "A sua empresa no seu bolso",
};

export default function Usuarios(){

    const [users, setUsers] = useState<UserProps[]>([]);
    const [loading, setLoading] = useState(true)

    async function getUsers() {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const users = await response.json();
        setUsers(users);
        setLoading(false)
    }

    useEffect(() => {
        
        getUsers()
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
                    <tbody>
                        
                            {users.length === 0 && (
                                <p>Sem usuários cadastrados no sistema!</p>
                            )}
                            
                            {users.map((user) => (
                                <tr key={user.id} className="bg-gray-100" >
                                    <td className="border border-gray-400 px-4 py-2">{user.id}</td>
                                    <td className="border border-gray-400 px-4 py-2">{user.name}</td>
                                    <td className="border border-gray-400 px-4 py-2">{user.email}</td>
                                    <td className="border border-gray-400 px-4 py-2">{user.phone}</td>
                                    <td className="border border-gray-400 px-4 py-2 ">
                                        <div className="flex justify-end items-center gap-3
                                        ">
                                            <button
                                            className="bg-zinc-800 hover:bg-zinc-500 text-white border-0 text-sm rounded p-2  cursor-pointer font-extrabold"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-300 text-white rounded p-2 text-sm  transition-all cursor-pointer font-extrabold"
                                        >
                                            Excluir
                                        </button>

                                        </div>
                                        
                                    </td>
                                </tr>
                                
                            ))}
                            

                        
                    </tbody>
                </table>
            </div>

        </main>
    )
}