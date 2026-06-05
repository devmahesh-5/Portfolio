'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  Folder,
  Code,
  FileText,
  User,
  Grid3X3,
  Globe,
  Search,
  Settings,
  Wifi,
  Volume2,
  Battery,
  Cloud,
  ArrowRight,
  X,
  ExternalLink,
  Briefcase,
} from 'lucide-react';
import axios from 'axios';

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

interface Blog {
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

const projects = [
  { title: "GPT-2 Transformer — From Scratch", description: "355M-parameter Transformer implementing multi-head self-attention, positional encoding, and layer normalization", image: "/instructor_locus.png", github: "https://github.com/devmahesh-5/GenAI/tree/main/Foundational-Model", tech: ["Python", "PyTorch", "LLM"] },
  { title: "YouTube Video Chat — RAG Q&A System", description: "RAG pipeline that ingests YouTube transcripts for natural language Q&A over video content", image: "/instructor_locus.png", github: "https://github.com/devmahesh-5/GenAI/tree/main/RAG", tech: ["Python", "LangChain", "Vector DB"] },
  { title: "Sikshya Kendra", description: "EdTech Platform — online courses, live classes, and in-app tutoring", image: "/sk.png", liveDemo: "https://sikshyakendra.com/", tech: ["React", "Node.js", "MongoDB"] },
  { title: "Room-Bazar", description: "Room Rental Marketplace for Kathmandu and Pokhara", image: "/room-bazar.png", liveDemo: "https://room-bazar.vercel.app/", github: "https://github.com/devmahesh-5/Room-Bazar", tech: ["Next.js", "MongoDB", "JWT", "Tailwind"] },
  { title: "Tweet-Tube", description: "Unified REST API combining Twitter-style posts with YouTube-style video metadata", image: "/tweet-tube.png", github: "https://github.com/devmahesh-5/Tweet-Tube", tech: ["Express", "MongoDB"] },
];

const skills = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5 & CSS3", "JavaScript"],
  backend: ["Node.js", "Express.js", "MongoDB", "FastAPI", "Django", "REST API Design"],
  ai: ["Python", "PyTorch", "RAG", "LangChain", "Vector Embeddings", "Transformer Architectures"],
  tools: ["Git", "GitHub Actions", "Docker", "Kubernetes", "Postman", "Bash"],
};

export default function Home() {
  const [activeSection, setActiveSection] = useState('about');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [weather, setWeather] = useState<{ temp: number; condition: string; icon: string; location: string; cityName: string } | null>(null);
  const [blogsCache, setBlogsCache] = useState<{ data: Blog[]; timestamp: number } | null>(null);
  const [showCv, setShowCv] = useState(false);
  const BLOGS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    updateTime();
    const timer = setInterval(updateTime, 1000);
    fetchGitHubRepos();
    fetchWeather();
    return () => clearInterval(timer);
  }, []);

  const updateTime = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    setCurrentDate(now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
  };

  const fetchGitHubRepos = async () => {
    try {
      const response = await fetch('https://api.github.com/users/devmahesh-5/repos?sort=updated&per_page=6', { next: { revalidate: 3600 } });
      const data = await response.json();
      setGithubRepos(data);
    } catch (error) { console.error('Error fetching GitHub repos:', error); }
  };

  const fetchBlogs = async (forceRefresh = false) => {
    try {
      // Check local cache first
      if (!forceRefresh && blogsCache && Date.now() - blogsCache.timestamp < BLOGS_CACHE_TTL) {
        setBlogs(blogsCache.data);
        return;
      }

      const response = await axios.get(`/api/blogs?page=1`);
      const blogData = response.data.blog || [];
      setBlogs(blogData);
      setBlogsCache({ data: blogData, timestamp: Date.now() });
    } catch (error) { console.error("Error fetching blog posts:", error); }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchWeather = async () => {
    try {
      // Try user location first
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      const { latitude, longitude } = position.coords;
      const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      setWeather({ temp: data.temp, condition: data.condition, icon: data.icon, location: data.location, cityName: data.cityName });
    } catch {
      // Fallback to Kathmandu
      try {
        const response = await fetch('/api/weather?city=Kathmandu');
        const data = await response.json();
        setWeather({ temp: data.temp, condition: data.condition, icon: data.icon, location: data.location, cityName: data.cityName });
      } catch (error) { console.error("Weather fetch error:", error); }
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('sending');
    setTimeout(() => {
      setContactStatus('sent');
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setContactStatus('idle'), 3000);
    }, 1500);
  };

  const filteredBlogs = searchQuery ? blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) : blogs;

  const renderContent = () => {
    switch (activeSection) {
      case 'about': return <AboutSection onViewCv={() => setShowCv(true)} />;
      case 'projects': return <ProjectsSection projects={projects} />;
      case 'skills': return <SkillsSection skills={skills} />;
      case 'blog': return <BlogSection blogs={filteredBlogs} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
      case 'contact': return <ContactSection form={contactForm} setForm={setContactForm} status={contactStatus} onSubmit={handleContactSubmit} />;
      default: return <AboutSection onViewCv={() => setShowCv(true)} />;
    }
  };

  return (
    <div className="min-h-screen relative bg-background">
      {/* Background - Windows 11 Bloom Wallpaper */}
      <div className="fixed inset-0 z-0">
        {/* Windows 11 Bloom Gradient Background */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bloom1" cx="30%" cy="20%" r="60%">
              <stop offset="0%" stopColor="#4a90d9" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#2d5a8a" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="bloom2" cx="70%" cy="60%" r="50%">
              <stop offset="0%" stopColor="#7b68ee" stopOpacity="0.6"/>
              <stop offset="50%" stopColor="#4a4080" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="base" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a1a2e"/>
              <stop offset="100%" stopColor="#0a0a12"/>
            </linearGradient>
          </defs>
          <rect fill="url(#base)" width="100%" height="100%"/>
          <rect fill="url(#bloom1)" width="100%" height="100%"/>
          <rect fill="url(#bloom2)" width="100%" height="100%"/>
        </svg>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Always visible sidebar - Weather & Profile only */}
      <aside className="fixed right-4 top-20 z-30 w-64 bg-surface-container-high/60 backdrop-blur-xl rounded-xl border border-white/5 p-4 hidden lg:flex flex-col gap-4">
        {/* User Profile */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container">
            <img src="/my-photo.png" alt="Mahesh Bhandari" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-on-surface text-sm">Mahesh Bhandari</p>
            <p className="text-xs text-on-surface-variant">Undergraduate at Pulchowk</p>
          </div>
        </div>

        {/* Weather Widget */}
        {weather && (
          <div className="p-3 bg-surface-variant/20 rounded-lg border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-on-surface">{weather.temp}°C</p>
                <p className="text-xs text-on-surface-variant">{weather.cityName}</p>
              </div>
              <span className="text-2xl">{weather.icon}</span>
            </div>
          </div>
        )}
      </aside>

      {/* Desktop Icons (Windows Style) */}
      {!isWindowOpen && (
        <div className="relative z-30 p-4 md:p-6 lg:p-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-5 pt-16 md:pt-20 mr-0 lg:mr-72">
          <button onClick={() => { setActiveSection('about'); setIsWindowOpen(true); }} className="flex flex-col items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-all group">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
              <User className="text-primary" size={24} />
            </div>
            <span className="text-xs text-white font-medium">About</span>
          </button>
          <button onClick={() => { setActiveSection('projects'); setIsWindowOpen(true); }} className="flex flex-col items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-all group">
            <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center border border-secondary/30">
              <Folder className="text-secondary" size={24} />
            </div>
            <span className="text-xs text-white font-medium">Projects</span>
          </button>
          <button onClick={() => { setActiveSection('skills'); setIsWindowOpen(true); }} className="flex flex-col items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-all group">
            <div className="w-12 h-12 bg-tertiary/20 rounded-lg flex items-center justify-center border border-tertiary/30">
              <Code className="text-tertiary" size={24} />
            </div>
            <span className="text-xs text-white font-medium">Skills</span>
          </button>
          <button onClick={() => { setActiveSection('blog'); setIsWindowOpen(true); }} className="flex flex-col items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-all group">
            <div className="w-12 h-12 bg-primary-container/20 rounded-lg flex items-center justify-center border border-primary-container/30">
              <FileText className="text-primary-container" size={24} />
            </div>
            <span className="text-xs text-white font-medium">Blog</span>
          </button>
          <button onClick={() => { setActiveSection('contact'); setIsWindowOpen(true); }} className="flex flex-col items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-all group">
            <div className="w-12 h-12 bg-tertiary/20 rounded-lg flex items-center justify-center border border-tertiary/30">
              <Mail className="text-tertiary" size={24} />
            </div>
            <span className="text-xs text-white font-medium">Contact</span>
          </button>
          <button onClick={() => setShowCv(true)} className="flex flex-col items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-all group">
            <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center border border-secondary/30">
              <FileText className="text-secondary" size={24} />
            </div>
            <span className="text-xs text-white font-medium">My CV</span>
          </button>
        </div>
      )}

      {/* Main Window */}
      {isWindowOpen && (
        <main className="relative z-40 flex items-center justify-center min-h-screen p-2 md:p-4">
          <div className="w-full max-w-7xl h-[90vh] md:h-[85vh] mica-surface rounded-xl window-shadow overflow-hidden flex flex-col light-catch">
            {/* Top Bar - Windows style */}
            <header className="flex justify-between items-center px-3 md:px-4 py-2 bg-surface-container-low/80 backdrop-blur-xl rounded-t-xl border-t border-white/10 cursor-default" style={{ WebkitAppRegion: 'drag' } as any}>
              <div className="flex items-center gap-2 md:gap-3">
                <button onClick={() => setActiveSection('about')} className="p-1 hover:bg-white/10 rounded transition-colors">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>home</span>
                </button>
                <span className="font-medium text-xs md:text-sm text-on-surface">Portfolio — {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</span>
              </div>
              <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' } as any}>
                <button onClick={() => setIsWindowOpen(false)} className="p-2 hover:bg-white/10 rounded transition-colors">
                  <X size={16} className="text-on-surface-variant" />
                </button>
              </div>
            </header>

            {/* Content Area */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <aside className="hidden lg:flex w-72 bg-surface-container-high/60 backdrop-blur-xl border-r border-white/5 flex-col p-4 gap-1">
                {/* User Profile */}
                <div className="flex items-center gap-3 mb-6 px-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container">
                    <img src="/my-photo.png" alt="Mahesh Bhandari" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface text-base">Mahesh Bhandari</p>
                    <p className="text-xs text-on-surface-variant">Undergraduate at Pulchowk</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1">
                  {[
                    { id: 'about', label: 'About', icon: User },
                    { id: 'projects', label: 'Projects', icon: Folder },
                    { id: 'skills', label: 'Skills', icon: Code },
                    { id: 'blog', label: 'Blog', icon: FileText },
                    { id: 'contact', label: 'Contact', icon: Mail },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                        activeSection === item.id ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-white/5'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>

                {/* GitHub Latest Repos */}
                <div className="mt-auto p-4 bg-surface-variant/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Github size={16} className="text-primary" />
                    <span className="text-xs text-on-surface-variant font-medium">Latest Repos</span>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {githubRepos.slice(0, 4).map((repo) => (
                      <a key={repo.id} href={repo.html_url} target="_blank" className="flex items-center justify-between text-xs hover:bg-white/5 p-1 rounded group">
                        <span className="text-on-surface truncate group-hover:text-primary">{repo.name}</span>
                        <span className="text-secondary">⭐{repo.stargazers_count}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <section className="flex-1 p-4 md:p-8 overflow-y-auto">
                {renderContent()}
              </section>
            </div>
          </div>
        </main>
      )}

      {/* Taskbar */}
      <nav className="fixed bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 md:gap-2 bg-surface-container/60 backdrop-blur-xl h-10 md:h-12 rounded-full px-2 md:px-4 border-t border-white/10 taskbar-shadow">
        <button onClick={() => setIsWindowOpen(!isWindowOpen)} className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 hover:bg-white/5 rounded-lg transition-all duration-200">
          <svg fill="#0078d4" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12.1157V0L11.5303 1.58352V12.1157H0Z" />
            <path d="M0 24V12.9818H11.5303V24L0 22.4165Z" />
            <path d="M12.4697 1.7303V12.1157H24V0.0818176L12.4697 1.7303Z" />
            <path d="M12.4697 12.9818V24L24 22.2521V12.9818H12.4697Z" />
          </svg>
        </button>

        {isWindowOpen && (
          <>
            <div className="h-6 w-[1px] bg-white/10 mx-1 hidden md:block"></div>
            <button onClick={() => setActiveSection('about')} className={`relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 hover:bg-white/5 rounded-lg transition-all duration-200 active:scale-95 ${activeSection === 'about' ? 'text-primary' : 'text-on-surface-variant'}`}>
              <Grid3X3 size={18} />
              {activeSection === 'about' && <span className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full"></span>}
            </button>
            <button onClick={() => setActiveSection('projects')} className={`relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 hover:bg-white/5 rounded-lg transition-all duration-200 active:scale-95 ${activeSection === 'projects' ? 'text-primary' : 'text-on-surface-variant'}`}>
              <Folder size={18} />
              {activeSection === 'projects' && <span className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full"></span>}
            </button>
            <button onClick={() => setActiveSection('blog')} className={`relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 hover:bg-white/5 rounded-lg transition-all duration-200 active:scale-95 ${activeSection === 'blog' ? 'text-primary' : 'text-on-surface-variant'}`}>
              <FileText size={18} />
              {activeSection === 'blog' && <span className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full"></span>}
            </button>
            <button onClick={() => setActiveSection('contact')} className={`relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 hover:bg-white/5 rounded-lg transition-all duration-200 active:scale-95 ${activeSection === 'contact' ? 'text-primary' : 'text-on-surface-variant'}`}>
              <Mail size={18} />
              {activeSection === 'contact' && <span className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full"></span>}
            </button>
          </>
        )}

        <div className="h-6 w-[1px] bg-white/10 mx-1 hidden md:block"></div>

        {/* System Tray */}
        <div className="flex items-center gap-2 md:gap-3 px-1 md:px-2 text-on-surface-variant">
          {weather && (
            <div className="flex items-center gap-1 text-xs">
              <span>{weather.icon}</span>
              <span className="hidden md:inline">{weather.temp}°C - {weather.cityName}</span>
            </div>
          )}
          <Wifi size={14} />
          <Volume2 size={14} />
          <Battery size={14} />
          <div className="flex flex-col items-end">
            <span className="text-[10px] md:text-xs font-medium text-on-surface">{currentTime}</span>
            <span className="text-[9px] md:text-[11px]">{currentDate}</span>
          </div>
        </div>
      </nav>

      {/* CV Viewer Modal */}
      {showCv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl h-[90vh] mica-surface rounded-xl window-shadow overflow-hidden flex flex-col border border-white/10">
            <header className="flex justify-between items-center px-4 py-3 bg-surface-container-low/80 backdrop-blur-xl border-b border-white/10">
              <div className="flex items-center gap-3">
                <FileText className="text-primary" size={20} />
                <span className="font-medium text-sm text-on-surface">Mahesh_Bhandari_CV.pdf</span>
              </div>
              <button onClick={() => setShowCv(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={18} className="text-on-surface-variant" />
              </button>
            </header>
            <div className="flex-1 overflow-hidden bg-surface-dim">
              <iframe src="/mahesh_cv.pdf" className="w-full h-full" title="CV" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// About Section
function AboutSection({ onViewCv }: { onViewCv?: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-primary font-mono mb-4">
        <span>$</span>
        <span className="typing-effect">whoami</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-2">Mahesh Bhandari</h2>
      <p className="text-lg md:text-xl text-secondary mb-6">Undergraduate Computer Engineering Student</p>
      <p className="text-sm text-on-surface-variant mb-2">Pulchowk Engineering Campus, Lalitpur, Nepal</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="acrylic-surface p-5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="text-primary" size={24} />
            <h3 className="font-semibold text-on-surface">System</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between"><span className="text-on-surface-variant">Status</span><span className="text-on-surface">Student</span></li>
            <li className="flex justify-between"><span className="text-on-surface-variant">Institution</span><span className="text-on-surface">Pulchowk Campus</span></li>
            <li className="flex justify-between"><span className="text-on-surface-variant">Major</span><span className="text-on-surface">Computer Engineering</span></li>
          </ul>
        </div>

        <div className="acrylic-surface p-5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Code className="text-primary" size={24} />
            <h3 className="font-semibold text-on-surface">Tech Stack</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'Tailwind'].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-surface-variant rounded-full text-xs text-on-surface-variant">{tech}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="acrylic-surface p-5 rounded-xl border border-white/5">
        <p className="text-base text-on-surface-variant leading-relaxed">
          Building high-performance digital experiences with a focus on polished UI/UX. Currently specializing in full-stack development and exploring AI/ML technologies. Pursuing Computer Engineering at Pulchowk Engineering Campus.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a href="https://github.com/devmahesh-5" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container rounded-lg hover:brightness-110 transition-all text-sm">
          <Github size={18} />
          <span>GitHub</span>
        </a>
        <a href="https://www.linkedin.com/in/mahesh-bhandari-b901a4312/" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-surface-variant text-on-surface-variant rounded-lg hover:bg-white/10 transition-all text-sm">
          <Linkedin size={18} />
          <span>LinkedIn</span>
        </a>
        <a href="mailto:n31mahesh@gmail.com" className="flex items-center gap-2 px-4 py-2 bg-surface-variant text-on-surface-variant rounded-lg hover:bg-white/10 transition-all text-sm">
          <Mail size={18} />
          <span>Email</span>
        </a>
        {onViewCv && (
          <button onClick={onViewCv} className="flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-lg hover:brightness-110 transition-all text-sm">
            <FileText size={18} />
            <span>View CV</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Projects Section
function ProjectsSection({ projects }: { projects: Array<{title: string, description: string, image?: string, liveDemo?: string, github?: string, tech?: string[]}> }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-on-surface">Projects</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {projects.map((project, index) => (
          <div key={index} className="group relative mica-surface rounded-xl p-5 border border-white/5 hover:border-primary/50 transition-all duration-300 flex flex-col gap-3 cursor-pointer hover:shadow-lg hover:shadow-primary/10">
            <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden">
              {project.image ? <img src={project.image} alt={project.title} className="w-full h-full object-cover" /> : <Folder className="text-primary" size={28} />}
            </div>
            <div>
              <h3 className="font-semibold text-on-surface group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-sm text-on-surface-variant mt-1">{project.description}</p>
            </div>
            <div className="mt-auto pt-3 border-t border-white/5 flex justify-between items-center">
              <div className="flex gap-1 flex-wrap">
                {project.tech?.slice(0, 2).map((t, i) => (<span key={i} className="text-[10px] px-2 py-0.5 bg-surface-variant rounded text-on-surface-variant">{t}</span>))}
              </div>
              <div className="flex gap-2">
                {project.liveDemo && (
                  <a href={project.liveDemo} target="_blank" className="p-1.5 hover:bg-white/10 rounded-full transition-colors" title="Live Demo">
                    <ExternalLink size={14} className="text-primary" />
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" className="p-1.5 hover:bg-white/10 rounded-full transition-colors" title="GitHub">
                    <Github size={14} className="text-on-surface-variant" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skills Section
function SkillsSection({ skills }: { skills: { frontend: string[], backend: string[], ai: string[], tools: string[] } }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-on-surface">Skills & Technologies</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="acrylic-surface p-5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-4"><Code className="text-primary" size={24} /><h3 className="font-semibold text-on-surface">Frontend</h3></div>
          <div className="flex flex-wrap gap-2">{skills.frontend.map((skill, i) => (<span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm border border-primary/20">{skill}</span>))}</div>
        </div>

        <div className="acrylic-surface p-5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-4"><Cloud className="text-secondary" size={24} /><h3 className="font-semibold text-on-surface">Backend</h3></div>
          <div className="flex flex-wrap gap-2">{skills.backend.map((skill, i) => (<span key={i} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm border border-secondary/20">{skill}</span>))}</div>
        </div>

        <div className="acrylic-surface p-5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-4"><Globe className="text-secondary" size={24} /><h3 className="font-semibold text-on-surface">AI & ML</h3></div>
          <div className="flex flex-wrap gap-2">{skills.ai.map((skill, i) => (<span key={i} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm border border-secondary/20">{skill}</span>))}</div>
        </div>

        <div className="acrylic-surface p-5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-4"><Settings className="text-on-surface-variant" size={24} /><h3 className="font-semibold text-on-surface">Tools & DevOps</h3></div>
          <div className="flex flex-wrap gap-2">{skills.tools.map((skill, i) => (<span key={i} className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full text-sm">{skill}</span>))}</div>
        </div>
      </div>
    </div>
  );
}

// Blog Section
function BlogSection({ blogs, searchQuery, setSearchQuery }: { blogs: Blog[], searchQuery: string, setSearchQuery: (q: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface">Blog</h2>
        <div className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2 border border-white/5">
          <Search size={18} className="text-on-surface-variant" />
          <input
            className="bg-transparent border-none text-sm focus:ring-0 p-0 placeholder:text-on-surface-variant w-40 md:w-60"
            placeholder="Search posts..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-sm">No blog posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogs.map((blog) => (
            <Link key={blog._id} href={`/blogs/${blog.slug}`} className="group flex items-center gap-4 p-4 bg-surface-container/50 border border-white/5 rounded-xl hover:border-primary/30 transition-all">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                {blog.thumbnail ? <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" /> : <FileText className="text-primary" size={24} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-on-surface group-hover:text-primary transition-colors truncate">{blog.title}</h4>
                <p className="text-xs text-on-surface-variant mt-1">{blog.category} • {blog.readTime}</p>
              </div>
              <ArrowRight className="text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" size={16} />
            </Link>
          ))}
        </div>
      )}

      <Link href="/blogs" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm">
        <span>View All Posts</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

// Contact Section
function ContactSection({ form, setForm, status, onSubmit }: { form: { name: string; email: string; message: string }, setForm: any, status: string, onSubmit: any }) {
  return (
    <div className="space-y-6 max-w-xl">
      <div><h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">Get In Touch</h2><p className="text-on-surface-variant">Feel free to reach out for collaborations or just a friendly chat.</p></div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-on-surface-variant px-1" htmlFor="name">Name</label>
            <input id="name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required className="bg-black/20 border-0 border-b border-outline-variant hover:border-outline focus:ring-0 focus:border-primary transition-all px-4 py-2 rounded-lg text-on-surface text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-on-surface-variant px-1" htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required className="bg-black/20 border-0 border-b border-outline-variant hover:border-outline focus:ring-0 focus:border-primary transition-all px-4 py-2 rounded-lg text-on-surface text-sm" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-on-surface-variant px-1" htmlFor="message">Message</label>
          <textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message..." rows={5} required className="bg-black/20 border-0 border-b border-outline-variant hover:border-outline focus:ring-0 focus:border-primary transition-all px-4 py-2 rounded-lg text-on-surface text-sm resize-none" />
        </div>
        <button type="submit" disabled={status === 'sending' || status === 'sent'} className="w-full md:w-auto px-8 py-3 bg-primary-container hover:brightness-110 active:scale-95 transition-all text-on-primary-container font-medium rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}