"use client";
import { FiMenu, FiHome, FiUser, FiSettings, FiUsers } from "react-icons/fi";
import Link from "next/link";
import clsx from "clsx";
import { BsFillSuitcase2Fill } from "react-icons/bs";

type SidebarProps = {
  isOpen: boolean;
  toggle: () => void;
};

export default function Sidebar({ isOpen, toggle }: SidebarProps) {

  return (
    <aside
      className={clsx(
        "bg-gray-900 text-white h-screen transition-all duration-300 flex flex-col",
        isOpen ? "w-60" : "w-20"
      )}
    >
      {/* Menu Header */}
      <div className="relative p-4 border-b border-gray-700 flex items-center">
      <h1
        className={`text-2xl font-bold transition-opacity duration-300 ${
          !isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
          Gestão<span className="text-emerald-500">Dev</span>
        </h1>
        <button onClick={toggle} className="absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-800 transition">
          <FiMenu size={22} />
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 mt-4 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition"
        >
          <FiHome size={20} />
          {isOpen && <span>Início</span>}
        </Link>

        <Link
          href="/dashboard/colaboradores"
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition"
        >
          <FiUsers size={20} />
          {isOpen && <span>Colaboradores</span>}
        </Link>

        <Link
          href="/dashboard/servicos"
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition"
        >
          <BsFillSuitcase2Fill size={20} />
          {isOpen && <span>Serviços</span>}
        </Link>

        <Link
          href="/dashboard/usuarios"
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition"
        >
          <FiUser size={20} />
          {isOpen && <span>Usuários</span>}
        </Link>

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
