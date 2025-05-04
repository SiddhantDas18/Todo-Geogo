import { NextRequest, NextResponse } from "next/server";
import Middleware from "@/middleware/route";
import prismaClient from "@/app/lib/db";


export async function GET(req:NextRequest){

    try{

        const authResponse = Middleware(req)

        if (authResponse.status === 401) {
            return authResponse;
        }

        const {userid} = await authResponse.json();

        const todoResponse = await prismaClient.todo.findMany({
            where:{
                userId: userid
            },
            select:{
                id:true,
                todo_title:true,
                todo_status:true,
                userId:true
            }
        });

        return NextResponse.json({
            success:true,
            todo:todoResponse
        })

    }catch(e){
        return NextResponse.json({
            success:true,
            msg:(e as Error).toString
        })
    }

}