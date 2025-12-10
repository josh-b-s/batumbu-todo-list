import React, { createContext, useContext, useEffect, useState } from "react";

const LOGIN_KEY = "batumbu.login";

export interface AccountContextValue {
    account: string;
    login: (accountId: string) => void;
    logout: () => void;
    ready: boolean;
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
    const [account, setAccount] = useState<string>("");
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(LOGIN_KEY);
            setAccount(raw ? (JSON.parse(raw) as string) : "");
        } catch (e) {
            console.error("Account rehydrate failed", e);
            setAccount("");
        } finally {
            setReady(true);
        }
    }, []);

    const login = (accountId: string) => {
        setAccount(accountId);
        try {
            localStorage.setItem(LOGIN_KEY, JSON.stringify(accountId));
        } catch (e) {
            console.error("Failed to save login", e);
        }
    };

    const logout = () => {
        setAccount("");
        try {
            localStorage.removeItem(LOGIN_KEY);
        } catch (e) {
            console.error("Failed to remove login", e);
        }
    };

    return (
        <AccountContext.Provider value={{ account, login, logout, ready }}>
            {children}
        </AccountContext.Provider>
    );
}

export function useAccount(): AccountContextValue {
    const ctx = useContext(AccountContext);
    if (!ctx) throw new Error("useAccount must be used inside AccountProvider");
    return ctx;
}
