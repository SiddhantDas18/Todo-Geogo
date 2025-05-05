import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt'
import prismaClient from "@/app/lib/db";


export async function POST(req: NextRequest) {
    try {

        const response = await req.json()
        
        const hashedPaasword = await bcrypt.hash(response.password,10)


        await prismaClient.user.create({
            data:{
                username:response.username,
                password:hashedPaasword
            }
        })

        return NextResponse.json({
            message:"You have been Signed Up"
        })

    } catch (e) {
        return NextResponse.json({
            msg: (e as Error).toString(),
            msg2:"What is goinf on"
        })
    }

}