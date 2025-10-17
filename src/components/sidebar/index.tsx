"use client";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  FiMenu,
  FiHome,
  FiUser,
  FiSettings,
  FiUsers,
  FiChevronDown,
  FiChevronRight,
  FiBriefcase,
} from "react-icons/fi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { AiOutlineBarChart } from "react-icons/ai";

type SidebarProps = {
  isOpen: boolean;
  toggle: () => void;
};

export default function Sidebar({ isOpen, toggle }: SidebarProps) {
  // Estados locais para controlar os submenus
  const [financeOpen, setFinanceOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  return (
    <aside
      className={clsx(
        "bg-gray-900 text-white h-screen transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Header */}
      <div className="relative p-4 border-b border-gray-700 flex items-center">
        <h1
          className={`text-2xl font-bold transition-opacity duration-300 ${
            !isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          Gestão<span className="text-emerald-500">Dev</span>
        </h1>
        <button
          onClick={toggle}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-800 transition"
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 mt-4 space-y-2 overflow-y-auto">
        {/* Início */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition"
        >
          <FiHome size={20} />
          {isOpen && <span>Início</span>}
        </Link>

        {/* Colaboradores */}
        <Link
          href="/dashboard/colaboradores"
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition"
        >
          <FiUsers size={20} />
          {isOpen && <span>Colaboradores</span>}
        </Link>

        {/* Projectos */}
        <Link
          href="/dashboard/projectos"
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition"
        >
          <FiBriefcase size={20} />
          {isOpen && <span>Projectos</span>}
        </Link>

        {/* Usuários */}
        <Link
          href="/dashboard/usuarios"
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition"
        >
          <FiUser size={20} />
          {isOpen && <span>Usuários</span>}
        </Link>

        {/* ===================== */}
        {/* Submenu: FINANCEIRO 💰 */}
        {/* ===================== */}
        <div>
          <button
            onClick={() => setFinanceOpen(!financeOpen)}
            className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-800 transition"
          >
            <div className="flex items-center gap-3">
              <MdOutlineAttachMoney size={20} />
              {isOpen && <span>Financeiro</span>}
            </div>
            {isOpen && (
              financeOpen ? (
                <FiChevronDown size={18} />
              ) : (
                <FiChevronRight size={18} />
              )
            )}
          </button>

          {/* Subopções */}
          {financeOpen && isOpen && (
            <div className="ml-8 mt-1 flex flex-col space-y-1 text-sm">
              <Link
                href="/dashboard/financeiro/despesas"
                className="block px-3 py-1 hover:bg-gray-800 rounded"
              >
                Despesas
              </Link>
              <Link
                href="/dashboard/financeiro/receitas"
                className="block px-3 py-1 hover:bg-gray-800 rounded"
              >
                Receitas
              </Link>
              <Link
                href="/dashboard/financeiro/contas"
                className="block px-3 py-1 hover:bg-gray-800 rounded"
              >
                Contas a Pagar / Receber
              </Link>
            </div>
          )}
        </div>

        {/* ===================== */}
        {/* Submenu: RELATÓRIOS 📊 */}
        {/* ===================== */}
        <div>
          <button
            onClick={() => setReportsOpen(!reportsOpen)}
            className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-800 transition"
          >
            <div className="flex items-center gap-3">
              <AiOutlineBarChart size={20} />
              {isOpen && <span>Relatórios</span>}
            </div>
            {isOpen && (
              reportsOpen ? (
                <FiChevronDown size={18} />
              ) : (
                <FiChevronRight size={18} />
              )
            )}
          </button>

          {reportsOpen && isOpen && (
            <div className="ml-8 mt-1 flex flex-col space-y-1 text-sm">
              <Link
                href="/dashboard/relatorios/financeiro"
                className="block px-3 py-1 hover:bg-gray-800 rounded"
              >
                Financeiros
              </Link>
              <Link
                href="/dashboard/relatorios/colaboradores"
                className="block px-3 py-1 hover:bg-gray-800 rounded"
              >
                Colaboradores
              </Link>
              <Link
                href="/dashboard/relatorios/projectos"
                className="block px-3 py-1 hover:bg-gray-800 rounded"
              >
                Projectos
              </Link>
            </div>
          )}
        </div>

        {/* Configurações */}
        <Link
          href="/dashboard/config"
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition"
        >
          <FiSettings size={20} />
          {isOpen && <span>Configurações</span>}
        </Link>
      </nav>
    </aside>
  );
}
