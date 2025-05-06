import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt'
import prismaClient from "@/app/lib/db";
import JWST from "jsonwebtoken";

const secret = process.env.SECRET as string;

if (!secret) {
    throw new Error('JWT Secret is not defined in environment variables');
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        
        // Check if user already exists
        const existingUser = await prismaClient.user.findUnique({
            where: {
                username: data.username
            }
        });

        if (existingUser) {
            return NextResponse.json({
                message: "Username already exists"
            }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)

        // Create user
        const user = await prismaClient.user.create({
            data: {
                username: data.username,
                password: hashedPassword
            }
        })

        // Generate token
        const token = JWST.sign({
            id: user.id
        }, secret);

        return NextResponse.json({
            message: "User created successfully",
            token: token
        });

    } catch (error) {
        console.error('Error in signup:', error);
        return NextResponse.json({
            message: "An error occurred during sign up"
        }, { status: 500 });
    }
}