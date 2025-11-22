
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/users.models";
import axios from "axios";
connectDB();
// const generateToken=async(user:any)=>{
//     const accessToken = await user.generateAccessToken();
//     const refreshToken = await user.generateRefreshToken();

//     if(!accessToken || !refreshToken){
//         return NextResponse.json(
//             {
//                 message:"could not generate tokens"
//             },
//             {
//                 status:500
//             }
//         );
//     }

// }
export async function POST(request: NextRequest) {

    try {
        const { email, password } = await request.json();

        if ([email, password].some(field => !field)) {
            throw new Error("All fields are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            throw new Error("Invalid password");
        }

        const newUser = await User.findById(user._id).select("-password -__v");
        const accessToken = await newUser.generateAccessToken();

        
        //const refreshToken = await newUser.generateRefreshToken();

        if (!accessToken) {
            throw new Error("Could not Log in user");
        }

      

        const response = NextResponse.json(
            {
                message: "Login successful",
                success: true,
                user: newUser
            },
            {
                status: 200
            }
        );


        response.cookies.set({
            name: "accessToken",
            value: accessToken,
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60*60*24
        });

        

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