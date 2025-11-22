import Blog from "@/models/blogs.models";
import connectDB from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import getDataFromToken from "@/lib/checkAuth";
import { ApiError } from "@/lib/ApiError";
import mongoose,{isValidObjectId} from "mongoose";
import { saveBuffer } from "@/lib/saveBuffer";
import uploadOnCloudinary from "@/lib/cloudinary";

connectDB();

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        try {
            const user = await getDataFromToken(req);
            if (!user) {
                throw new ApiError(401, "User not logged in");
            }
        } catch (error) {
            console.error("Authentication error:", error);
        }

        const id =(await params).id;

        
        
        const blog = await Blog.findByIdAndUpdate(id, {
            $inc: { view: 1 }
        }, { new: true
        });
        
        if (!blog) {
            throw new ApiError(500, "blog not updated");
        }

        return NextResponse.
            json({
                message: "Blog updated successfully",
                blog

            },
                {
                    status: 200
                });
    } catch (error: unknown) {
        console.error("Error updating Blog:", error);
        return NextResponse.
        json({
             message: error instanceof ApiError ? error.message : "Error updating blog" }, { 
            status: error instanceof ApiError ? error.statusCode : 500
         });
    }
}