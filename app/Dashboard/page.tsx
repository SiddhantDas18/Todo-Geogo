'use client'
import CreateTodo from "@/Components/CreateTodo";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { motion } from 'framer-motion'

export default function Dashboard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signin");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) {
        return null;
    }

    return (
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
            />
        </div>
    );
}