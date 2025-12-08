import {useState} from "react";
import ConfirmModal from "./CornfirmModal.jsx";

/**
 * Menampilkan header aplikasi dengan judul dan styling latar belakang.
 * Digunakan sebagai bagian atas halaman.
 */
function Header({setAccount, LOGIN_KEY}) {
  const [showModal, setShowModal] = useState(false);

  const logout = () => {
    setAccount("");
    try {
      localStorage.removeItem(LOGIN_KEY);
    } catch (err) {
      console.error("Failed to remove login state", err);
    }
    setShowModal(false);
  };

  return (
    <div className="py-8 px-32 bg-batumbured flex flex-row justify-between">
      <h1 className="text-2xl text-white font-bold">Batumbu Internship Management</h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-white rounded-xl font-bold opacity-80 hover:opacity-100 cursor-pointer px-4 py-2"
      >
        Log out
      </button>

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

export default Header;
