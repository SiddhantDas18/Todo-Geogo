import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt'


export async function POST(req: NextRequest) {
    try {

        const data = await req.json()

        return NextResponse.json({
            msg: "Messege from server",
            username: data.username,
            password: data.password
        })

    } catch (e) {
        return NextResponse.json({
            msg: (e as Error).toString()
        })
    }

}