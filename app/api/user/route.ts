import { NextResponse, NextRequest } from "next/server";
import prismaClient from "@/app/lib/db";
import JWST from "jsonwebtoken";

const secret = process.env.SECRET as string;

if (!secret) {
    throw new Error('JWT Secret is not defined in environment variables');
}

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const decoded = JWST.verify(token, secret) as { id: string };
        const userId = decoded.id;

        const user = await prismaClient.user.findUnique({
            where: { id: parseInt(userId) },
            select: {
                username: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ username: user.username });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }
} 