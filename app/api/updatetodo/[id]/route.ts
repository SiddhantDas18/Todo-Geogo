import { NextRequest, NextResponse } from "next/server";
import Middleware from "@/middleware/route";
import prismaClient from "@/app/lib/db";

type Props = {
    params: {
        id: string;
    };
};

export async function PATCH(
    request: NextRequest,
    { params }: Props
) {
    try {
        const authResponse = await Middleware(request);

        if (authResponse.status === 401) {
            return authResponse;
        }

        const { userId } = await authResponse.json();
        const { status } = await request.json();
        const { id } = await params;
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