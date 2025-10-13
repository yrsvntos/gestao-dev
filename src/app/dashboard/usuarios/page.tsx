"use client";

import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import Link from "next/link";
import { HiUserAdd } from "react-icons/hi";
import "./../../globals.css";

interface UserProps{
    id: number;
    name: string;
    email: string;
    phone: string;
}



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
    


    const columns = useMemo(() => [
            { accessorKey: 'id', header: 'ID'},
            { accessorKey: 'name', header: 'Name'},
            { accessorKey: 'email', header: 'Email'},
            { accessorKey: 'phone', header: 'Phone'}
        ], []
    )

    const table = useReactTable({
        data: users || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
      });

    if(loading){
        return <p>A carregar usuários....</p>
    }
    return(
        <main> 
            <div className="flex items-center justify-between">
                <h2 className="font-bold">Usuários cadastrados no sistema</h2>
                <Link 
                    href="/dashboard/usuarios/novo-usuario"
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-500 text-white rounded-md px-4 py-2"
                >
                    Novo usuário <HiUserAdd size={18} />
                </Link>
            </div>
            
            <div className="overflow-x-auto mt-6">
                <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className=" hover:bg-gray-100 transition-colors">
                        {headerGroup.headers.map((header) => (
                            <th key={header.id} className="text-left px-4 py-2 border-b">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-4 py-2 border border-gray-300">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </main>
    )
}