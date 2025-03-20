"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"; 
import { db } from "@/lib/firebase"; // Ensure the correct import path

export default function TableInput() {
    const [formData, setFormData] = useState({
        Id: "",    
        Name: "",
        Email: "",
        Phone: "",
    });

    const [tableData, setTableData] = useState([]);
    const [editId, setEditId] = useState(null); // Track which entry is being edited

    // Fetch data from Firestore when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "users"));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTableData(data);
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editId !== null) {
            // Update existing entry in Firestore
            const docRef = doc(db, "users", editId);
            await updateDoc(docRef, formData);
            setTableData(tableData.map(entry => entry.id === editId ? { ...formData, id: editId } : entry));
            setEditId(null);
        } else {
            // Add new entry to Firestore
            const docRef = await addDoc(collection(db, "users"), formData);
            setTableData([...tableData, { ...formData, id: docRef.id }]);
        }

        // Reset form fields
        setFormData({ Id: "", Name: "", Email: "", Phone: "" });
    };

    const handleEdit = (entry) => {
        setFormData({ Id: entry.Id, Name: entry.Name, Email: entry.Email, Phone: entry.Phone });
        setEditId(entry.id);
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "users", id));
        setTableData(tableData.filter(entry => entry.id !== id));
        if (editId === id) {
            setFormData({ Id: "", Name: "", Email: "", Phone: "" });
            setEditId(null);
        }
    };

    return (
        <div className="p-4 max-w-5xl mx-auto">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="bg-black p-4 rounded-lg text-white">
                <table className="w-full border-collapse border border-gray-700">
                    <thead>
                        <tr className="bg-gray-900 text-white">
                            <th className="border p-2">Field Name</th>
                            <th className="border p-2">Input</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(formData)
                            .filter(key => key !== "id") // Exclude id from input fields
                            .map((key) => (
                                <tr key={key} className="text-white">
                                    <td className="border p-2">{key}</td>
                                    <td className="border p-2">
                                        <input
                                            type="text"
                                            name={key}
                                            placeholder={`Enter ${key}`}
                                            value={formData[key]}
                                            onChange={handleChange}
                                            className="w-full p-2 bg-black text-white border border-gray-700 rounded"
                                        />
                                    </td>
                                </tr>
                        ))}
                    </tbody>
                </table>
                <button type="submit" className={`p-2 mt-4 rounded ${editId !== null ? "bg-yellow-500" : "bg-blue-500"} text-white`}>
                    {editId !== null ? "Update" : "Submit"}
                </button>
            </form>

            {/* Table Section */}
            {tableData.length > 0 && (
                <table className="mt-4 w-full border-collapse border border-gray-700 text-white">
                    <thead>
                        <tr className="bg-gray-900">
                            <th className="border p-2">Id</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Phone</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((entry) => (
                            <tr key={entry.id} className="text-center bg-gray-800">
                                <td className="border p-2">{entry.Id}</td>
                                <td className="border p-2">{entry.Name}</td>
                                <td className="border p-2">{entry.Email}</td>
                                <td className="border p-2">{entry.Phone}</td>
                                <td className="border p-2 space-x-2">
                                    <button onClick={() => handleEdit(entry)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                                    <button onClick={() => handleDelete(entry.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}


