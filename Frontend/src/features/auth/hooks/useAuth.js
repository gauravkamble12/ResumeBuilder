import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setuser, loading, setloading } = context

    const handleLogin = async ({ email, password }) => {
        setloading(true)
        try {
            const data = await login({ email, password })
            setuser(data.user)
            return data
        } finally {
            setloading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setloading(true)
        try {
            const data = await register({ username, email, password })
            setuser(data.user)
            return data
        } finally {
            setloading(false)
        }
    }

    const handleLogout = async () => {
        setloading(true)
        try {
            await logout()
            setuser(null)
        } finally {
            setloading(false)
        }
    }

    return { user, loading, handleLogin, handleRegister, handleLogout }
}
