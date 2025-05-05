'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import axios from 'axios'
import EditTodoModal from './EditTodoModal'

interface InputProps {
    todoTitle: string,
    todoStatus: string,
    todoId: number,
    userid: number,
    onStatusChange: (id: number, newStatus: string) => void,
    onDelete: (id: number) => void,
    onUpdateTitle: (id: number, newTitle: string, newStatus: string) => void
}

export default function Todos({ todoTitle, todoStatus, todoId, userid, onStatusChange, onDelete, onUpdateTitle }: InputProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

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
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 m-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 
                          w-full ${
                            todoStatus === "true" ? 'bg-green-50' : 
                            todoStatus === "pending" ? 'bg-yellow-50' : 'bg-white'
                          }`}
            >
                <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-3 flex-1">
                        <h3 className={`text-lg font-medium break-words flex-1
                                    ${todoStatus === "true" ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                            {todoTitle}
                        </h3>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500 hover:text-gray-700"
                                fill="none" 
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </button>
                        <button 
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-1 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-red-500 hover:text-red-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.div>

            <EditTodoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                todoId={todoId}
                currentTitle={todoTitle}
                currentStatus={todoStatus}
                onUpdate={onUpdateTitle}
            />
        </>
    );
}