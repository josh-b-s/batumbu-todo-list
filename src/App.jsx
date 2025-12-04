import {useState, useEffect} from "react";
import Modal from "react-modal";
import search from "./assets/Search.png";

/**
 * Komponen utama aplikasi.
 * Merender Header dan ActivityBody sebagai struktur dasar halaman.
 */
function App() {
    return (
        <>
            <Header/>
            <ActivityBody/>
        </>
    );
}

/**
 * Menampilkan header aplikasi dengan judul dan styling latar belakang.
 * Digunakan sebagai bagian atas halaman.
 */
function Header() {
    return (
        <div className="py-8 bg-batumbured">
            <h1 className="ml-32 text-2xl text-white font-bold">
                Batumbu Internship Management
            </h1>
        </div>
    );
}

/**
 * Menampilkan tampilan ketika tidak ada aktivitas sama sekali.
 * Berisi ikon pencarian dan teks "Belum ada Aktivitas".
 */
function NoActivties() {
    return (
        <>
            <img className="size-50 mx-auto my-7" src={search} alt="No activities found"/>
            <p className="text-2xl text-gray-600 font-medium text-center">Belum ada Aktivitas</p>
        </>
    );
}

/**
 * Komponen utama untuk logika aktivitas.
 *
 * Fitur yang ditangani:
 * - Membaca dan menyimpan data ke localStorage.
 * - Menambah aktivitas baru.
 * - Menghapus aktivitas dengan modal konfirmasi.
 * - Mengubah judul aktivitas.
 * - Mengubah status aktivitas (TODO → IN PROGRESS → DONE).
 * - Mengelola modal konfirmasi delete.
 *
 * State:
 * - activities: daftar aktivitas.
 * - showModal: status modal tampil / tidak.
 * - pendingDeleteId: ID aktivitas yang akan dihapus.
 */
function ActivityBody() {
    const STORAGE_KEY = "batumbu.activities";

    const [activities, setActivities] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Failed to parse activities from storage", e);
            return [];
        }
    });
    const [showModal, setShowModal] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);


    const addActivities = () => {
        setActivities((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                title: "",
                status: "TODO",
            },
        ]);
    };

    const removeActivities = (id) => {
        setActivities((prev) => prev.filter((activity) => activity.id !== id));
        closeModal()
    };

    const openDeleteModal = (id) => {
        setPendingDeleteId(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setPendingDeleteId(null);
        setShowModal(false);
    };

    const updateTitle = (id, newTitle) => {
        setActivities((prev) => prev.map((a) => (a.id === id ? {...a, title: newTitle} : a)));
    };

    const toggleStatus = (id) => {
        const NEXT = {
            TODO: "IN PROGRESS",
            "IN PROGRESS": "DONE",
            DONE: "TODO",
        };
        setActivities((prev) => prev.map((a) => (a.id === id ? {...a, status: NEXT[a.status]} : a)));
    };

    const pendingActivity = activities.find((a) => a.id === pendingDeleteId) ?? null;
    const pendingTitle = (pendingActivity?.title || "").trim() || "Aktivitas Baru";

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        } catch (e) {
            console.error("Failed to save activities to localStorage", e);
        }
    }, [activities]);


    return (
        <div className="mt-10 mx-48">
            <ActivityHeader addActivities={addActivities}/>
            <div className="mt-8">
                {activities.length <= 0 && <NoActivties />}
                {activities.length > 0 && <ActivityList
                    activities={activities}
                    onDelete={openDeleteModal}
                    onChangeTitle={updateTitle}
                    onToggleStatus={toggleStatus}
                />}


                <Modal
                    isOpen={showModal}
                    onRequestClose={closeModal}
                    shouldCloseOnOverlayClick={true}
                    style={{modalStyle}}
                >
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <p className="text-center font-bold text-2xl">
                            Apakah mau delete "{pendingTitle}"?
                        </p>

                        <div className="flex justify-center space-x-6 mt-6">
                            <button
                                className="bg-batumbured rounded-xl text-white font-bold opacity-80 hover:opacity-100 cursor-pointer px-6 py-2"
                                onClick={() => removeActivities(pendingDeleteId)}
                            >
                                Delete
                            </button>

                            <button
                                className="bg-gray-300 rounded-xl font-bold opacity-80 hover:opacity-100 cursor-pointer px-6 py-2"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

/**
 * Menampilkan judul "Aktivitas" dan tombol untuk menambah aktivitas.
 *
 * @param {Object} props
 * @param {Function} props.addActivities - Fungsi untuk menambah aktivitas baru.
 */
function ActivityHeader({addActivities}) {
    return (
        <div className="flex justify-between">
            <h2 className="text-4xl font-bold">Aktivitas</h2>
            <button
                className="bg-batumbured rounded-full w-12 h-12 text-white font-bold opacity-80 hover:opacity-100 text-2xl cursor-pointer"
                onClick={addActivities}
            >
                +
            </button>
        </div>
    );
}

/**
 * Menampilkan seluruh daftar aktivitas.
 *
 * @param {Object} props
 * @param {Array} props.activities - Daftar aktivitas.
 * @param {Function} props.onDelete - Handler untuk membuka modal delete.
 * @param {Function} props.onChangeTitle - Handler untuk update judul.
 * @param {Function} props.onToggleStatus - Handler untuk ubah status.
 */
function ActivityList({activities, onDelete, onChangeTitle, onToggleStatus}) {
    return (
        <>
            {activities.map((activity) => (
                <Activity
                    key={activity.id}
                    activity={activity}
                    onDelete={onDelete}
                    onChangeTitle={onChangeTitle}
                    onToggleStatus={onToggleStatus}
                />
            ))}
        </>
    );
}

/**
 * Menampilkan satu item aktivitas lengkap dengan:
 * - Status + warna status.
 * - Input judul.
 * - Tombol delete.
 * - Tombol toggle status.
 *
 * @param {Object} props
 * @param {Object} props.activity - Objek aktivitas.
 * @param {Function} props.onDelete - Handler membuka modal delete.
 * @param {Function} props.onChangeTitle - Handler ubah judul.
 * @param {Function} props.onToggleStatus - Handler ubah status.
 */
function Activity({activity, onDelete, onChangeTitle, onToggleStatus}) {
    const {id, title, status} = activity;
    const statusClass = STATUS_CLASS[status] ?? "";
    const divBorder = DIV_BORDER[status] ?? "";

    return (
        <div className={`bg-white mb-2 rounded-xl p-4 flex justify-between items-center ${divBorder}`} role="group">
            <div className="flex flex-col gap-2">
                <p className={`font-bold ${statusClass}`}>{status}</p>
                <input
                    className="font-bold placeholder-black focus:placeholder-transparent"
                    value={title}
                    onChange={(e) => onChangeTitle(id, e.target.value)}
                    placeholder={"Aktivitas Baru"}
                />
            </div>

            <div className="space-x-2">
                <button
                    className="text-gray-500 cursor-pointer hover:text-gray-900 hover:underline"
                    onClick={() => onDelete(id)}
                >
                    Delete
                </button>

                <button
                    onClick={() => onToggleStatus(id)}
                    className="bg-batumbured rounded-xl text-white font-bold opacity-80 hover:opacity-100 cursor-pointer px-6 py-2"
                >
                    {BUTTON_LABEL[status]}
                </button>
            </div>
        </div>
    );
}

const STATUS_CLASS = {
    TODO: "text-gray-500",
    "IN PROGRESS": "text-blue-500",
    DONE: "text-green-500",
};

const BUTTON_LABEL = {
    TODO: "Start",
    "IN PROGRESS": "Mark as Done",
    DONE: "Back to Backlog",
};

const DIV_BORDER = {
    TODO: "",
    "IN PROGRESS": "border-2 border-blue-500",
    DONE: "border-2 border-green-500",
};

const modalStyle = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        zIndex: 1000,
    },
    content: {
        position: "static",
        inset: "auto",
        border: "none",
        background: "transparent",
        padding: 0,
        overflow: "visible",
    },
}

export default App;
