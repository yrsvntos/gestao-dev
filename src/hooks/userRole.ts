import { useState, useEffect } from "react";
import { db } from "@/services/firebaseConnection";
import { auth } from "@/services/firebaseConnection";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";


interface UserRole{
    role: string | null;
    loading: boolean
}

export function useUserRole(): UserRole{
    const [role, setRole] = useState<string | null>(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            if(currentUser){
                const userDoc = await getDoc(doc(db, "users", currentUser?.uid))
                if(userDoc.exists()){
                    const data = userDoc.data();
                   setRole(data.role || null)
                }else{
                    setRole(null)
                }
            }else{
                setRole(null);
            }
            setLoading(false);
        })
        return () => unsub();
    }, [])

    return { role, loading };
}