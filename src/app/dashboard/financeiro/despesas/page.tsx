"use client"

import Container from "@/components/container";
import Link from "next/link";
import { useState } from "react";
import { HiDocumentAdd } from "react-icons/hi";

const tableHeader = [
    "Entidade",
    "Valor",
    "Data de vencimento",
    "Estado",
    "Acções"
    
]
export default function Despesas(){

    const [loading, setLoadin] = useState(true);

    if(!loading){
        return(
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600"></div>
              <p className="text-gray-600 font-medium">Carregando despesas...</p>
            </div>
        )
    }
    return(
        <Container>
            <main>
                <div className="flex justify-between">
                    <h2 className="font-bold">Despesas cadastradas no sistema</h2>
                    <Link   
                        href="/dashboard/financeiro/despesas/cadastro/"
                        className="bg-black flex items-center text-white rounded gap-2 text-sm font-extrabold px-4 py-2 cursor-pointer"
                    >
                        Nova Despesa
                        <HiDocumentAdd size={20} color="#fff"/>
                    </Link>
                </div>
                <section>
                    <table className="w-full mt-8">
                        <thead>
                            <tr>
                                {tableHeader.map((header) => (
                                    <th key={header} className="border border-gray-400 px-4 py-2 text-gray-800">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    </table>
                </section>
            </main>
        </Container>
    );
}