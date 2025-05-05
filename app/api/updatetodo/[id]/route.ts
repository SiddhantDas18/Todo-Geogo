import { NextRequest, NextResponse } from "next/server";
import Middleware from "@/middleware/route";
import prismaClient from "@/app/lib/db";

export async function PATCH(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const authResponse = await Middleware(request);

        if (authResponse.status === 401) {
            return authResponse;
        }

        const { userId } = await authResponse.json();
        const { status } = await request.json();
        
        const {id} = await context.params
        const todoId = parseInt(id, 10);

        if (isNaN(todoId)) {
            return NextResponse.json(
                { error: "Invalid todo ID" },
                { status: 400 }
            );
        }

        const updatedTodo = await prismaClient.todo.update({
            where: {
                id: todoId,
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

    } catch {
        return NextResponse.json(
            { error: "Failed to update todo" },
            { status: 500 }
        );
    }
}