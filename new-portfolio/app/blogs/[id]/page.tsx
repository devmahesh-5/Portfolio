'use client';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Eye, Share2, Tag,Edit } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasIncreasedViews, setHasIncreasedViews] = useState(false);
  const authStatus = useSelector((state: { auth: { status: boolean; } }) => state.auth.status);
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await axios.get(`/api/blogs/${id}`, {
          signal: controller.signal
        });
        
        if (isMounted) {
          setPost(response.data.blog);
        }
        
      } catch (error: unknown) {
        if (isMounted && axios.isCancel(error)) {
          console.error("Request canceled:", error);
        } else if (isMounted) {
          setError(true);
          console.error("Error fetching blog post:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    if (post && !hasIncreasedViews) {
      const increaseViews = async () => {
        try {
          await axios.patch(`/api/blogs/${id}/views`);
          setHasIncreasedViews(true);
        } catch (error: unknown) {
          console.error("Error increasing view count:", error);
        }
      };
      
      increaseViews();
    }
  }, [post, id, hasIncreasedViews]);

  // Function to safely render HTML content
  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.content?.replace(/<[^>]*>/g, '').slice(0, 100),
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

if (loading) {
  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] pt-32 px-6">
      <div className="container mx-auto max-w-4xl">
        
        {/* Skeleton header */}
        <div className="text-center mb-12">
          <div className="h-10 w-40 bg-[#112240] mx-auto rounded-md animate-pulse"></div>
          <div className="h-4 w-64 bg-[#112240] mx-auto mt-4 rounded-md animate-pulse"></div>
        </div>

        {/* Skeleton posts list */}
        <div className="space-y-10">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-6 border border-[#112240] rounded-xl bg-[#0a192f] animate-pulse"
            >
              <div className="h-48 w-full bg-[#112240] rounded-md mb-6"></div>

              <div className="h-6 w-3/4 bg-[#112240] rounded-md mb-4"></div>
              <div className="h-4 w-full bg-[#112240] rounded-md mb-2"></div>
              <div className="h-4 w-5/6 bg-[#112240] rounded-md"></div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] pt-20">
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-[#8892b0] mb-4">Error loading blog post. Please try again later.</p>
          <Link 
            href="/blogs"
            className="inline-flex items-center gap-2 text-[#64ffda] hover:text-[#64ffda]/80 transition-colors font-mono"
          >
            <ArrowLeft size={20} />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] pt-20">
    <div className="container mx-auto px-4 sm:px-6 py-6 md:max-w-4xl lg:max-w-6xl">
      
      {/* Back Button */}
      <Link 
        href="/blogs" 
        className="inline-flex items-center gap-2 text-[#64ffda] hover:text-[#64ffda]/80 transition-colors mb-6 font-mono text-sm sm:text-base"
      >
        <ArrowLeft size={18} />
        Back to Blogs
      </Link>

      {/* Article */}
      <article className="bg-[#112240] rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-[#233554]">

        {/* Category + Meta */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5">
          <span className="bg-[#64ffda] text-[#0a192f] px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-semibold">
            {post?.category}
          </span>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#8892b0]">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {post?.createdAt
                ? new Date(post.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                : ''}
            </span>

            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post?.readTime} Read
            </span>

            <span className="flex items-center gap-1">
              <Eye size={14} />
              {post?.view || 0} views
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#ccd6f6] mb-5 leading-snug">
          {post?.title}
        </h1>

        {/* Author + Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#64ffda]/20 rounded-full flex items-center justify-center">
              <User size={20} className="text-[#64ffda]" />
            </div>
            <div>
              <p className="text-[#ccd6f6] font-semibold">{post?.author}</p>
              <p className="text-[#8892b0] text-xs sm:text-sm">Full Stack Developer</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            {authStatus && (
              <button 
                onClick={() => router.push(`/blogs/edit/${post?._id}`)}
                className="flex items-center gap-2 border border-[#233554] text-[#8892b0] px-3 py-2 rounded-lg hover:border-[#64ffda] hover:text-[#64ffda] transition-colors text-sm"
              >
                <Edit size={16} />
                Edit
              </button>
            )}

            <button 
              onClick={handleShare}
              className="flex items-center gap-2 border border-[#233554] text-[#8892b0] px-3 py-2 rounded-lg hover:border-[#64ffda] hover:text-[#64ffda] transition-colors text-sm"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>

        {/* Thumbnail */}
        {post?.thumbnail && (
          <div className="relative overflow-hidden rounded-lg sm:rounded-xl mb-6 h-52 sm:h-72 md:h-96">
            <img
              src={post.thumbnail}
              alt={post?.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div 
            className="text-[#ccd6f6] leading-relaxed text-base sm:text-lg blog-content"
            dangerouslySetInnerHTML={createMarkup(post?.content || '')}
          />
        </div>

        {/* Tags */}
        {post?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[#233554]">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="text-xs bg-[#64ffda]/10 text-[#64ffda] px-3 py-1 rounded-full border border-[#64ffda]/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Related Posts */}
      {relatedPosts?.length > 0 && (
        <div className="mt-10 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#ccd6f6] mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#64ffda] rounded-full"></div>
            Related Posts
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost?._id}
                href={`/blogs/${relatedPost?._id}`}
                className="bg-[#112240] rounded-lg p-5 sm:p-6 border border-[#233554] hover:border-[#64ffda]/50 transition-all duration-300 group"
              >
                <h3 className="text-base sm:text-lg font-bold text-[#ccd6f6] mb-2 group-hover:text-[#64ffda] transition-colors line-clamp-2">
                  {relatedPost?.title}
                </h3>

                <p className="text-[#8892b0] text-sm line-clamp-2 mb-3">
                  {relatedPost?.content?.replace(/<[^>]*>/g, '').slice(0, 100)}...
                </p>

                <div className="flex items-center justify-between text-xs text-[#8892b0]">
                  <span>{relatedPost?.readTime}</span>
                  <span>{relatedPost?.view || 0} views</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer Nav */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-10 sm:mt-12 pt-6 border-t border-[#233554] gap-4">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-[#64ffda] hover:text-[#64ffda]/80 transition-colors font-mono"
        >
          <ArrowLeft size={16} />
          Back to All Posts
        </Link>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-[#64ffda] hover:text-[#64ffda]/80 transition-colors font-mono"
        >
          Back to Top
        </button>
      </div>
    </div>

     <style jsx global>{`
        .blog-content {
          line-height: 1.7;
          font-size: 1.125rem;
        }
        
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4 {
          color: #ccd6f6;
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: bold;
        }
        
        .blog-content h1 {
          font-size: 2.25rem;
          border-bottom: 2px solid #64ffda;
          padding-bottom: 0.5rem;
        }
        
        .blog-content h2 {
          font-size: 1.875rem;
          border-left: 4px solid #64ffda;
          padding-left: 1rem;
        }
        
        .blog-content h3 {
          font-size: 1.5rem;
          color: #64ffda;
        }
        
        .blog-content p {
          margin-bottom: 1.5rem;
          color: #8892b0;
        }
        
        .blog-content a {
          color: #64ffda;
          text-decoration: none;
          border-bottom: 1px solid #64ffda;
          transition: all 0.3s ease;
        }
        
        .blog-content a:hover {
          color: #ccd6f6;
          border-bottom-color: #ccd6f6;
        }
        
        .blog-content ul,
        .blog-content ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
          color: #8892b0;
        }
        
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        
        .blog-content code {
          background: #0a192f;
          color: #64ffda;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          border: 1px solid #233554;
        }
        
        .blog-content pre {
          background: #0a192f;
          border: 1px solid #233554;
          border-radius: 0.75rem;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .blog-content pre code {
          background: none;
          border: none;
          padding: 0;
          color: #ccd6f6;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #64ffda;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #8892b0;
        }
        
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1.5rem 0;
          border: 1px solid #233554;
        }
        
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        .blog-content th,
        .blog-content td {
          border: 1px solid #233554;
          padding: 0.75rem;
          text-align: left;
        }
        
        .blog-content th {
          background: #112240;
          color: #64ffda;
          font-weight: bold;
        }
        
        .blog-content td {
          background: #0a192f;
          color: #8892b0;
        }
      `}</style>
  </div>
);

}