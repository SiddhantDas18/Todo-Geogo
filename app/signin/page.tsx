'use client'
import { useState } from "react"
import axios from "axios"


export default function SignIn(){
    
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")

    
    async function getData(){
        if(username =="" || password==""){
            alert("Invalid Input")
        }else{
            const response = await axios.post("/api/signin", {
                username,
                password
            });

            const data = response.data;

            localStorage.setItem('token',data.token)
            console.log(`username:${username} password:${password}`)
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

            <div className="flex justify-center">
                <button className="butn" onClick={getData}>SignIn</button>
            </div>
        </div>
    </div>
}