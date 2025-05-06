'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Create a custom event for auth state changes
const AUTH_CHANGE_EVENT = 'authStateChange';

export default function Navbar() {
    const [authentication, setAuthentication] = useState(false);

    // Function to update auth state
    const updateAuthState = () => {
        const token = localStorage.getItem("token");
        setAuthentication(!!token);
    };

    useEffect(() => {
        // Initial check
        updateAuthState();

        // Listen for auth state changes
        const handleAuthChange = () => {
            updateAuthState();
        };

        window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
        window.addEventListener('storage', handleAuthChange);

        return () => {
            window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
            window.removeEventListener('storage', handleAuthChange);
        };
    }, []);

    return <div className="sticky top-0 border border-black py-3 backdrop-blur-sm rounded-md">
        <div className="flex justify-between px-2 items-center">
            <div className="text-2xl md:text-3xl md:font-bold">
                <Link href="/">Todo</Link>
            </div>

            <div className="flex gap-2">
                {!authentication ? (
                    <>
                        <div className="butn md:text-2xl">
                            <Link href="/signup">SignUp</Link>
                        </div>
                        <div className="butn md:text-2xl">
                            <Link href="/signin">SignIn</Link>
                        </div>
                    </>
                ) : (
                    <Link href="/user" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </Link>
                )}
            </div>
        </div>
    </div>
}