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
    todo_status: boolean;
    userid: number
}


export default function Home() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [todos, setTodos] = useState<Todo[]>([]);

    const handleStatusChange = (id: number, newStatus: boolean) => {
        setTodos(prevTodos => 
            prevTodos.map(todo => 
                todo.id === id ? { ...todo, todo_status: newStatus } : todo
            )
        );
    };

    const handleDelete = (id: number) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    };

    const handleAddTodo = (newTodo: any) => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
    };

    useEffect(() => {
        const fetchTodos = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/signin");
            } else {
                setIsAuthenticated(true);

                try {
                    const response = await axios.get("api/gettodo", {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setTodos(response.data.todo);
                } catch (error) {
                    console.error("Error fetching todos:", error);
                }
            }
            setIsLoading(false);
        };

        fetchTodos();
        

        const intervalId = setInterval(fetchTodos, 10000);
        
        return () => clearInterval(intervalId);
    }, [router]);



    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <motion.div
                        whileHover={{ scale: 1.08 }}>
                        <button
                            onClick={() => setOpen(true)}
                            className="px-4 py-2 bg-black text-white rounded-md "
                        >
                            Add Todo
                        </button>
                    </motion.div>
                </div>

                <CreateTodo
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onAddTodo={handleAddTodo}
                />

                <div className="flex flex-col gap-8">
                    <div className="flex flex-col rounded-xl gap-5 overflow-hidden flex-wrap p-6 bg-slate-100 shadow-md">
                        <div className="text-xl font-semibold text-gray-800">
                            My Tasks
                        </div>

                        <div className="flex justify-center items-center">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                                {todos.filter(todo => !todo.todo_status).length === 0 ? (
                                    <p className="text-gray-500">No active tasks</p>
                                ) : (
                                    todos.filter(todo => !todo.todo_status).map((todo) => (
                                        <Todos
                                            key={todo.id}
                                            todoId={todo.id}
                                            userid={todo.userid}
                                            todoStatus={todo.todo_status}
                                            todoTitle={todo.todo_title}
                                            onStatusChange={handleStatusChange}
                                            onDelete={handleDelete}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-col rounded-xl gap-5 overflow-hidden flex-wrap p-6 bg-green-50 shadow-md">
                        <div className="text-xl font-semibold text-gray-800">
                            Done
                        </div>

                        <div className="flex justify-center items-center">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                                {todos.filter(todo => todo.todo_status).length === 0 ? (
                                    <p className="text-gray-500">No completed tasks</p>
                                ) : (
                                    todos.filter(todo => todo.todo_status).map((todo) => (
                                        <Todos
                                            key={todo.id}
                                            todoId={todo.id}
                                            userid={todo.userid}
                                            todoStatus={todo.todo_status}
                                            todoTitle={todo.todo_title}
                                            onStatusChange={handleStatusChange}
                                            onDelete={handleDelete}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}