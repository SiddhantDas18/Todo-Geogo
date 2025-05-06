"use client"
import CreateTodo from "@/Components/CreateTodo";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { motion } from 'framer-motion'
import Todos from "@/Components/Todos";
import axios from 'axios'

interface Todo {
    id: number;
    todo_title: string;
    todo_status: string;
    userId: number;
}

export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleStatusChange = (id: number, newStatus: string) => {
        setTodos(prevTodos => 
            prevTodos.map(todo => 
                todo.id === id ? { ...todo, todo_status: newStatus } : todo
            )
        );
    };

    const handleDelete = (id: number) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    };

    const handleAddTodo = (newTodo: Todo) => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
    };

    const handleUpdateTitle = (id: number, newTitle: string, newStatus: string) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, todo_title: newTitle, todo_status: newStatus } : todo
            )
        );
    };

    const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
        e.preventDefault();
        try {
            const todoData = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (todoData.status !== targetStatus) {
                await handleStatusChange(todoData.id, targetStatus);
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signin");
            return;
        }

        const fetchTodos = async () => {
            try {
                const response = await axios.get("/api/gettodo", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data.success && response.data.todo) {
                    setTodos(response.data.todo);
                }
            } catch (error) {
                console.error("Error fetching todos:", error);
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    router.push("/login");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodos();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const pendingTodos = todos.filter(todo => todo.todo_status === "pending");
    const completedTodos = todos.filter(todo => todo.todo_status === "true");
    const notStartedTodos = todos.filter(todo => todo.todo_status === "false");

    return (
        <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-slate-600"
                    >
                        Add Todo
                    </button>
                    <CreateTodo
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onAddTodo={handleAddTodo}
                        name="Add Todo"
                    />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Need to be done */}
                    <div 
                        className="bg-white rounded-lg shadow-md p-4"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, "false")}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Need to be done</h2>
                        <div className="space-y-2">
                            {notStartedTodos.map((todo) => (
                                <Todos
                                    key={todo.id}
                                    todoTitle={todo.todo_title}
                                    todoStatus={todo.todo_status}
                                    todoId={todo.id}
                                    userid={todo.userId}
                                    onStatusChange={handleStatusChange}
                                    onDelete={handleDelete}
                                    onUpdateTitle={handleUpdateTitle}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Doing */}
                    <div 
                        className="bg-white rounded-lg shadow-md p-4"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, "pending")}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Doing</h2>
                        <div className="space-y-2">
                            {pendingTodos.map((todo) => (
                                <Todos
                                    key={todo.id}
                                    todoTitle={todo.todo_title}
                                    todoStatus={todo.todo_status}
                                    todoId={todo.id}
                                    userid={todo.userId}
                                    onStatusChange={handleStatusChange}
                                    onDelete={handleDelete}
                                    onUpdateTitle={handleUpdateTitle}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Done */}
                    <div 
                        className="bg-white rounded-lg shadow-md p-4"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, "true")}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Done</h2>
                        <div className="space-y-2">
                            {completedTodos.map((todo) => (
                                <Todos
                                    key={todo.id}
                                    todoTitle={todo.todo_title}
                                    todoStatus={todo.todo_status}
                                    todoId={todo.id}
                                    userid={todo.userId}
                                    onStatusChange={handleStatusChange}
                                    onDelete={handleDelete}
                                    onUpdateTitle={handleUpdateTitle}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}