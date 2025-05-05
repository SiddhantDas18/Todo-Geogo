import { NextRequest, NextResponse } from "next/server";
import Middleware from "@/middleware/route";
import prismaClient from "@/app/lib/db";


export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResponse = await Middleware(request);

        if (authResponse.status === 401) {
            return authResponse;
        }

        const userId = authResponse.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
        }


        const { id } = await params;
        const todoId = parseInt(id, 10);

        if (isNaN(todoId)) {
            return NextResponse.json(
                { error: "Invalid todo ID" },
                { status: 400 }
            );
        }

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

        await prismaClient.todo.delete({
            where: {
                id: todoId,
                userId: parseInt(userId)
            }
        });

        return NextResponse.json({
            success: true,
            message: "Todo deleted successfully"
        });

    } catch {
        return NextResponse.json(
            { error: "Failed to delete todo" },
            { status: 500 }
        );
    }
}
