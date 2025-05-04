'use client'
import { useState } from "react"
import axios from "axios"


export default function SignUp(){
    
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")

    
    async function getData(){
        if(username =="" || password==""){
            alert("Invalid Input")
        }else{
            axios.post("/api/signup",{
                username,
                password
            })
            .then
            
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
                <button className="butn" onClick={getData}>SignUp</button>
            </div>
        </div>
    </div>
}