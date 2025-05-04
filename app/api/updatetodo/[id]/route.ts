import { NextRequest, NextResponse } from "next/server";
import Middleware from "@/middleware/route";
import prismaClient from "@/app/lib/db";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResponse = await Middleware(req);

        if (authResponse.status === 401) {
            return authResponse;
        }

        const { userId } = await authResponse.json();
        const { status } = await req.json();

        const updatedTodo = await prismaClient.todo.update({
            where: {
                id: parseInt(params.id),
                userId: userId
            },
            data: {
                todo_status: status
            }
        });

        return NextResponse.json({
            success: true,
            todo: updatedTodo
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update todo" },
            { status: 500 }
        );
    }
} 