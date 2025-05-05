import { NextRequest, NextResponse } from "next/server";
import Middleware from "@/middleware/route";
import prismaClient from "@/app/lib/db";

// Helper function to create error response
const createErrorResponse = (message: string, status: number): NextResponse => {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
};

// Helper function to create success response
const createSuccessResponse = (message: string): NextResponse => {
  return NextResponse.json(
    { success: true, message },
    { status: 200 }
  );
};

export async function DELETE(
  request: NextRequest
) {
  try {
    // Get todo ID from URL
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return createErrorResponse("Todo ID is required", 400);
    }

    // Validate authentication
    const authResponse = await Middleware(request);
    if (authResponse.status === 401) {
      return authResponse;
    }

    // Get user ID from headers
    const userId = authResponse.headers.get('x-user-id');
    if (!userId) {
      return createErrorResponse("User ID not found", 401);
    }

    // Validate todo ID
    const todoId = Number(id);
    if (isNaN(todoId)) {
      return createErrorResponse("Invalid todo ID format", 400);
    }

    try {
      // Delete the todo with user verification
      const deletedTodo = await prismaClient.todo.deleteMany({
        where: {
          id: todoId,
          userId: Number(userId)
        }
      });

      if (deletedTodo.count === 0) {
        return createErrorResponse("Todo not found or unauthorized", 404);
      }

      return createSuccessResponse("Todo deleted successfully");
    } catch (error) {
      console.error("Database error:", error);
      return createErrorResponse("Failed to delete todo", 500);
    }
  } catch (error) {
    console.error("Delete todo error:", error);
    return createErrorResponse(
      "An unexpected error occurred while deleting the todo",
      500
    );
  }
}