"use client";

import { useState, useEffect } from "react";
import { db } from "@/services/firebaseConnection";
import { collection, getDocs } from "firebase/firestore";
import Container from "@/components/container";
import { error } from "console";

export default function Dashboard(){
    const [totalUsers, setTotalUsers] = useState<number>(0);

    useEffect(() => {
        async function getTotalUsers(){
            const snapshot = await getDocs(collection(db, "colaboradores"));
            setTotalUsers(snapshot.size);
        }
        getTotalUsers();
    }, [])

    return(
        <Container>
            <h1>Bem-vindo ao Dashboard</h1>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h2 className="text-black text-sm font-bold">Colaboradores</h2>
                    <p className="text-4xl font-bold text-zinc-800 mt-2">{totalUsers}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h2 className="text-black text-sm font-bold">Projectos</h2>
                    <p className="text-4xl font-bold text-zinc-800 mt-2">{totalUsers}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h2 className="text-black text-sm font-bold">Colaboradores</h2>
                    <p className="text-4xl font-bold text-zinc-800 mt-2">{totalUsers}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h2 className="text-black text-sm font-bold">Colaboradores</h2>
                    <p className="text-4xl font-bold text-zinc-800 mt-2">{totalUsers}</p>
                </div>
            </div>    
        </Container>
    );
}