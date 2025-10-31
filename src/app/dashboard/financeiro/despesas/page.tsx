"use client"
import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/userRole";
import { db } from "@/services/firebaseConnection";
import { getDocs, collection, orderBy, query, doc, deleteDoc, Query, where } from "firebase/firestore";
import Container from "@/components/container";
import Link from "next/link";
import { DespesaProps } from "@/utils/despesas";
import { HiDocumentAdd } from "react-icons/hi";
import { formatDate } from "@/utils/despesas/formatDate";
import { formatCurrency } from "@/utils/formatNumber";
import toast from "react-hot-toast";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import { exportTablePDF, exportDespesaPDF } from "@/utils/despesas/exportPDF";

const tableHeader = [
    "Entidade",
    "Valor",
    "Data de Emissão",
    "Data de vencimento",
    "Metodo de Pagamento",
    "Estado",
    "Acções"
    
]
export default function Despesas(){

    const [despesas, setDespesas] = useState<DespesaProps[]>([]);
    const [showDetail, setShowDetail] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [estadoFilter, setEstadoFilter] = useState("");
    const [selectDespesa, setSelectDespesa] = useState<DespesaProps | null>(null)
    const {role} = useUserRole();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDespesas() {
          try {
            const getRef = collection(db, "despesas");
            const queryRef = query(getRef, orderBy("criadoEm", "asc"));
            const snapshot = await getDocs(queryRef);
    
            const listaDespesas: DespesaProps[] = [];
    
            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
    
                // const dataEmissao = data.dataEmissao?.toDate?.().toISOString().split("T")[0] || data?.dataEmissao || "";
                // const dataVencimento = data.dataVencimento?.toDate?.() || data?.dataVencimento || "";

                // Ao carregar
                const dataEmissao = data.dataEmissao?.toDate?.() || new Date(data.dataEmissao);
                const dataVencimento = data.dataVencimento?.toDate?.() || new Date(data.dataVencimento);

    
                listaDespesas.push({
                    despesaId: docSnap.id,
                    entidade: data.entidade || "",
                    valor: data.valor || 0,
                    descricao: data.descricao || "",
                    dataVencimento,
                    dataEmissao,
                    estado: data.estado || "",
                    metodoPagamento: data.metodoPagamento || "",
                    criadoEm: new Date(),
                    atualizadoEm: new Date(),
                    criadoPor: {
                    uid: data.criadoPor?.uid || "",
                    nome: data.criadoPor?.nome || "",
                    },
                });
            });
    
            setDespesas(listaDespesas);
            setLoading(false)
          } catch (error) {
            toast.error("Erro ao carregar a lista de despesas");
            console.error(error);
          } finally {
            setLoading(false);
          }
        }
    
        loadDespesas();
    }, []);

    async function handleDeleteDespesa(despesa: DespesaProps){
        try {
            const getRef = doc(db, "despesas", despesa.despesaId)
            await deleteDoc(getRef)
            toast.success("Despesa excluída com sucesso!");
            setDespesas(prev => prev.filter(d => d.despesaId !== despesa.despesaId))
            setShowModal(false)

        } catch (error) {
            toast.error("Erro ao excluir a despesa");
            return 
        }
        
    }

    async function handleSearch() {
        let q: Query = collection(db, "despesas");
      

        if (estadoFilter && estadoFilter !== "all") {
          q = query(q, where("estado", "==", estadoFilter));
        }
      

        if (search.trim() !== "") {
          q = query(
            q,
            where("entidade", ">=", search),
            where("entidade", "<=", search + "\uf8ff")
          );
        }
      

        if (search.trim() === "" && (estadoFilter === "" || estadoFilter === "all")) {
          q = query(q, orderBy("criadoEm", "asc"));
        }
      
        const snapshot = await getDocs(q);
        const results: DespesaProps[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            despesaId: doc.id,
            entidade: data.entidade || "",
            valor: data.valor || 0,
            descricao: data.descricao || "",
            dataVencimento: data.dataVencimento?.toDate?.() || new Date(data.dataVencimento),
            dataEmissao: data.dataEmissao?.toDate?.() || new Date(data.dataEmissao),
            estado: data.estado || "",
            metodoPagamento: data.metodoPagamento || "",
            criadoEm: new Date(),
            atualizadoEm: new Date(),
            criadoPor: {
              uid: data.criadoPor?.uid || "",
              nome: data.criadoPor?.nome || "",
            },
          };
        });
      
        setDespesas(results);
    }
      
    useEffect(() => {
        handleSearch()
    }, [search, estadoFilter])

    if(loading){
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
                    {(role === "Admin" || role === "Editor") && (
                        <Link   
                            href="/dashboard/financeiro/despesas/cadastro/"
                            className="bg-black flex items-center text-white rounded gap-2 text-sm font-extrabold px-4 py-2 cursor-pointer"
                        >
                            Nova Despesa
                            <HiDocumentAdd size={20} color="#fff"/>
                        </Link>
                    )}
                </div>
                <div className="flex items-center justify-between my-6 gap-2">
                    <div className="flex items-center flex-1 gap-2 ">
                        <input 
                            type="text"
                            placeholder="Digite o nome da despesa...."
                            className="border rounded px-3 py-1.5 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)} 
                        
                        />
                        <select
                            value={estadoFilter}
                            onChange={(e) => setEstadoFilter(e.target.value)}
                            className="border rounded px-2 py-2"
                        >
                            <option value="all">Todos</option>
                            <option value="Pago">Concluído</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Cancelada">Cancelada</option>
                        </select>

                    </div>
                    <button
                    onClick={() => { exportTablePDF(despesas)}}
                    className="bg-black text-white text-sm px-4 py-2 cursor-pointer rounded"
                    >
                    Exportar PDF
                    </button>
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
                        <tbody>
                            {despesas.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="border border-gray-400 text-center font-bold py-4">
                                            {search ? `Nenhuma despesa encontrada para "${search}" 🔍` : "Sem despesas cadastradas no sistema!"}
                                        </td>
                                    </tr>
                                ):(
                                    despesas.map((despesa) => (
                                    <tr key={despesa.despesaId} className="bg-gray-100">
                                        <td className="border border-gray-400 px-4 py-2">{despesa.entidade}</td>
                                        <td className="border border-gray-400 px-4 py-2">{formatCurrency(Number(despesa.valor))}</td>
                                        <td className="border border-gray-400 px-4 py-2 hidden sm:table-cell">{formatDate(despesa.dataEmissao)}</td>
                                        <td className="border border-gray-400 px-4 py-2">{formatDate(despesa.dataVencimento)}</td>
                                        <td className="border border-gray-400 px-4 py-2">{despesa.metodoPagamento}</td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <span
                                                className={`text-white px-2 py-1 rounded ${
                                                    despesa.estado === "Pago" ? "bg-green-500" : despesa.estado === "Pendente" ? "bg-yellow-500 " : "bg-red-500"}
                                                `}
                                            >
                                                {despesa.estado}
                                            </span>
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setShowDetail(true)
                                                        setSelectDespesa(despesa)
                                                    }}
                                                    className="bg-transparent rounded p-2 text-sm  transition-all  hover:bg-zinc-100 cursor-pointer flex items-center border border-bg-black gap-2"
                                                    title="Visualizar"
                                                >
                                                    <FiEye size={17} color="#000"/>
                                                </button>

                                                {showDetail && selectDespesa && (
                                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                                        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
                                                            
                                                            <div className="flex flex-col items-center mb-4">
                                                                <h2 className="text-xl font-bold text-center">{selectDespesa.entidade}</h2>
                                                                <p className="text-gray-500 text-center text-sm mt-2">{selectDespesa.descricao}</p>
                                                            </div>

                                                    
                                                            <div className="grid grid-cols-1 gap-3 text-gray-700 text-sm">
                                                                <div>
                                                                    <span className="font-semibold">Valor:</span> {formatCurrency(Number(selectDespesa.valor))}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Data de emissão:</span> {formatDate(selectDespesa.dataEmissao)}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Data de Vencimento:</span> {formatDate(selectDespesa.dataVencimento)}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Metódo de pagamento:</span> {selectDespesa.metodoPagamento}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Estado:</span> {selectDespesa.estado}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Descrição:</span> {selectDespesa.descricao}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Criada por:</span> {selectDespesa.criadoPor.nome}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Criada em:</span> {formatDate(selectDespesa.criadoEm)}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex gap-3 mt-6">
                                                                <button
                                                                    onClick={() => { selectDespesa &&
                                                                        exportDespesaPDF(selectDespesa)
                                                                    }}
                                                                    className="flex-1 py-2 border rounded-md font-medium bg-black text-white cursor-pointer transition"
                                                                >
                                                                    Exportar PDF
                                                                </button>
                                                                <button
                                                                    onClick={() => setShowDetail(false)}
                                                                    className="flex-1 py-2 border rounded-md font-medium hover:bg-zinc-100 cursor-pointer transition"
                                                                >
                                                                    Fechar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {(role === "Admin" || role === "Editor") && (
                                                    <Link href={`/dashboard/financeiro/despesas/editar/${despesa.despesaId}`}
                                                        onClick={() => {}}
                                                        className="bg-zinc-800 rounded p-2 text-sm  transition-all  hover:bg-zinc-900 duration-300 cursor-pointer flex items-center gap-2"
                                                        title="Visualizar"
                                                    >
                                                        <FiEdit size={17} color="#fff"/>
                                                    </Link>
                                                )}
                                            
                                                {role === "Admin" && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectDespesa(despesa)
                                                            setShowModal(true)
                                                        }}
                                                        className="bg-red-500 rounded p-2 text-sm  transition-all  hover:bg-red-600 duration-300 cursor-pointer flex items-center gap-2"
                                                        title="Excluir"
                                                    >
                                                        <FiTrash size={17} color="#fff"/>
                                                    </button>
                                                )}
                                                
                                                
                                            </div>
                                        </td>
                                    </tr>   
                                ))
                            )}
                        </tbody>
                    </table>
                    {showModal && selectDespesa && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
                                <div className="flex flex-col items-center">
                                    <h2 className="text-xl font-bold mb-1 text-center">Deseja excluir a despesa?</h2>
                                    <p className="text-gray-500 text-center mb-4">
                                        Ao excluir este despesa, a ação será permanente e não poderá ser revertida.
                                    </p>
                                    <div className="flex gap-3 w-full">
                                        <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-2 border cursor-pointer rounded-md font-medium hover:bg-gray-100 transition"
                                        >
                                        Cancelar
                                        </button>
                                        <button
                                            onClick={() => {handleDeleteDespesa(selectDespesa)}}
                                            className="flex-1 py-2 bg-red-500 cursor-pointer text-white rounded-md font-medium hover:bg-red-600 duration-300 transition"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </Container>
    );
}