'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import axios from 'axios'

interface InputProps {
    todoTitle: string,
    todoStatus: boolean,
    todoId: number,
    userid: number,
    onStatusChange: (id: number, newStatus: boolean) => void,
    onDelete: (id: number) => void
}

export default function Todos({ todoTitle, todoStatus, todoId, userid, onStatusChange, onDelete }: InputProps) {
    const [isChecked, setIsChecked] = useState(todoStatus)
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleCheck() {
        try {
            const token = localStorage.getItem('token');
            const newStatus = !isChecked;
            
            await axios.patch(`/api/updatetodo/${todoId}`, {
                status: newStatus
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setIsChecked(newStatus);
            onStatusChange(todoId, newStatus);
        } catch (error) {
            console.error('Error updating todo status:', error);
        }
    }

    async function handleDelete() {
        if (isDeleting) return;
        
        try {
            setIsDeleting(true);
            const token = localStorage.getItem('token');
            
            await axios.delete(`/api/deletetodo/${todoId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            onDelete(todoId);
        } catch (error) {
            console.error('Error deleting todo:', error);
            setIsDeleting(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 m-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 
                      w-full sm:w-64 md:w-72 lg:w-80 ${
                        isChecked ? 'bg-green-50' : 'bg-white'
                      }`}
        >
            <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-3 flex-1">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheck}
                        className="w-5 h-5 rounded-full border-2 border-gray-300 
                                 checked:bg-blue-500 checked:border-blue-500 
                                 appearance-none cursor-pointer transition-colors 
                                 duration-200 hover:border-blue-400"
                    />
                    <h3 className={`text-lg font-medium break-words flex-1
                                ${isChecked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {todoTitle}
                    </h3>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`p-2 text-gray-500 hover:text-red-500 
                                 transition-colors duration-200
                                 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        aria-label="Delete todo"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </motion.div>
    )
}