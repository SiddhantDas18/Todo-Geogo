'use client'
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import JWST from "jsonwebtoken"

const secret = process.env.NEXT_PUBLIC_SECRET as string;

if (!secret) {
    throw new Error('JWT Secret is not defined in environment variables');
}

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
                if (response.data.user) {
                    // Generate token
                    const token = JWST.sign({
                        id: response.data.user.id
                    }, secret);

                    // Store token
                    localStorage.setItem('token', token);
                    
                    // Dispatch auth change event
                    window.dispatchEvent(new Event('authStateChange'));
                    
                    setMessage("Account created successfully! Redirecting...")
                    setTimeout(() => {
                        router.push("/");
                    }, 1500);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.data?.message) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage("An error occurred during sign up");
                }
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
                {message && (
                    <p className={`text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
                <button className="butn" onClick={getData} disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'SignUp'}
                </button>
            </div>
        </div>
    </div>
}