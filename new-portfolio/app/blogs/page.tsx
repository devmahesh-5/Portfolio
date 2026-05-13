'use client';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag, User, Eye, Code, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  readTime: string;
  content: string;
  createdAt: string;
  category: string;
  tags: string[];
  thumbnail: string;
  author: string;
  view: number;
}

const categories = ["All", "Full Stack", "Frontend", "Backend", "DevOps", "Programming"];

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [featuredPost, setFeaturedPost] = useState<BlogPost>();
  const [regularPosts, setRegularPosts] = useState<BlogPost[]>([]);
  const authStatus = useSelector((state: { auth: { status: boolean; } }) => state.auth.status);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [totalPosts, setTotalPosts] = useState(0);

  const createHtmlExcerpt = (html: string, maxLength: number = 150) => {
    if (!html) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axios.get(`/api/blogs?page=${currentPage}`);
      const blogData = response.data.blog || [];
      const total = response.data.total || 0;

      setPosts(blogData);
      setTotalPosts(total);
      setFeaturedPost(blogData[0]);
      setRegularPosts(blogData.slice(1));
    } catch (error) {
      setError(true);
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-8 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-surface-dim/95 border border-primary-fixed-dim/30 rounded-lg overflow-hidden terminal-glow">
            <div className="h-8 bg-surface-container-high flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              <span className="ml-4 font-mono text-xs text-on-surface-variant">Loading...</span>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-surface-container-high animate-pulse rounded-lg h-64"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-8 pb-12 px-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-on-surface-variant font-mono text-sm mb-4">Error loading blog posts</p>
          <button
            onClick={fetchPosts}
            className="bg-primary-fixed-dim text-on-primary px-6 py-2 rounded font-mono text-sm hover:bg-primary-fixed-dim/90 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 border border-outline-variant text-on-surface-variant hover:border-primary-fixed-dim hover:text-primary-fixed-dim rounded-lg transition-all duration-200 font-mono text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Home
          </Link>

          {authStatus && (
            <Link
              href="/blogs/add"
              className="ml-auto inline-flex items-center gap-2 px-3 py-2 bg-primary-fixed-dim text-on-primary hover:bg-primary-fixed-dim/90 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary-fixed-dim/20 font-mono text-sm"
            >
              <Plus size={16} />
              New Post
            </Link>
          )}
        </div>

        {/* Terminal Window */}
        <div className="bg-surface-dim/95 border border-primary-fixed-dim/30 rounded-lg overflow-hidden terminal-glow mb-12">
          <div className="h-8 bg-surface-container-high flex items-center justify-between px-4 border-b border-primary-fixed-dim/10">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">Blog Directory — /posts</span>
            <div className="w-12"></div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-4">
                Blog
              </h1>
              <p className="text-on-surface-variant text-sm font-mono max-w-2xl mx-auto">
                Notes, guides, and ideas around development, programming, and the things I&apos;m learning.
              </p>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 rounded border border-outline-variant text-on-surface-variant hover:border-primary-fixed-dim hover:text-primary-fixed-dim transition-colors font-mono text-xs"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <h2 className="font-mono text-sm text-primary-fixed-dim font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-fixed-dim rounded-full"></span>
              Featured Post
            </h2>

            <div className="bg-surface-dim/95 border border-primary-fixed-dim/30 rounded-lg overflow-hidden hover:border-primary-fixed-dim/50 transition-all duration-300 group">
              <div className="lg:flex">
                <div className="lg:w-1/2">
                  <div className="h-64 lg:h-full relative overflow-hidden">
                    {featuredPost.thumbnail ? (
                      <img
                        src={featuredPost.thumbnail}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-fixed-dim/10 to-surface-container-high flex items-center justify-center">
                        <Tag size={48} className="text-primary-fixed-dim opacity-50" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:w-1/2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-primary-fixed-dim text-on-primary px-3 py-1 rounded-full text-xs font-mono">
                      {featuredPost.category}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {featuredPost.createdAt
                          ? new Date(featuredPost.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {featuredPost.readTime}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-on-surface mb-3 group-hover:text-primary-fixed-dim transition-colors">
                    {featuredPost.title}
                  </h3>

                  <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                    {createHtmlExcerpt(featuredPost.content, 180)}
                  </p>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant font-mono mb-4">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {featuredPost.view || 0} views
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredPost.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono bg-primary-fixed-dim/10 text-primary-fixed-dim px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blogs/${encodeURIComponent(featuredPost.slug || featuredPost._id)}`}
                    className="inline-flex items-center gap-2 border border-primary-fixed-dim text-primary-fixed-dim px-4 py-2 rounded hover:bg-primary-fixed-dim/10 transition-colors font-mono text-sm"
                  >
                    Read More
                    <ArrowLeft size={14} className="rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Posts */}
        <div>
          <h2 className="font-mono text-sm text-primary-fixed-dim font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-fixed-dim rounded-full"></span>
            All Posts
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <article
                key={post._id}
                className="bg-surface-dim/95 border border-white/10 rounded-lg overflow-hidden hover:border-primary-fixed-dim/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="h-48 relative overflow-hidden">
                  {post.thumbnail ? (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-fixed-dim/10 to-surface-container-high flex items-center justify-center">
                      <Code size={32} className="text-primary-fixed-dim opacity-50" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-primary-fixed-dim/10 text-primary-fixed-dim px-2 py-1 rounded text-xs font-mono">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant font-mono">
                      <Calendar size={10} />
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })
                        : ''}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-on-surface mb-2 group-hover:text-primary-fixed-dim transition-colors line-clamp-2 font-mono">
                    {post.title}
                  </h3>

                  <p className="text-on-surface-variant text-sm mb-3 line-clamp-2 text-xs">
                    {createHtmlExcerpt(post.content, 80)}
                  </p>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant font-mono mb-3">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {post.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={10} />
                      {post.view || 0}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blogs/${encodeURIComponent(post.slug || post._id)}`}
                    className="inline-flex items-center gap-1 text-primary-fixed-dim hover:text-primary-fixed transition-colors font-mono text-xs"
                  >
                    Read More
                    <ArrowLeft size={12} className="rotate-180" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 rounded border border-outline-variant text-on-surface-variant hover:border-primary-fixed-dim hover:text-primary-fixed-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-mono text-sm"
              >
                <ChevronLeft size={14} />
                Prev
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded border transition-colors font-mono text-sm ${
                    currentPage === page
                      ? 'bg-primary-fixed-dim text-on-primary border-primary-fixed-dim'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary-fixed-dim hover:text-primary-fixed-dim'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded border border-outline-variant text-on-surface-variant hover:border-primary-fixed-dim hover:text-primary-fixed-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-mono text-sm"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}