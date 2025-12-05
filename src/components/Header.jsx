import {modalStyle} from "./modalStyle.js";
import Modal from "react-modal";
import {useState} from "react";

/**
 * Menampilkan header aplikasi dengan judul dan styling latar belakang.
 * Digunakan sebagai bagian atas halaman.
 */
function Header({setAccount, STORAGE_KEY}) {
    const [showModal, setShowModal] = useState(false);

    const logout = () => {
        setAccount("");
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(""));
        } catch (err) {
            console.error("Failed to save login state", err);
        }
    }


    return (
        <div className="py-8 px-32 bg-batumbured flex flex-row justify-between">
            <h1 className="text-2xl text-white font-bold">
                Batumbu Internship Management
            </h1>
            <button onClick={() => setShowModal(true)}
                    className="bg-white rounded-xl  font-bold opacity-80 hover:opacity-100 cursor-pointer px-4 py-2">
                Log out
            </button>

            <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                shouldCloseOnOverlayClick={true}
                style={modalStyle}
            >
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                    <p className="text-center font-bold text-2xl">
                        Apakah mau log out?
                    </p>

                    <div className="flex justify-center space-x-6 mt-6">
                        <button
                            className="bg-batumbured rounded-xl text-white font-bold opacity-80 hover:opacity-100 cursor-pointer px-6 py-2"
                            onClick={() => logout()}
                        >
                            Log out
                        </button>

                        <button
                            className="bg-gray-300 rounded-xl font-bold opacity-80 hover:opacity-100 cursor-pointer px-6 py-2"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}


export default Header;