import { NextRequest, NextResponse } from "next/server";
import Middleware from "@/middleware/route";
import prismaClient from "@/app/lib/db";

export async function GET(req: NextRequest) {
    try {
        const authResponse = await Middleware(req);

        if (authResponse.status === 401) {
            return authResponse;
        }

        const userId = authResponse.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
        }

        const todoResponse = await prismaClient.todo.findMany({
            where: {
                userId: parseInt(userId)
            },
            select: {
                id: true,
                todo_title: true,
                todo_status: true,
                userId: true
            }
        });

        return NextResponse.json({
            success: true,
            todo: todoResponse
        });

    } catch (e) {
        return NextResponse.json({
            success: false,
            msg: (e as Error).toString()
        }, { status: 500 });
    }
}