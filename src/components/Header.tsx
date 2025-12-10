import React, {JSX, useState} from "react";
import ConfirmModal from "./ConfirmModal";
import {useAccount} from "../contexts/AccountContext.tsx";
import AccountDropdown from "./AccountDropdown.tsx";
/**
 * Menampilkan header aplikasi dengan judul dan styling latar belakang.
 * Digunakan sebagai bagian atas halaman.
 */
export default function Header(): JSX.Element {
    const [showModal, setShowModal] = useState<boolean>(false);
    const {logout} = useAccount();

    return (
        <div className="py-8 px-4 sm:px-12 lg:px-32 bg-batumbured flex flex-row justify-between space-x-5">
            <h1 className="text-2xl text-white font-bold hidden sm:block">Batumbu Internship Management</h1>
            <h1 className="text-2xl text-white font-bold block sm:hidden">Batumbu</h1>

            <button
                onClick={() => setShowModal(true)}
                className="bg-white rounded-xl font-bold opacity-80 hover:opacity-100 cursor-pointer px-4 py-2 hidden sm:block"
            >
                Log out
            </button>

            <AccountDropdown className="hover:opacity-100 cursor-pointer block sm:hidden"/>

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
