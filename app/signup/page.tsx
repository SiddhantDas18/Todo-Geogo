'use client'
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function SignUp(){
    const router = useRouter();
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")

    async function getData(){
        if(username =="" || password==""){
            alert("Invalid Input")
        }else{
            setIsLoading(true)
            try {
                const response = await axios.post("/api/signup",{
                    username,
                    password
                });
                if (response.data.message) {
                    setMessage("User created successfully! Redirecting...")
                    setTimeout(() => {
                        router.push("/signin");
                    }, 1500);
                }
            } catch {
                alert("An error occurred during sign up");
            } finally {
                setIsLoading(false)
            }
        }
    }

    return <div className="pt-5 flex justify-center items-center h-screen overflow-hidden ">
        <div className="flex flex-col gap-3 border rounded-md p-5">
            <div className="flex flex-col gap-5">
                <input type="text" placeholder="username" className="inpt-styling" onChange={e=>{
                        setUsername(e.target.value)
                    }}/>

                <input type="password" placeholder="password"className="inpt-styling" onChange={e=>{
                    setPassword(e.target.value)
                }}/>
            </div>

            <div className="flex flex-col items-center gap-2">
                {message && <p className="text-green-600">{message}</p>}
                <button className="butn" onClick={getData} disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'SignUp'}
                </button>
            </div>
        </div>
    </div>
}