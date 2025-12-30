export type userRole = "client" | "engineer"

export interface User {
    role: userRole;
    name: string;
    pass: string;
}

export interface UserComment {
    id: string;
    user: User;
    date: Date;
    comment: string
}

export const accounts: Record<string, User> = {
    "eng1@gmail.com": {pass: "pass", name: "eng1", role: "engineer"},
    "eng2@gmail.com": {pass: "pass", name: "eng2", role: "engineer"},
    "cli1@gmail.com": {pass: "pass", name: "cli1", role: "client"},
    "cli2@gmail.com": {pass: "pass", name: "cli2", role: "client"},
};