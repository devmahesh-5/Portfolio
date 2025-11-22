'use client'
import React,{useEffect, useState} from 'react'
import Postform from '@/Forms/BlogForm';
import { useSelector } from 'react-redux';
import {useRouter, useParams} from 'next/navigation';
import axios from 'axios';
interface BlogPost {
    _id: string;
    title: string;
    content: string;
    readTime: string;
    tags: string[];
    category: string;
    thumbnail: string | null;
    author: string;
    view: number;
    createdAt: string;
    updatedAt: string;
    image: string;

}
function AddBlogs() {
    const authStatus = useSelector((state: { auth: { status: boolean; } }) => state.auth.status);
    const router = useRouter();
    if (!authStatus) {
        router.back();
    }

    const params = useParams();
    const id = params.id;

    const [post, setPost] = useState<BlogPost | null>(null);

    const fetchPost = async (id: string) => {
        try {
            const response = await axios.get(`/api/blogs/${id}`);
            const data = response.data;
            setPost(data.blog);

        } catch (error) {
            console.error('Error fetching blog post:', error);
        }
    };

    useEffect(() => {
        if (!id) {
            router.back();
        }

        // Fetch the blog post based on the provided ID
        fetchPost(id as string);

    }, [id]);

    // Create a sanitized object that matches the BlogForm expected prop shape,
    // or undefined when no post is loaded.
    const formPost = post
        ? {
              _id: post._id,
              title: post.title,
              content: post.content,
              readTime: post.readTime,
              tags: post.tags.map(tag => tag.trim()),
              category: post.category,
              image: post.thumbnail ? post.thumbnail : "",
              thumbnail: [] as File[],
          }
        : undefined;

    return (
        <Postform post={formPost} />
    )
}

export default AddBlogs;
