import Blog from "@/models/blogs.models";
import connectDB from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import getDataFromToken from "@/lib/checkAuth";
import { ApiError } from "@/lib/ApiError";
import mongoose from "mongoose";
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

        // Try to find by ID first, then by title
        let blog;
        if (mongoose.Types.ObjectId.isValid(id)) {
            blog = await Blog.findByIdAndDelete(id);
        } else {
            // Try by title (URL encoded)
            const decodedTitle = decodeURIComponent(id);
            blog = await Blog.findOneAndDelete({ title: decodedTitle });
        }

        if (!blog) {
            throw new ApiError(404, "Blog not found");
        }

        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });

    } catch (error: unknown) {
        console.error("Error deleting blog:", error);
        return NextResponse.json({ message: error instanceof ApiError ? error.message : "Error deleting blog" }, { status: error instanceof ApiError ? error.statusCode : 500 });
    }
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        let blog;

        // Try to find by ID first, then by title
        if (mongoose.Types.ObjectId.isValid(id)) {
            blog = await Blog.findById(id);
        } else {
            // Try by title (URL encoded)
            const decodedTitle = decodeURIComponent(id);
            blog = await Blog.findOne({
                $or: [
                    { title: decodedTitle },
                    { slug: id }
                ]
            });
        }

        if (!blog) {
            throw new ApiError(404, "Blog not found");
        }

        return NextResponse.json({ message: "Blog fetched successfully", blog }, { status: 200 });

    } catch (error: unknown) {
        console.error("Error fetching blog:", error);
        return NextResponse.json({ message: error instanceof ApiError ? error.message : "Error fetching blog" }, { status: error instanceof ApiError ? error.statusCode : 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getDataFromToken(req);
        if (!user) {
            throw new ApiError(401, "User not logged in");
        }

        const id = (await params).id;

        const formData = await req.formData();
        const blogImage = formData.get('thumbnail') as File;
        const body = Object.fromEntries(formData) as { title: string; content: string; category: string; readTime: string; tags?: string };
        const { title, content, category, readTime, tags } = body;

        if ([title, content, category, readTime].some(field => !field || field === undefined)) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        // Find by ID first, then by title
        let existingblog;
        if (mongoose.Types.ObjectId.isValid(id)) {
            existingblog = await Blog.findById(id);
        } else {
            const decodedTitle = decodeURIComponent(id);
            existingblog = await Blog.findOne({
                $or: [
                    { title: decodedTitle },
                    { slug: id }
                ]
            });
        }

        if (!existingblog) {
            throw new ApiError(404, "Blog not found");
        }

        let thumbnail = existingblog.thumbnail;

        if (blogImage) {
            const localFile = await saveBuffer(blogImage);
            const uploadedFile = await uploadOnCloudinary(localFile);
            if (uploadedFile) {
                thumbnail = uploadedFile.secure_url;
            }
        }

        const blog = await Blog.findByIdAndUpdate(existingblog._id, {
            title,
            content,
            category,
            readTime,
            tags,
            thumbnail
        }, { new: true });

        return NextResponse.json({ message: "Blog updated successfully", blog }, { status: 200 });
    } catch (error: unknown) {
        console.error("Error updating Blog:", error);
        return NextResponse.json({ message: error instanceof ApiError ? error.message : "Error updating blog" }, { status: error instanceof ApiError ? error.statusCode : 500 });
    }
}