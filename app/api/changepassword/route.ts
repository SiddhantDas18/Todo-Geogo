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

        const { currentPassword, newPassword } = await req.json();

        // Get user from database
        const user = await prismaClient.user.findUnique({
            where: { id: parseInt(userId) }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prismaClient.user.update({
            where: { id: parseInt(userId) },
            data: { password: hashedNewPassword }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error changing password:', error);
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
    }
} 