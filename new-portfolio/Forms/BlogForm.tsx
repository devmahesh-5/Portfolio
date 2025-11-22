'use client'
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import RTE from './RTE';
import { useRouter } from 'next/navigation';

type FormValues = {
    title: string;
    content: string;
    readTime: string;
    tags: string;
    category: string;
    thumbnail?: FileList;
}

function Postform({ post }: { post?: { _id: string; title: string; content: string; readTime: string; tags: string[]; category: string; image: string } }) {
    const { register, handleSubmit, watch, setValue, control, getValues, reset } = useForm<FormValues>({
        defaultValues: {
            title: post?.title || '',
            content: post?.content || '',
            readTime: post?.readTime || '',
            tags: post?.tags ? post.tags.join(', ') : '',
            category: post?.category || 'Web Development',
        }
    });

    const router = useRouter();
    
    // Use useEffect to properly set default values when post changes
    useEffect(() => {
        if (post) {
            reset({
                title: post.title,
                content: post.content,
                readTime: post.readTime,
                tags: post.tags.join(', '),
                category: post.category,
            });
        }
    }, [post, reset]);

    console.log("Form Post:", post);
    console.log("Current form values:", getValues());

    const submit = async (data: FormValues) => {
        if (post) {
            // Update existing post
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('content', data.content);
            formData.append('readTime', data.readTime);
            formData.append('tags', data.tags);
            formData.append('category', data.category);
            
            if (data.thumbnail && data.thumbnail.length > 0) {
                formData.append('thumbnail', data.thumbnail[0]);
            }
            
            try {
                const response = await axios.patch(`/api/blogs/${post._id}`, formData);
                router.push(`/blogs/${post._id}`);
            } catch (error: unknown) {
                console.error("Error updating post:", error);
            }
        } else {
            // Create new post
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('content', data.content);
            formData.append('readTime', data.readTime);
            formData.append('tags', data.tags);
            formData.append('category', data.category);
            
            if (data.thumbnail && data.thumbnail.length > 0) {
                formData.append('thumbnail', data.thumbnail[0]);
            }
            
            try {
                const response = await axios.post('/api/blogs/create', formData);
                router.push(`/blogs/${response?.data?._id}`);
            } catch (error: unknown) {
                console.error("Error creating post:", error);
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-8 max-w-6xl mx-auto p-6">
            {/* Main Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#ccd6f6] uppercase tracking-wide">
                            Blog Title
                        </label>
                        <input
                            placeholder="Enter a compelling title for your blog post..."
                            className="w-full bg-[#112240] border border-[#233554] rounded-lg px-4 py-3 text-[#ccd6f6] placeholder-[#8892b0] focus:border-[#64ffda] focus:outline-none transition-colors"
                            {...register("title", { required: true })}
                        />
                    </div>

                    {/* Content Editor */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#ccd6f6] uppercase tracking-wide">
                            Content
                        </label>
                        <RTE 
                            label="Content" 
                            name="content" 
                            Control={control} 
                            defaultValue={getValues("content")} 
                        />
                    </div>
                </div>

                {/* Right Column - Settings */}
                <div className="space-y-6">
                    {/* Thumbnail Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#ccd6f6] uppercase tracking-wide">
                            Featured Image
                        </label>
                        <input
                            type="file"
                            className="w-full bg-[#112240] border border-[#233554] rounded-lg px-4 py-3 text-[#ccd6f6] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#64ffda] file:text-[#0a192f] hover:file:bg-[#64ffda]/90 transition-colors"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("thumbnail", { required: !post })}
                        />
                        
                        {post && post.image && (
                            <div className="mt-4">
                                <p className="text-sm text-[#8892b0] mb-2">Current Image:</p>
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-48 object-cover rounded-lg border border-[#233554]"
                                />
                            </div>
                        )}
                    </div>

                    {/* Tags Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#ccd6f6] uppercase tracking-wide">
                            Tags
                        </label>
                        <input
                            placeholder="react, nextjs, web-development"
                            className="w-full bg-[#112240] border border-[#233554] rounded-lg px-4 py-3 text-[#ccd6f6] placeholder-[#8892b0] focus:border-[#64ffda] focus:outline-none transition-colors"
                            {...register("tags")}
                        />
                        <p className="text-xs text-[#8892b0]">Separate tags with commas</p>
                    </div>

                    {/* Category Select */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#ccd6f6] uppercase tracking-wide">
                            Category
                        </label>
                        <select 
                            {...register("category")} 
                            className="w-full bg-[#112240] border border-[#233554] rounded-lg px-4 py-3 text-[#ccd6f6] focus:border-[#64ffda] focus:outline-none transition-colors"
                        >
                            <option value="Web Development">Web Development</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Programming">Programming</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Read Time Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#ccd6f6] uppercase tracking-wide">
                            Read Time
                        </label>
                        <input
                            placeholder="5 min read"
                            className="w-full bg-[#112240] border border-[#233554] rounded-lg px-4 py-3 text-[#ccd6f6] placeholder-[#8892b0] focus:border-[#64ffda] focus:outline-none transition-colors"
                            {...register("readTime")}
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={!watch("title") || !watch("content")}
                        className="w-full bg-[#64ffda] text-[#0a192f] px-6 py-3 rounded-lg font-semibold hover:bg-[#64ffda]/90 disabled:bg-[#64ffda]/50 disabled:cursor-not-allowed transition-colors"
                    >
                        {post ? "Update Blog Post" : "Publish Blog Post"}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default Postform