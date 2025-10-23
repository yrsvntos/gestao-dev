"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { db } from "@/services/firebaseConnection"
import { getDocs, doc, query, orderBy, collection, deleteDoc } from "firebase/firestore"
import { formatDate } from "@/utils/user/formatDate"
import { ProjectosProps } from "@/utils/projectos"
import toast from "react-hot-toast"
import { HiFolderAdd } from "react-icons/hi"
import { FiEdit, FiEye, FiTrash } from "react-icons/fi"
import { formatCurrency } from "@/utils/formatNumber"
import { exportProjectoPDF, exportTablePDF } from "@/utils/projectos/exportPDF"
import { useUserRole } from "@/hooks/userRole"



const tableHeader = [
    "Nome do Projecto",
    "Responsável",
    "Departamento",
    "Cliente",
    "Início",
    "Fim Previsto",
    "Orçamento",
    "Estado",
    "Ações"
]


export default function Projectos(){
    
    const [projectos, setProjectos] = useState<ProjectosProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [showProjectInfo, setShowProjectInfo] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selectedProject, setSelectedProject] = useState<ProjectosProps | null>(null)
    const {role} = useUserRole()

    useEffect(() => {

        async function getProjectos(){
            const getRef = collection(db, "projectos")
            const queryRef = query(getRef, orderBy("criadoEm", "asc"));

            getDocs(queryRef)
            .then((snapshot) => {

                let projectsList = [] as ProjectosProps[];

                snapshot.forEach((doc) => {
                    
                    const dataInicio = doc.data().dataInicio?.toDate?.().toISOString().split("T")[0] ||
                    doc.data()?.dataInicio ||
                    "";
                    const dataFimPrevista = doc.data().dataFimPrevista?.toDate?.().toISOString().split("T")[0] ||
                    doc.data()?.dataFimPrevista ||
                    "";
                    const dataFimReal = doc.data().dataFimReal?.toDate?.().toISOString().split("T")[0] ||
                    doc.data()?.dataFimReal ||
                    "";
                    
                    projectsList.push({
                        id: doc.id,
                        nome: doc.data().nome,
                        descricao: doc.data().descricao,
                        clienteId: doc.data().clienteId,
                        referencia: doc.data().referencia,
                        responsavel: doc.data().responsavel,
                        departamento: doc.data().departamento,
                        status: doc.data().status,
                        dataInicio: doc.data().dataInicio,
                        dataFimPrevista: doc.data()?.dataFimPrevista,
                        dataFimReal: doc.data()?.dataFimReal,
                        valorOrcamento: Number(doc.data().valorOrcamento),      
                        despesas: Number(doc.data().despesas),             
                        receitas: Number(doc.data().receitas),
                        criadoEm: new Date(),
                        atualizadoEm: new Date(),
                        criadoPor: {
                            uid: doc.data().uid,
                            nome: doc.data().displayName || "Sem nome",
                        },
                    })

                    setProjectos(projectsList)
                    setLoading(false)
                })
            })
            .catch((error) => {
                console.log(error)
                toast.error("Erro ao buscar a lista de projectos")
                setLoading(false);
            })
    
        }

        getProjectos()


    }, [])

    async function handleDeleteProjecto(projecto: ProjectosProps) {
        try {
            const docRef = doc(db, "projectos", projecto.id);
            await deleteDoc(docRef);
    
            toast.success("Projecto excluído com sucesso!");
            setProjectos(prev => prev.filter(p => p.id !== projecto.id));
            setShowModal(false);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao excluir projecto!");
        }
    }
    

    if(loading){
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600"></div>
              <p className="text-gray-600 font-medium">Carregando projectos...</p>
            </div>
          );
    }

    return(
        <main> 
            <div className="flex items-center justify-between">
                <h2 className="font-bold">Projectos cadastrados no sistema</h2>
                {role === "Admin" || role === "Editor" && (
                    <Link 
                        href="/dashboard/projectos/cadastro"
                        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-900 text-white text-sm font-extrabold rounded-md px-4 py-2"
                    >
                        Cadastrar projecto <HiFolderAdd size={18} />
                    </Link>
                )}
                
            </div>

            <div className="flex justify-end my-6 gap-2">
                <button
                onClick={() => { exportTablePDF(projectos)}}
                className="bg-black text-white text-sm px-4 py-1 cursor-pointer rounded"
                >
                Exportar PDF
                </button>
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
                        
                            {projectos.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center font-bold py-4">
                                        Sem projectos cadastrados no sistema!
                                    </td>
                                </tr>
                            ) : ( 
                                
                                projectos.map((projecto) => (
                                    <tr key={projecto.id} className="bg-gray-100" >
                                        <td className="border border-gray-400 px-4 py-2">{projecto.nome}</td>
                                        <td className="border border-gray-400 px-4 py-2">{projecto.responsavel}</td>
                                        <td className="border border-gray-400 px-4 py-2">{projecto.departamento}</td>
                                        <td className="border border-gray-400 px-4 py-2">{projecto.clienteId}</td>
                                        <td className="border border-gray-400 px-4 py-2">{formatDate(projecto.dataInicio)}</td>
                                        <td className="border border-gray-400 px-4 py-2">{formatDate(projecto.dataFimPrevista)}</td>
                                        <td className="border border-gray-400 px-4 py-2"> {formatCurrency(projecto.valorOrcamento)}</td>
                                        <td 
                                            className="border border-gray-400 px-4 py-2 text-center"
                                        >
                                            <span className={`p-1 rounded px-2 
                                                ${projecto.status === "Concluído"
                                                    ? "bg-green-500 text-white"
                                                    : projecto.status === "Em Andamento"
                                                    ? "bg-blue-500 text-white"
                                                    : projecto.status === "Pausado"
                                                    ? "bg-yellow-500 text-white"
                                                    : "bg-gray-500 text-white" // Planejado"

                                                }`}>{projecto.status}</span>
                                        
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2 ">
                                            <div className="flex justify-end items-center gap-3
                                            ">
                                                <button
                                                    onClick={() => {
                                                        setSelectedProject(projecto)
                                                        setShowProjectInfo(true)
                                                        
                                                    }}
                                                    
                                                    
                                                    className="bg-transparent rounded p-2 text-sm  transition-all  hover:bg-zinc-100 cursor-pointer flex items-center border border-bg-black gap-2"
                                                    title="Visualizar"
                                                >
                                                    <FiEye size={17} color="#000"/>
                                                </button>
                                                {showProjectInfo && selectedProject && (
                                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                                        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
                                                         
                                                            <div className="flex flex-col items-center mb-4">
                                                                <h2 className="text-xl font-bold text-center">{selectedProject.nome}</h2>
                                                                <p className="text-gray-500 text-center">{selectedProject.responsavel} — {selectedProject.departamento}</p>
                                                            </div>

                                    
                                                            <div className="grid grid-cols-1 gap-3 text-gray-700 text-sm">
                                                                <div>
                                                                    <span className="font-semibold">Cliente:</span> {selectedProject.clienteId}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Referência do projecto:</span> {selectedProject.referencia}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Descrição do Projecto:</span> {selectedProject.descricao}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Status:</span> {selectedProject.status}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Data Início:</span> {formatDate(selectedProject.dataInicio)}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Data de Fim Prevista:</span> {formatDate(selectedProject.dataFimPrevista)}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Data de Fim Real:</span> {formatDate(selectedProject.dataFimReal ? selectedProject.dataFimReal : "Não definida")}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Orçamento:</span> {formatCurrency(selectedProject.valorOrcamento)}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Despesas:</span> {formatCurrency(selectedProject.despesas)}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Receitas:</span> {formatCurrency(selectedProject.receitas)}
                                                                </div>
                                                                
                                                            
                                                            </div>
                                                            <div className="flex gap-3 mt-6">
                                                                <button
                                                                    onClick={() => selectedProject &&
                                                                        exportProjectoPDF(selectedProject)
                                                                    }
                                                                    className="flex-1 py-2 border rounded-md font-medium bg-black text-white cursor-pointer transition"
                                                                >
                                                                    Exportar PDF
                                                                </button>
                                                                <button
                                                                    onClick={() => setShowProjectInfo(false)}
                                                                    className="flex-1 py-2 border rounded-md font-medium hover:bg-zinc-100 cursor-pointer transition"
                                                                >
                                                                    Fechar
                                                                </button>
                                                                
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {(role === "Admin" || role === "Editor") && (
                                                    <Link
                                                        href={`/dashboard/projectos/editar/${projecto.id}`}
                                                        className="bg-zinc-800 hover:bg-zinc-500 text-white border-0 text-sm rounded p-2  cursor-pointer flex items-center gap-2"
                                                        title="Editar"
                                                    >
                                                        <FiEdit size={17} color="#fff"/>
                                                    </Link>
                                                    
                                                    
                                                )}

                                                {role === "Admin" && (
                                                    <button
                                                        onClick={() => {
                                                        setSelectedProject(projecto)
                                                        setShowModal(true)
                                                        }}
                                             
                                                        className="bg-red-500 hover:bg-red-300 text-white rounded p-2 text-sm  transition-all cursor-pointer flex items-center gap-2"
                                                        title="Excluir"
                                                    >
                                                        <FiTrash size={17} color="#fff"/>
                                                    </button>
                                                )}
                                                

                                                {showModal && (
                                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                                        <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 animate-fadeIn">
                                                            <div className="flex flex-col items-center">
                                                            <h2 className="text-xl font-bold mb-1 text-center">Deseja excluir o projecto?</h2>
                                                            <p className="text-gray-500 text-center mb-4">
                                                                Ao excluir este projecto, a ação será permanente e não poderá ser revertida.
                                                            </p>
                                                            <div className="flex gap-3 w-full">
                                                                <button
                                                                onClick={() => setShowModal(false)}
                                                                className="flex-1 py-2 border cursor-pointer rounded-md font-medium hover:bg-gray-100 transition"
                                                                >
                                                                Cancelar
                                                                </button>
                                                                <button
                                                                onClick={() => handleDeleteProjecto(projecto)}
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

            {role === "Visitante" && (
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>Você tem permissão para visualizar os projetos, mas não pode adicionar ou excluir. Contacte o administrador caso precises cadastrar algum projeto no sistema. 
                    </p>
                </div>
            )}
            {role === "Editor" && (
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>Você tem permissão para cadastrar e editar projetos, mas não pode excluí-los.
                    Contacte o administrador caso precises remover algum projeto do sistema.</p>
                </div>
            )}

           
        </main>
    )
}