'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [authentication, setAuthentication] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            setAuthentication(true)
        } else {
            setAuthentication(false)
        }
    }, []) // Empty dependency array means this runs once on mount

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
                    <div className="butn md:text-2xl">
                        <Link href="https://github.com/siddhantdas18" target='blank'>Github</Link>
                    </div>
                )}
            </div>
        </div>
    </div>
}