import {User} from "../props/User";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {loginApi, registerApi} from "../api/AuthApi";
import axios from "axios";

type UserContextType = {
    user: User | null;
    token: string | null;

    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loggedIn: boolean;

    loading: boolean;
    error: string | null;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (token && user) {
            setToken(token);
            setUser(JSON.parse(user));
            setLoggedIn(true);

            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        }
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    const register = async (username: string, email: string, password: string): Promise<void> => {
        setLoading(true);
        setError(null);

        await registerApi(username, email, password).then((res) => {
            if (res) {
                localStorage.setItem("token", res?.token);
                localStorage.setItem("user", JSON.stringify({username: res?.username, role: res?.role}));
                setToken(res?.token);
                setUser({username: res?.username, role: res?.role});
                setLoggedIn(true);

                axios.defaults.headers.common["Authorization"] = "Bearer " + res.token;
            }
        }).catch((err) => {
            setError(err.response?.data ?? 'An error occurred');
        }).finally(() => {
            setLoading(false);
        });
    }

    const login = async (username: string, password: string): Promise<void> => {
        setLoading(true);
        setError(null);

        await loginApi(username, password).then((res) => {
            if (res) {
                localStorage.setItem("token", res?.token);
                localStorage.setItem("user", JSON.stringify({username: res?.username, role: res?.role}));
                setToken(res?.token);
                setUser({username: res?.username, role: res?.role});
                setLoggedIn(true);

                axios.defaults.headers.common["Authorization"] = "Bearer " + res.token;
            }
        }).catch((err) => {
            setError(err.response?.data ?? 'An error occurred');
        }).finally(() => {
            setLoading(false);
        });
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setLoggedIn(false);

        delete axios.defaults.headers.common["Authorization"];
    }

    return (
        <UserContext.Provider value={{ user, token, login, register, logout, loggedIn, loading, error }}>
            {isReady ? children : null}
        </UserContext.Provider>
    )
}

export const useAuth = () => useContext(UserContext);
