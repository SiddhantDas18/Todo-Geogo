import { NextRequest, NextResponse } from "next/server";
import Middleware from "@/middleware/route";
import prismaClient from "@/app/lib/db";

export async function DELETE(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const authResponse = await Middleware(req);

        if (authResponse.status === 401) {
            return authResponse;
        }

        const { userId } = await authResponse.json();

        const {id} = await context.params
        const todoId = parseInt(id,10)
        await prismaClient.todo.delete({
            where: {
                id: todoId,
                userId: userId 
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