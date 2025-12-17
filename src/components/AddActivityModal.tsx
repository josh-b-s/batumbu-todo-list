import React, {useState} from "react";
import ConfirmModal from "./ConfirmModal";
import {useActivities} from "../contexts/ActivityContext.tsx";

export default function AddActivityModal() {
    const {showAddModal, closeAddModal, addActivities} = useActivities()
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [errors, setErrors] = useState<{ title: string; description: string }>({
        title: "",
        description: "",
    });

    const handleSubmit = () => {
        const titleVal = newTitle.trim();
        const descVal = newDescription.trim();

        const newErrors = {
            title: titleVal === "" ? "Tidak Boleh Kosong" : "",
            description: descVal === "" ? "Tidak Boleh Kosong" : "",
        };

        setErrors(newErrors);

        if (!newErrors.title && !newErrors.description) {
            addActivities(titleVal, descVal);
            setNewTitle("");
            setNewDescription("");
            closeAddModal();
        }
    };


    return (
        <ConfirmModal open={showAddModal} onClose={closeAddModal} title={"Tambah Aktivitas"} onConfirm={handleSubmit}>
            <div className={"m-4 my-5"}>
                <label>Nama</label>
                <textarea placeholder="Nama di sini"
                          value={newTitle}
                          onChange={(e) => {
                              setNewTitle(e.target.value)
                              setErrors({...errors, title: ""});
                          }}
                          className={`p-1 rounded-md focus:outline-2 w-full border field-sizing-content resize-none ${
                              errors.title ? "border-red-500 ring-1 ring-red-300" : "border-gray-300"
                          }`}/>
                <p className="text-red-800">{errors.title}</p>


                <label>Deskripsi</label>
                <textarea placeholder="Deskripsi di sini"
                          value={newDescription}
                          onChange={(e) => {
                              setNewDescription(e.target.value)
                              setErrors({...errors, description: ""});
                          }}
                          className={`p-1 rounded-md focus:outline-2 w-full min-h-50 border field-sizing-content resize-none ${
                              errors.description ? "border-red-500 ring-1 ring-red-300" : "border-gray-300"
                          }`}/>
                <p className="text-red-800">{errors.description}</p>
            </div>
        </ConfirmModal>
    )
}