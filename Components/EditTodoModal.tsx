import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface EditTodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    todoId: number;
    currentTitle: string;
    currentStatus: string;
    onUpdate: (id: number, newTitle: string, newStatus: string) => void;
}

export default function EditTodoModal({ isOpen, onClose, todoId, currentTitle, currentStatus, onUpdate }: EditTodoModalProps) {
    const [title, setTitle] = useState(currentTitle);
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.patch(`/api/updatetodotitle/${todoId}`, {
                title,
                status
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                onUpdate(todoId, title, status);
                onClose();
            }
        } catch (error) {
            console.error('Failed to update todo:', error);
            alert('Failed to update todo. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold mb-4">Edit Todo</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Todo Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black p-3"
                                    placeholder="Enter new title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black p-3"
                                >
                                    <option value="false">Need to be done</option>
                                    <option value="pending">Doing</option>
                                    <option value="true">Done</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-slate-600 disabled:opacity-50"
                                >
                                    {isLoading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 