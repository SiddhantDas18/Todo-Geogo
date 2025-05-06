import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import prismaClient from "@/app/lib/db";
import JWST from "jsonwebtoken";

const secret = process.env.SECRET as string;

if (!secret) {
    throw new Error('JWT Secret is not defined in environment variables');
}

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const decoded = JWST.verify(token, secret) as { id: string };
        const userId = decoded.id;

        const { password } = await req.json();

        // Get user from database
        const user = await prismaClient.user.findUnique({
            where: { id: parseInt(userId) }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Password is incorrect' }, { status: 400 });
        }

        // Delete user's todos first (due to foreign key constraint)
        await prismaClient.todo.deleteMany({
            where: { userId: parseInt(userId) }
        });

        // Delete user
        await prismaClient.user.delete({
            where: { id: parseInt(userId) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
} 