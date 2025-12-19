import React, {createContext, useContext, useState} from "react";

const LOGIN_KEY = "batumbu.login";

export interface AccountContextValue {
    account: string;
    login: (accountId: string) => void;
    logout: () => void;
}

export const AccountContext = createContext<AccountContextValue | undefined>(undefined);

export function AccountProvider({children}: { children: React.ReactNode }) {
    const [account, setAccount] = useState(() => {
        try {
            const raw = localStorage.getItem(LOGIN_KEY);
            return raw ? (JSON.parse(raw) as string) : "";
        } catch (e) {
            console.error("Getting account failed", e);
            return "";
        }
    });


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
        <AccountContext.Provider value={{account, login, logout}}>
            {children}
        </AccountContext.Provider>
    );
}

export function useAccount(): AccountContextValue {
    const ctx = useContext(AccountContext);
    if (!ctx) throw new Error("useAccount must be used inside AccountProvider");
    return ctx;
}
