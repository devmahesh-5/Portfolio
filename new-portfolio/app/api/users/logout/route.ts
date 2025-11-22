
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/ApiError";

connectDB();

export async function POST(req: NextRequest) {
    try {
       
        const response = NextResponse.json(
            {
                message: "User logged out successfully"
            },
            {
                status: 200
            }
        );

        (await cookies()).delete("accessToken");
        
        return response;
        
    } catch (error: unknown) {
        console.error(error);
        return NextResponse.json(
            { 
                message: error instanceof ApiError ? error.message : "Error logging out"
             },
             { 
                status:error instanceof ApiError ? error.statusCode :500 
            });
    }

}