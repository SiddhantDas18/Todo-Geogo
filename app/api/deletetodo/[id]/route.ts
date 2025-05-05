import { NextRequest, NextResponse } from "next/server";
import Middleware from "@/middleware/route";
import prismaClient from "@/app/lib/db";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResponse = await Middleware(req);

        if (authResponse.status === 401) {
            return authResponse;
        }

        const { id } = await params;
        const { userId } = await authResponse.json();
        const todoId = parseInt(id, 10);

        if (isNaN(todoId)) {
            return NextResponse.json(
                { error: "Invalid todo ID" },
                { status: 400 }
            );
        }

        await prismaClient.todo.delete({
            where: {
                id: todoId,
                userId: userId,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Todo deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete todo" },
            { status: 500 }
        );
    }
}
