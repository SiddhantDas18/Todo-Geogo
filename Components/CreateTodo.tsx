'use client'
import { useState } from 'react'
import axios from 'axios';

interface TodoFormData {
    title: string;
}

interface TodoProps{
    isOpen:boolean,
    onClose:()=>void
}

export default  function CreateTodo({ isOpen, onClose }: TodoProps) {
    const [formData, setFormData] = useState<TodoFormData>({
        title: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const value = formData.title;
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post("api/addtodo", {
                value
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = response.data;
            console.log(data.msg);
            console.log(data.msg1);
            setFormData({ title: '' });
            onClose();
        } catch (error) {
            console.log("Error during signin");
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-[2px] flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Create New Todo</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Todo Title
                        </label>
                        <input
                            type="text"
                            //value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black mx-2 my-2"
                            placeholder="Enter todo title"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2  text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2  text-sm font-medium text-white bg-black rounded-md hover:bg-blue-700"
                        >
                            Create Todo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}