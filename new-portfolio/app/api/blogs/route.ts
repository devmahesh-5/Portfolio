import Blog from "@/models/blogs.models";
import connectDB from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

connectDB();

// Simple in-memory cache
interface CacheEntry {
  data: unknown;
  timestamp: number;
}

let blogsCache: CacheEntry | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(req: NextRequest) {
  try {
    // Check cache first
    if (blogsCache && Date.now() - blogsCache.timestamp < CACHE_TTL) {
      return NextResponse.json(blogsCache.data, { status: 200 });
    }

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = 6;

    await connectDB();
    const blog = await Blog.find({}).sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
    const total = await Blog.countDocuments();

    const responseData = {
      message: "blog fetched successfully",
      blog,
      total,
      page,
      pages: Math.ceil(total / limit)
    };

    // Update cache
    blogsCache = {
      data: responseData,
      timestamp: Date.now()
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ message: "Error fetching blog" }, { status: 500 });
  }
}