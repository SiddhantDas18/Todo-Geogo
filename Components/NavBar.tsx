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

    function Logout() {
        localStorage.removeItem("token");
        setAuthentication(false);
        // Dispatch event for other components
        window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
        window.location.href = "/";
    }

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

    return <div className="sticky top-0 border border-black py-3 rounded-md">
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
                    <div>
                        <button className="butn md:text-2xl" onClick={Logout}>Logout</button>
                    </div>
                )}
            </div>
        </div>
    </div>
}