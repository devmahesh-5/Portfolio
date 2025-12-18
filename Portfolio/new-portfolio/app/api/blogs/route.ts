import Blog from "@/models/blogs.models";
import connectDB from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import getDataFromToken from "@/lib/checkAuth";
import { ApiError } from "@/lib/ApiError";

connectDB();

export async function GET(req: NextRequest) {
    try {
        const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
        

        const blog = await Blog.find({}).sort({ createdAt: -1 }).limit(6).skip((page-1) * 10);

        if(!blog) {
            throw new ApiError(404, "blog not found");
        }

        return NextResponse.
            json(
                {
                    message:
                        "blog fetched successfully",
                    blog
                },
                {
                    status: 200

                });

    } catch (error: unknown) {
        console.error("Error fetching blog:", error);
        return NextResponse.
            json({
                message: error instanceof ApiError ? error.message : "Error fetching blog"
            }, {
                status: error instanceof ApiError ? error.statusCode : 500

            });
    }
}


