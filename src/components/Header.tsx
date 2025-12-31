import React, {JSX, useState} from "react";
import ConfirmModal from "./ConfirmModal";
import {useAccount} from "../contexts/AccountContext.tsx";
import AccountDropdown from "./AccountDropdown.tsx";
import {useTheme} from "../hooks/useTheme.ts"
import {IoSunnyOutline} from "react-icons/io5";
import {MdOutlineDarkMode} from "react-icons/md";

/**
 * Menampilkan header aplikasi dengan judul dan styling latar belakang.
 * Digunakan sebagai bagian atas halaman.
 */
export default function Header(): JSX.Element {
    const [showModal, setShowModal] = useState<boolean>(false);
    const {logout} = useAccount();
    const {toggle, theme} = useTheme();
    return (
        <div className="py-8 px-4 sm:px-12 lg:px-32 bg-batumbured flex flex-row justify-between space-x-5 items-center">
            <h1 className="text-2xl text-white font-bold hidden sm:block">Batumbu Internship Management</h1>
            <h1 className="text-2xl text-white font-bold block sm:hidden">Batumbu</h1>
            <div className="flex flex-row justify-between space-x-2">
                <button onClick={toggle}
                        className="flex items-center text-white border border-white/50 rounded-full px-4 gap-2 hover:cursor-pointer hover:bg-black/10 !transition-none">
                    {theme === "Dark" ? <MdOutlineDarkMode size={"1.25em"}/> : <IoSunnyOutline size={"1.25em"}/>}
                    {theme}
                </button>

                <AccountDropdown className="opacity-80 hover:opacity-100 cursor-pointer" setShowModal={setShowModal}/>
            </div>
            <ConfirmModal
                open={showModal}
                onClose={() => setShowModal(false)}
                title="Apakah mau log out?"
                onConfirm={() => {
                    logout();
                    setShowModal(false);
                }}
                confirmLabel="Log out"
                cancelLabel="Cancel"
            />
        </div>
    );
}
