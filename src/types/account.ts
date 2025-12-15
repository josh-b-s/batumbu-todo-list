export type userRole = "client" | "engineer"

export interface User {
    role: userRole;
    name: string;
    pass: string;
}

export const accounts: Record<string, User> = {
    "test1@gmail.com": {pass: "pass", name: "test1", role: "engineer"},
    "test2@gmail.com": {pass: "pass", name: "test2", role: "client"},
};