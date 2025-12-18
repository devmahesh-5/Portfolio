import connectDB from "@/lib/db";
import Blog from "@/models/blogs.models";
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";
import uploadOnCloudinary from "@/lib/cloudinary";
import getDataFromToken from "@/lib/checkAuth";
import { saveBuffer } from "@/lib/saveBuffer";
import { ApiError } from "@/lib/ApiError";

connectDB();

export async function POST(req: NextRequest) {
    try {

        const user = await getDataFromToken(req);
        
        if (!user) {
            throw new ApiError(401, "User not logged in");
        }

        const formData = await req.formData();

        const thumbnail = formData.get('thumbnail') as File;

        const body = Object.fromEntries(formData) as {
            title: string;
            content: string;
            category: string;
            readTime: string;
            tags?: string;
        };


        // if (!user) {
        //     throw new ApiError(401, "User not logged in");
        // }

        // if (user.isVerified === false || user.role !== "Admin") {
        //     throw new ApiError(401, "User is not Authorized to create blog");
        // }

        const { title, content, category, readTime, tags } = body;

        if ([title, content, category, readTime, tags].some(field => !field || field === undefined)) {
            throw new ApiError(400, "All fields are required");
        }

        const localFile = await saveBuffer(thumbnail);
        const uploadedFile = await uploadOnCloudinary(localFile);

        if (!uploadedFile) {
            throw new ApiError(500, "Failed to upload blog image");
        }


        const blog = await Blog.create({
            title,
            content,
            category,
            readTime,
            tags,
            thumbnail: uploadedFile.secure_url,
            author: user?.fullName || "Mahesh Bhandari",
        })


        if (!blog) {
            throw new ApiError(500, "Blog not created");
        }

        // try {

        //     await axios.post(`/api/notify`,{})

        // } catch (error:unknown) {
        //     console.error("Error sending Noification:", error);
        // }

        return NextResponse.
            json({
                message: "Blog created successfully",
                blog
            }, {
                status: 201
            });
    } catch (error: unknown) {
        console.error("Error creating blog:", error);
        return NextResponse.
            json({
                message: error instanceof ApiError ? error.message : "Error creating blog"
            }, {
                status: error instanceof ApiError ? error.statusCode : 500
            });
    }
}
