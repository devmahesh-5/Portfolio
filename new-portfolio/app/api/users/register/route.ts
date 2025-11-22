
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/users.models";
connectDB();

export async function POST(request: NextRequest) {

    try {
        const { email, password,fullName } = await request.json();
        if ([email, password,fullName].some(field => !field)) {
            throw new Error("All fields are required");
        }

        const user = await User.findOne({ email });

        if (user) {
            throw new Error("User already exists");
        }
        

        const newUser = await User.create({ email, password,fullName });

        
        //const refreshToken = await newUser.generateRefreshToken();

      

        const response = NextResponse.json(
            {
                message: "User registered successfully",
                success: true
            },
            {
                status: 200
            }
        );

        return response;

    } catch (error: unknown) {
        console.log(error);
        return NextResponse.
            json(
                {
                    message: error instanceof Error ? error.message : "Something went wrong"
                }
                , {
                    status: error instanceof Error ? 400 : 500
                });
    }

}