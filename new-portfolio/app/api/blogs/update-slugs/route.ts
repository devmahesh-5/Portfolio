import Blog from "@/models/blogs.models";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

connectDB();

// Update existing blogs to add slug based on title
export async function POST() {
    try {
        const blogs = await Blog.find({});
        let updatedCount = 0;

        for (const blog of blogs) {
            // Generate slug from title if not exists or if title was modified
            if (!blog.slug || blog.slug !== blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
                blog.slug = blog.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                await blog.save();
                updatedCount++;
            }
        }

        return NextResponse.json({
            message: `Updated ${updatedCount} blogs with slugs`,
            total: blogs.length,
            updated: updatedCount
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating blogs:", error);
        return NextResponse.json({ message: "Error updating blogs" }, { status: 500 });
    }
}