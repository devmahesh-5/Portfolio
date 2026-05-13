'use client';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Eye, Share2, Edit, ArrowRight, Folder, Code, FileText, Mail, Settings, Github, X, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const titleParam = params.title as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasIncreasedViews, setHasIncreasedViews] = useState(false);
  const authStatus = useSelector((state: { auth: { status: boolean; } }) => state.auth.status);

  useEffect(() => {
    if (!titleParam) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await axios.get(`/api/blogs/${titleParam}`);
        setPost(response.data.blog);
      } catch (error) {
        setError(true);
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [titleParam]);

  useEffect(() => {
    if (post && !hasIncreasedViews) {
      const increaseViews = async () => {
        try {
          await axios.patch(`/api/blogs/${post._id}/views`);
          setHasIncreasedViews(true);
        } catch (error) {
          console.error("Error increasing view count:", error);
        }
      };
      increaseViews();
    }
  }, [post, hasIncreasedViews]);

  const createMarkup = (htmlContent: string) => ({ __html: htmlContent });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: post?.title, text: post?.content?.replace(/<[^>]*>/g, '').slice(0, 100), url: window.location.href });
      } catch (error) { console.log('Error sharing:', error); }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mica-surface rounded-xl window-shadow overflow-hidden">
          <div className="h-10 bg-surface-container-low flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            <span className="ml-4 font-medium text-sm text-on-surface-variant">Loading...</span>
          </div>
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-surface-container-high animate-pulse rounded"></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mica-surface p-8 rounded-xl border border-white/5">
            <Terminal size={48} className="mx-auto mb-4 text-error" />
            <p className="text-on-surface-variant mb-4 font-medium">Blog post not found</p>
            <Link href="/blogs" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm">
              <ArrowLeft size={16} />
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a5f] via-[#121414] to-[#0c0f0f]"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen p-2 md:p-4">
        <div className="w-full max-w-6xl h-[90vh] md:h-[85vh] mica-surface rounded-xl window-shadow overflow-hidden flex flex-col light-catch">
          {/* Top Bar */}
          <header className="flex justify-between items-center px-3 md:px-4 py-2 bg-surface-container-low/80 backdrop-blur-xl rounded-t-xl border-t border-white/10">
            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/blogs" className="p-1.5 hover:bg-white/10 rounded transition-colors">
                <ArrowLeft size={18} className="text-on-surface-variant" />
              </Link>
              <span className="font-medium text-xs md:text-sm text-on-surface">Blog — {post.title.slice(0, 30)}...</span>
            </div>
            <div className="flex items-center gap-1">
              {authStatus && (
                <button onClick={() => router.push(`/blogs/edit/${post._id}`)} className="p-2 hover:bg-white/10 rounded transition-colors">
                  <Edit size={16} className="text-on-surface-variant" />
                </button>
              )}
              <button onClick={handleShare} className="p-2 hover:bg-white/10 rounded transition-colors">
                <Share2 size={16} className="text-on-surface-variant" />
              </button>
              <Link href="/blogs" className="p-2 hover:bg-white/10 rounded transition-colors">
                <X size={16} className="text-on-surface-variant" />
              </Link>
            </div>
          </header>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-64 bg-surface-container-high/60 backdrop-blur-xl border-r border-white/5 flex-col p-4 gap-1">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                  <User className="text-on-primary-container" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-on-surface text-sm">Mahesh Bhandari</p>
                  <p className="text-xs text-on-surface-variant">Full Stack Developer</p>
                </div>
              </div>

              <nav className="flex flex-col gap-1">
                <Link href="/" className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-white/5 rounded-lg transition-all text-sm">
                  <Folder size={18} />Home
                </Link>
                <Link href="/blogs" className="flex items-center gap-3 px-3 py-2 bg-primary-container text-on-primary-container rounded-lg text-sm">
                  <FileText size={18} />Blog
                </Link>
                <Link href="mailto:n31mahesh@gmail.com" className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-white/5 rounded-lg transition-all text-sm">
                  <Mail size={18} />Contact
                </Link>
              </nav>

              <div className="mt-auto p-4 bg-surface-variant/20 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Github size={14} className="text-primary" />
                  <span className="text-xs text-on-surface-variant">Recent Posts</span>
                </div>
                <p className="text-[10px] text-on-surface-variant">View all in Blog section</p>
              </div>
            </aside>

            {/* Article */}
            <section className="flex-1 p-4 md:p-8 overflow-y-auto">
              <article className="max-w-3xl mx-auto">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-medium">{post.category}</span>
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1"><Calendar size={12} />{post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{post.readTime}</span>
                    <span className="flex items-center gap-1"><Eye size={12} />{post.view || 0} views</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-4xl font-bold text-on-surface mb-6 leading-tight">{post.title}</h1>

                {/* Author */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold text-sm">{post.author}</p>
                    <p className="text-on-surface-variant text-xs">Full Stack Developer</p>
                  </div>
                </div>

                {/* Thumbnail */}
                {post.thumbnail && (
                  <div className="relative overflow-hidden rounded-xl mb-6 h-52 md:h-80">
                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Content */}
                <div className="blog-content" dangerouslySetInnerHTML={createMarkup(post.content || '')} />

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
                    {post.tags.map((tag) => (<span key={tag} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">#{tag}</span>))}
                  </div>
                )}
              </article>

              {/* Back Nav */}
              <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/10">
                <Link href="/blogs" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm">
                  <ArrowLeft size={14} />Back to All Posts
                </Link>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-on-surface-variant hover:text-primary text-sm">↑ Back to Top</button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}