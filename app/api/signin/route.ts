import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt'
import prismaClient from "@/app/lib/db";
import JWST from "jsonwebtoken"

const secret = process.env.SECRET as string

if (!secret) {
    throw new Error('JWT Secret is not defined in environment variables');
}


export async function POST(req: NextRequest) {
    try {

        const data = await req.json()

        const response = await prismaClient.user.findUnique({
            where: {
                username: data.username
            }
        })

        if (!response) {
            return NextResponse.json({
                message: "User not found"
            })
        }


        const hashedPassword = response?.password
        const checkPassowrd = await bcrypt.compare(data.password, hashedPassword)

        if (checkPassowrd) {

            const token = JWST.sign({
                id:response.id
            },secret)

            return NextResponse.json({
                msg: "Signed In",
                token:token
            })
        } else {
            return NextResponse.json({
                msg: "Wrong password",
            })
        }



    } catch (e) {
        return NextResponse.json({
            msg: (e as Error).toString()
        })
    }

}