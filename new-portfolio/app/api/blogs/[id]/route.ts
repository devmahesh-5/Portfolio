import Blog from "@/models/blogs.models";
import connectDB from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import getDataFromToken from "@/lib/checkAuth";
import { ApiError } from "@/lib/ApiError";
import mongoose,{isValidObjectId} from "mongoose";
import { saveBuffer } from "@/lib/saveBuffer";
import uploadOnCloudinary from "@/lib/cloudinary";

connectDB();

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;

        const user = await getDataFromToken(req);
        if (!user) {
            throw new ApiError(401, "User not logged in");
        }

        if (!isValidObjectId(id)) throw new ApiError(400, "Invalid blog ID");

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            throw new ApiError(500, "blog not deleted");
        }

        return NextResponse.
            json({
                message: "blog deleted successfully"
            }, {
                status: 200
            });

    } catch (error: unknown) {
        console.error("Error deleting blog:", error);
        return NextResponse.
            json({
                message: error instanceof ApiError ? error.message : "Error deleting blog"
            }, {
                status: error instanceof ApiError ? error.statusCode : 500
            });
    }
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        
       

        if (!isValidObjectId(id)) {
            throw new ApiError(404, "Invalid blog ID");
        }

        const blog = await Blog.findById(id);

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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getDataFromToken(req);
        
        if (!user) {
            throw new ApiError(401, "User not logged in");
        }

        const id =(await params).id;

        const formData = await req.formData();

        const blogImage = formData.get('thumbnail') as File;
        
        const body = Object.fromEntries(formData) as {
            title : string;
            content: string;
            category : string;
            readTime : string;
            tags ?: string;
        };

        const { title, content, category, readTime, tags } = body;
        
        [title, content, category, readTime].some(field => !field || field === undefined) && NextResponse.json({ message: "All fields are required" }, { status: 400 });

        

        

        const existingblog = await Blog.findById(id);

        if (!existingblog) {
            throw new ApiError(404, "blog not found");
        }

        let thumbnail = existingblog.thumbnail;

        if(blogImage) {
            const localFile = await saveBuffer(blogImage);
            const uploadedFile = await uploadOnCloudinary(localFile);
            if(uploadedFile){
                thumbnail = uploadedFile?.secure_url;
            }
        }
        
        const blog = await Blog.findByIdAndUpdate(id, {
            title,
            content,
            category,
            readTime,
            tags,
            thumbnail
        }, {
            new: true
        });

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


