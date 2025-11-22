'use client';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag, User, Eye, Code, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
interface BlogPost {
  _id: string;
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

// Categories for filtering
const categories = ["All", "Full Stack", "Frontend", "Backend", "DevOps", "Programming"];

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [featuredPost, setFeaturedPost] = useState<BlogPost>();
  const [regularPosts, setRegularPosts] = useState<BlogPost[]>([]);
  const authStatus = useSelector((state: { auth: { status: boolean; } }) => state.auth.status);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6); // Show 6 posts per page
  const [totalPosts, setTotalPosts] = useState(0);

  // Function to create HTML excerpt
  const createHtmlExcerpt = (html: string, maxLength: number = 150) => {
    if (!html) return '';
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Get text content without HTML tags
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Return truncated text with ellipsis
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
    } catch (error: unknown) {
      setError(true);
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  // Calculate pagination
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  // Generate page numbers
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
      <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] pt-20">
        <div className="container mx-auto px-6 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#64ffda] mx-auto"></div>
          <p className="mt-4 text-[#8892b0]">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] pt-20">
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-[#8892b0]">Error loading blog posts. Please try again later.</p>
          <button 
            onClick={fetchPosts}
            className="mt-4 bg-[#64ffda] text-[#0a192f] px-6 py-2 rounded-lg hover:bg-[#64ffda]/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] pt-2">
      {/* Header */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
  {/* Back to Home Button */}
  <Link 
    href="/" 
    className="inline-flex items-center gap-2 px-3 py-2 border border-[#233554] text-[#8892b0] hover:border-[#64ffda] hover:text-[#64ffda] rounded-lg transition-all duration-200 group text-sm"
  >
    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
    Home
  </Link>

  {/* Add Post Button - Only for authenticated users */}
  {authStatus && (
    <Link 
      href="/blogs/add" 
      className="inline-flex items-center gap-2 px-3 py-2 bg-[#64ffda] text-[#0a192f] hover:bg-[#64ffda]/90 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#64ffda]/20 group text-sm ml-auto"
    >
      <Plus size={16} className="group-hover:scale-110 transition-transform" />
      New Post
    </Link>
  )}
</div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#ccd6f6] mb-4">
            Blog
          </h1>
          <p className="text-xl text-[#8892b0] max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development, programming, 
            and my journey as a full-stack developer.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories?.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full border border-[#233554] text-[#8892b0] hover:border-[#64ffda] hover:text-[#64ffda] transition-colors font-mono text-sm"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#ccd6f6] mb-8 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#64ffda] rounded-full"></div>
              Featured Post
            </h2>
            
            <div className="bg-[#112240] rounded-2xl overflow-hidden border border-[#233554] hover:border-[#64ffda]/50 transition-all duration-300 group">
              <div className="lg:flex">
                <div className="lg:w-1/2">
                  <div className="h-64 lg:h-full relative overflow-hidden">
                    {featuredPost?.thumbnail ? (
                      <img
                        src={featuredPost.thumbnail}
                        alt={featuredPost?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#64ffda]/10 to-[#112240] flex items-center justify-center">
                        <div className="text-[#64ffda] text-center">
                          <div className="w-16 h-16 bg-[#64ffda]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Tag size={24} />
                          </div>
                          <p className="text-sm font-mono">Featured Post</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="lg:w-1/2 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-[#64ffda] text-[#0a192f] px-3 py-1 rounded-full text-xs font-mono font-semibold">
                      {featuredPost?.category}
                    </span>
                    <div className="flex items-center gap-4 text-sm text-[#8892b0]">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {featuredPost?.createdAt
                          ? new Date(featuredPost.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })
                          : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {featuredPost?.readTime}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#ccd6f6] mb-4 group-hover:text-[#64ffda] transition-colors">
                    {featuredPost?.title}
                  </h3>
                  
                  <p className="text-[#8892b0] mb-6 leading-relaxed">
                    {createHtmlExcerpt(featuredPost?.content, 200)}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-[#8892b0]">
                      <User size={16} />
                      <span>{featuredPost?.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#8892b0]">
                      <Eye size={16} />
                      <span>{featuredPost?.view || 0} views</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredPost?.tags?.slice(0, 3).map((tag) => (
                      <span 
                        key={tag}
                        className="text-xs bg-[#64ffda]/10 text-[#64ffda] px-3 py-1 rounded-full border border-[#64ffda]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/blogs/${featuredPost?._id}`}
                    className="inline-flex items-center gap-2 border border-[#64ffda] text-[#64ffda] px-6 py-3 rounded-lg hover:bg-[#64ffda]/10 transition-colors font-mono text-sm"
                  >
                    Read More
                    <ArrowLeft size={16} className="rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Posts */}
        <div>
          <h2 className="text-2xl font-bold text-[#ccd6f6] mb-8 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#64ffda] rounded-full"></div>
            All Posts
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts?.map((post) => (
              <article 
                key={post?._id}
                className="bg-[#112240] rounded-2xl overflow-hidden border border-[#233554] hover:border-[#64ffda]/50 transition-all duration-300 group hover:transform hover:-translate-y-2"
              >
                {/* Post Image */}
                <div className="h-48 relative overflow-hidden">
                  {post?.thumbnail ? (
                    <img
                      src={post.thumbnail}
                      alt={post?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#64ffda]/10 to-[#112240] flex items-center justify-center">
                      <Code size={48} className="text-[#64ffda] opacity-50" />
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-[#64ffda]/10 text-[#64ffda] px-3 py-1 rounded-full text-xs font-mono">
                      {post?.category}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-[#8892b0]">
                      <Calendar size={12} />
                      {post?.createdAt
                        ? new Date(post.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })
                        : ''}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#ccd6f6] mb-3 group-hover:text-[#64ffda] transition-colors line-clamp-2">
                    {post?.title}
                  </h3>
                  
                  <p className="text-[#8892b0] text-sm mb-4 line-clamp-3">
                    {createHtmlExcerpt(post?.content, 100)}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-[#8892b0] mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post?.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {post?.view || 0} views
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post?.tags?.slice(0, 2).map((tag) => (
                      <span 
                        key={tag}
                        className="text-xs bg-[#233554] text-[#8892b0] px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/blogs/${post?._id}`}
                    className="inline-flex items-center gap-1 text-[#64ffda] hover:text-[#64ffda]/80 transition-colors font-mono text-sm"
                  >
                    Read More
                    <ArrowLeft size={14} className="rotate-180" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#233554] text-[#8892b0] hover:border-[#64ffda] hover:text-[#64ffda] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === page
                      ? 'bg-[#64ffda] text-[#0a192f] border-[#64ffda]'
                      : 'border-[#233554] text-[#8892b0] hover:border-[#64ffda] hover:text-[#64ffda]'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#233554] text-[#8892b0] hover:border-[#64ffda] hover:text-[#64ffda] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Newsletter Section */}
        {/* <div className="mt-16 bg-[#112240] rounded-2xl p-8 border border-[#233554] text-center">
          <h3 className="text-2xl font-bold text-[#ccd6f6] mb-4">
            Stay Updated
          </h3>
          <p className="text-[#8892b0] mb-6 max-w-md mx-auto">
            Get notified when I publish new articles about web development, programming tips, and tech insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-[#0a192f] border border-[#233554] rounded-lg px-4 py-3 text-[#ccd6f6] placeholder-[#8892b0] focus:border-[#64ffda] focus:outline-none transition-colors"
            />
            <button className="bg-[#64ffda] text-[#0a192f] px-6 py-3 rounded-lg hover:bg-[#64ffda]/90 transition-colors font-mono font-semibold whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}