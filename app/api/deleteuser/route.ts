import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import prismaClient from "@/app/lib/db";
import Middleware from "@/middleware/route";

const secret = process.env.SECRET as string;

if (!secret) {
    throw new Error('JWT Secret is not defined in environment variables');
}

export async function POST(req: NextRequest) {
    try {
        const authResponse = await Middleware(req);

        if (authResponse.status === 401) {
            return authResponse;
        }

        const userId = authResponse.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
        }

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