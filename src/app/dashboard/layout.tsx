"use client";
import { useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/services/firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "GestãoDev | Dashboard",
  description: "O seu sistema administrativo"
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true); // estado do sidebar

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return;
  if (!user) return null; 

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />

      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6">{user && children}</main>
      </div>
    </div>
  );
}
