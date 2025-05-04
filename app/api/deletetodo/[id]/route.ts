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

        const { userId } = await authResponse.json();

        // Delete the todo
        await prismaClient.todo.delete({
            where: {
                id: parseInt(params.id),
                userId: userId // Ensure the todo belongs to the user
            }
        });

        return NextResponse.json({
            success: true,
            message: "Todo deleted successfully"
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete todo" },
            { status: 500 }
        );
    }
} 