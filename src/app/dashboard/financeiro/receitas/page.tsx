"use client"

import { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/userRole";
import { ReceitaProps } from "@/utils/receitas";
import Link from "next/link";
import { HiDocumentAdd } from "react-icons/hi";
import { formatCurrency } from "@/utils/formatNumber";
import { formatDate } from "@/utils/despesas/formatDate";
import { collection, deleteDoc, doc, getDocs, orderBy, Query, query, where } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";
import toast from "react-hot-toast";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import { exportReceitaPDF, exportTablePDF } from "@/utils/receitas/exportPDF";


const tableHeaders = [
  "Categoria",
  "Descrição da Receita",
  "Valor",
  "Metodo de pagamento",
  "Estado",
  "Acções"
  
]
export default function Receitas(){
    const [receitas, setReceitas] = useState<ReceitaProps[]>([])
    const [showDetail, setShowDetail] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectReceita, setSelectReceita] = useState<ReceitaProps | null>(null)
    const [loading, setLoading] = useState(true)
    const [estadoFilter, setEstadoFilter] = useState("");
    const [search, setSearch] = useState("");
    const {role} = useUserRole();

    useEffect(() => {
      async function loadReceitas(){
        try {
          const getRef = collection(db, "receitas");
          const queryRef = query(getRef, orderBy("criadoEm", "asc"));
          const snapshot = await getDocs(queryRef)

          let listaReceitas = [] as ReceitaProps[];

          snapshot.forEach((doc) => {

            const dados = doc.data();
            const data = dados.data?.toDate?.() || new Date(dados.data);

            listaReceitas.push({
              receitaId: doc.id,
              descricao: dados.descricao || "",
              valor: Number(dados.valor) || 0,
              categoria: dados.categoria || "",
              data,
              metodoPagamento: dados.metodoPagamento || "",
              estado: dados.estado || "",
              observacoes: dados.observacoes || "",
              criadoEm: new Date(),
              atualizadoEm: new Date(),
              criadoPor: {
                  uid: dados.criadoPor?.uid || "",
                  nome: dados.criadoPor?.nome || ""
              }

            })

            setReceitas(listaReceitas);
            setLoading(false)

          })
        } catch (error) {
          toast.error("Erro ao carregar a lista de receitas");
          console.error(error);
        }finally {
          setLoading(false);
        }
        

      }

      loadReceitas()
    }, [])

    async function handleDeleteReceita(receita: ReceitaProps){
      try { 
        console.log("Receita recebida para deletar:", receita);
        const getRef = doc(db, "receitas", receita.receitaId);
        await deleteDoc(getRef)
        toast.success("Receita excluída com sucesso!");
        setReceitas(prev => prev.filter(r => r.receitaId !== receita.receitaId ))
        setShowModal(false)
      } catch (error) {
        toast.error("Erro ao excluir a receita")
        console.log(error)
      }
      

    }

    async function handleSearch() {
      let q: Query = collection(db, "receitas");
    

      if (estadoFilter && estadoFilter !== "all") {
        q = query(q, where("estado", "==", estadoFilter));
      }
    

      if (search.trim() !== "") {
        q = query(
          q,
          where("categoria", ">=", search),
          where("categoria", "<=", search + "\uf8ff")
        );
      }
    

      if (search.trim() === "" && (estadoFilter === "" || estadoFilter === "all")) {
        q = query(q, orderBy("criadoEm", "asc"));
      }
    
        const snapshot = await getDocs(q);
        const results: ReceitaProps[] = snapshot.docs.map((doc) => {
        const dados = doc.data();
        return {
          receitaId: doc.id,
          descricao: dados.descricao || "",
          valor: Number(dados.valor),
          categoria: dados.categoria,
          data:  dados.data.toDate?.() || new Date(dados.data),
          metodoPagamento: dados.metodoPagamento,
          estado: dados.estado,
          observacoes: dados.observacoes || "",
          criadoEm: new Date(),
          atualizadoEm: new Date(),
          criadoPor: {
              uid: dados.uid || "",
              nome: dados.displayName || "Sem nome",
          }
          
        };
      });
    
      setReceitas(results);
  }
    
  useEffect(() => {
      handleSearch()
  }, [search, estadoFilter])

  if(loading){
      return(
          <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600"></div>
            <p className="text-gray-600 font-medium">Carregando receitas...</p>
          </div>
      )
  }
  return(
    <>
      <div className="flex justify-between">
          <h2 className="font-bold">Receitas cadastradas no sistema</h2>
          {(role === "Admin" || role === "Editor") && (
            <Link   
              href="/dashboard/financeiro/receitas/cadastro"
              className="bg-black flex items-center text-white rounded gap-2 text-sm font-extrabold px-4 py-2 cursor-pointer"
            >
              Nova Receita
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
                onChange={(e) => {setSearch(e.target.value)} } 
            
            />
            <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="border rounded px-2 py-2"
            >
                <option value="all">Todos</option>
                <option value="Recebida">Recebida</option>
                <option value="Pendente">Pendente</option>
                <option value="Cancelada">Cancelada</option>
            </select>

        </div>
        <button
          onClick={() => { exportTablePDF(receitas)}}
          className="bg-black text-white text-sm px-4 py-2 cursor-pointer rounded"
        >
          Exportar PDF
        </button>
      </div>
      <section>
          <table className="w-full mt-8">
              <thead>
                <tr>
                  {tableHeaders.map(header => (
                      <th className="border border-gray-400 px-4 py-2 text-gray-800" key={header}>      {header}
                      </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {receitas.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="border border-gray-400 text-center font-bold py-4">
                            {search ? `Nenhuma receita encontrada para "${search}" 🔍` : "Sem receitas cadastradas no sistema!"}
                        </td>
                    </tr>
                ) : (

                  receitas.map((receita) => (
                    <tr key={receita.receitaId} className="bg-gray-100">
                      <td className="border border-gray-400 px-4 py-2">{receita.categoria}</td>
                      <td className="border border-gray-400 px-4 py-2">{receita.descricao}</td>
                      <td className="border border-gray-400 px-4 py-2">{formatCurrency(receita.valor)}</td>
                      <td className="border border-gray-400 px-4 py-2">{receita.metodoPagamento}</td>
                      <td className="border border-gray-400 px-4 py-2">
                        <span
                          className={`text-white px-2 py-1 rounded 
                            ${receita.estado === "Recebida" ? "bg-green-500" : 
                              receita.estado === "Pendente" ? "bg-yellow-500 " : 
                              "bg-red-500" }
                          `}
                        >
                        {receita.estado}
                        </span>
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button
                              onClick={() => {
                                setSelectReceita(receita)
                                setShowDetail(true)
                              }}
                              className="bg-transparent rounded p-2 text-sm  transition-all  hover:bg-zinc-100 cursor-pointer flex items-center border border-bg-black gap-2"
                              title="Visualizar"
                          >
                              <FiEye size={17} color="#000"/>
                          </button>

                          {showDetail && selectReceita && (
                              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                  <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
                                      
                                      <div className="flex flex-col items-center mb-4">
                                          <h2 className="text-xl font-bold text-center">Detalhes da Receita</h2>
                                          <p className="text-gray-500 text-center text-sm mt-2">{selectReceita.categoria}</p>
                                      </div>

                              
                                      <div className="grid grid-cols-1 gap-3 text-gray-700 text-sm">
                                          <div>
                                              <span className="font-semibold">Descrição:</span> {selectReceita.descricao}
                                          </div>
                                          <div>
                                              <span className="font-semibold">Valor:</span> {formatCurrency(Number(selectReceita.valor))}
                                          </div>
                                          
                                          <div>
                                              <span className="font-semibold">Data de recebimento:</span> {formatDate(selectReceita.data)}
                                          </div>
                                          <div>
                                              <span className="font-semibold">Metódo de pagamento:</span> {selectReceita.metodoPagamento}
                                          </div>
                                          <div>
                                              <span className="font-semibold">Estado:</span> {selectReceita.estado}
                                          </div>
                                          <div>
                                              <span className="font-semibold">Observações:</span> {selectReceita.observacoes}
                                          </div>
                                          <div>
                                              <span className="font-semibold">Criada por:</span> {selectReceita.criadoPor.nome}
                                          </div>
                                          <div>
                                              <span className="font-semibold">Criada em:</span> {formatDate(selectReceita.criadoEm)}
                                          </div>
                                      </div>
                                      
                                      <div className="flex gap-3 mt-6">
                                          <button
                                              onClick={() => {
                                                
                                                selectReceita && exportReceitaPDF(selectReceita)
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
                              <Link href={`/dashboard/financeiro/receitas/editar/${receita.receitaId}`}
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
                                    setSelectReceita(receita)
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
          {showModal && selectReceita && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
                  <div className="flex flex-col items-center">
                      <h2 className="text-xl font-bold mb-1 text-center">Deseja excluir a receita?</h2>
                      <p className="text-gray-500 text-center mb-4">
                          Ao excluir esta receita, a ação será permanente e não poderá ser revertida.
                      </p>
                      <div className="flex gap-3 w-full">
                          <button
                          onClick={() => setShowModal(false)}
                          className="flex-1 py-2 border cursor-pointer rounded-md font-medium hover:bg-gray-100 transition"
                          >
                          Cancelar
                          </button>
                          <button
                              onClick={() => {handleDeleteReceita(selectReceita)}}
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
    </>
      
  )
}