import { useEffect, useState } from "react";
import { AuthContext } from "./auth.context";
import { getMe } from "./services/auth.api";

export const AuthProvider=({children})=>{
    const [user,setuser]=useState(null)
    const [loading,setloading]=useState(true)

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const data = await getMe()
                setuser(data?.user || null)
            } catch {
                setuser(null)
            } finally {
                setloading(false)
            }
        }

        initializeAuth()
    }, [])

    return (
        <AuthContext.Provider value={{user,setuser,loading,setloading}}>
            {children}
        </AuthContext.Provider>
    )
}
