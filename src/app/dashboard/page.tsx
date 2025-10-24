"use client";

import { useState, useEffect } from "react";
import { db } from "@/services/firebaseConnection";
import { collection, getDoc, getDocs } from "firebase/firestore";
import Container from "@/components/container";

export default function Dashboard(){
    const [totalColaboradores, setTotalColaboradores] = useState<number>(0);
    const [totalProjects, setTotalProjects] = useState<number>(0);
    const [totalUsuarios, setTotalUsuarios] = useState<number>(0)

    useEffect(() => {
        async function getTotalColaboradores(){
            const snapshot = await getDocs(collection(db, "colaboradores"));
            setTotalColaboradores(snapshot.size);
        }
        getTotalColaboradores();
    }, [])

    useEffect(() => {
        async function getTotalProjects(){
            const snapshot = await getDocs(collection(db, "projectos"));
            setTotalProjects(snapshot.size);
        }
        getTotalProjects();
    }, [])

    useEffect(() => {
        async function getTotalUsuarios(){
            const snapshot = await getDocs(collection(db, "users"))
            setTotalUsuarios(snapshot.size)
        }
        getTotalUsuarios()
    }, [])

    return(
        <Container>
            <h1>Bem-vindo ao Dashboard</h1>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h2 className="text-black text-sm font-bold">Colaboradores</h2>
                    <p className="text-4xl font-bold text-zinc-800 mt-2">{totalColaboradores}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h2 className="text-black text-sm font-bold">Projectos</h2>
                    <p className="text-4xl font-bold text-zinc-800 mt-2">{totalProjects}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h2 className="text-black text-sm font-bold">Usuários</h2>
                    <p className="text-4xl font-bold text-zinc-800 mt-2">{totalUsuarios}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h2 className="text-black text-sm font-bold">Colaboradores</h2>
                    <p className="text-4xl font-bold text-zinc-800 mt-2">{}</p>
                </div>
            </div>    
        </Container>
    );
}