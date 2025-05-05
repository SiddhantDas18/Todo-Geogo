import { NextRequest, NextResponse } from "next/server";
import Middleware from "@/middleware/route";
import prismaClient from "@/app/lib/db";

export async function PATCH(
    request: NextRequest
) {
    try {
        // Get todo ID from URL
        const id = request.nextUrl.pathname.split('/').pop();
        if (!id) {
            return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 });
        }

        const authResponse = await Middleware(request);

        if (authResponse.status === 401) {
            return authResponse;
        }

        const userId = authResponse.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
        }

        const { title, status } = await request.json();
        const todoId = parseInt(id, 10);

        if (isNaN(todoId)) {
            return NextResponse.json(
                { error: "Invalid todo ID" },
                { status: 400 }
            );
        }

        // First check if the todo belongs to the user
        const todo = await prismaClient.todo.findFirst({
            where: {
                id: todoId,
                userId: parseInt(userId)
            }
        });

        if (!todo) {
            return NextResponse.json(
                { error: "Todo not found or unauthorized" },
                { status: 404 }
            );
        }

        const updatedTodo = await prismaClient.todo.update({
            where: {
                id: todoId,
                userId: parseInt(userId)
            },
            data: {
                todo_title: title,
                todo_status: status
            }
        });

        return NextResponse.json({
            success: true,
            todo: updatedTodo
        });

    } catch (error) {
        console.error('Update todo title error:', error);
        return NextResponse.json(
            { error: "Failed to update todo" },
            { status: 500 }
        );
    }
} 