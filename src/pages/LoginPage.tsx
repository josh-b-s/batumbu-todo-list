import React, {JSX, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import show from "../assets/show.png";
import hide from "../assets/hide.png";

const accounts: Record<string, string> = {
    "test1@gmail.com": "pass",
    "test2@gmail.com": "pass",
};

export default function LoginPage(): JSX.Element {

    const LOGIN_KEY = "batumbu.login";
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ email: boolean; password: boolean }>({
        email: false,
        password: false,
    });

    const [account, setAccount] = useState<string>(() => {
        try {
            const raw = localStorage.getItem(LOGIN_KEY);
            return raw ? (JSON.parse(raw) as string) : "";
        } catch (e) {
            console.error("Failed to parse login from storage", e);
            return "";
        }
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");
        setErrors({email: false, password: false});

        const emailTrim = (email || "").trim().toLowerCase();
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRe.test(emailTrim)) {
            setErrors((e) => ({...e, email: true}));
            setMessage("Please enter a valid email address (e.g. you@mail.com)");
            return;
        }

        if (!accounts[emailTrim]) {
            setErrors((e) => ({...e, email: true}));
            setMessage("Email not registered!");
            return;
        }

        if (!password) {
            setErrors((e) => ({...e, password: true}));
            setMessage("Please enter a password!");
            return;
        }

        if (accounts[emailTrim] !== password) {
            setErrors((e) => ({...e, password: true}));
            setMessage("Password incorrect!");
            return;
        }

        const trimmed = emailTrim;
        setAccount(trimmed);
        try {
            localStorage.setItem(LOGIN_KEY, JSON.stringify(trimmed));
        } catch (err) {
            console.error("Failed to save login state", err);
        }
    };

    useEffect(() => {
        if (account) navigate("/activities");
    }, [account, navigate]);

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (errors.email) setErrors((s) => ({...s, email: false}));
        setMessage("");
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (errors.password) setErrors((s) => ({...s, password: false}));
        setMessage("");
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="p-7 w-100 bg-white rounded-xl shadow-2xl space-y-4">
                <h1 className="font-bold text-center text-2xl">Batumbu Internship Management</h1>

                <label>Email</label>
                <input
                    type="text"
                    value={email}
                    onChange={onEmailChange}
                    className={`p-1 rounded-md focus:outline-2 w-full border ${
                        errors.email ? "border-red-500 ring-1 ring-red-300" : "border-gray-300"
                    }`}
                />

                <label>Password</label>

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={onPasswordChange}
                        className={`p-1 rounded-md focus:outline-2 w-full pr-10 border ${
                            errors.password ? "border-red-500 ring-1 ring-red-300" : "border-gray-300"
                        }`}
                        placeholder=""
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
                        aria-pressed={showPassword}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <img src={hide} alt="hide" className="h-5 w-5"/> :
                            <img src={show} alt="show" className="h-5 w-5"/>}
                    </button>
                </div>

                <p className="text-center text-red-800">{message}</p>

                <input
                    type="submit"
                    value="Login"
                    className="bg-batumbured rounded-xl text-white font-bold opacity-80 hover:opacity-100 cursor-pointer w-full py-2"
                />
            </form>
        </div>
    );
}
