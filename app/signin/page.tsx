'use client'
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function SignIn() {
    const router = useRouter();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function getData() {
        if (username == "" || password == "") {
            alert("Invalid Input")
        } else {
            setIsLoading(true)
            try {
                const response = await axios.post("/api/signin", {
                    username,
                    password
                });

                const data = response.data;
                if (!response.data.token) {
                    alert(response.data.msg)
                } else {
                    localStorage.setItem('token', data.token)
                    // Dispatch auth change event
                    window.dispatchEvent(new Event('authStateChange'));
                    router.push("/")
                }
            } catch (error) {
                alert(error as Error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return <div className="pt-5 flex justify-center items-center h-screen overflow-hidden ">
        <div className="flex flex-col gap-3 border rounded-md p-5">
            <div className="flex flex-col gap-5">
                <input type="text" placeholder="username" className="inpt-styling" onChange={e => {
                    setUsername(e.target.value)
                }} />

                <input type="password" placeholder="password" className="inpt-styling" onChange={e => {
                    setPassword(e.target.value)
                }} />
            </div>

            <div className="flex justify-center">
                <button className="butn" onClick={getData} disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'SignIn'}
                </button>
            </div>
        </div>
    </div>
}