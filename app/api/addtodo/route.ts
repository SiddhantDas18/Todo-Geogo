import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/app/lib/db";
import Middleware from "@/middleware/route";

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

        const { value } = await req.json();

        const todo = await prismaClient.todo.create({
            data: {
                todo_title: value,
                userId: parseInt(userId)
            }
        });

        return NextResponse.json({
            success: true,
            todo
        });
    } catch (e) {
        return NextResponse.json(
            { error: "Failed to create todo" },
            { status: 500 }
        );
    }
}