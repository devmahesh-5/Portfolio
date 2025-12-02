'use client';
import Link from 'next/link';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { login, logout } from '@/store/authSlice';
import {
  Github,
  Linkedin,
  Twitter,
  Facebook,
  ExternalLink,
  Mail,
  Download,
  FileText,
  Code,
  Server,
  Palette,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Sparkles
} from 'lucide-react';

// GitHub API types
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

interface userData {
  _id: string;
  fullName: string;
  email: string;
}


async function getGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const response = await fetch('https://api.github.com/users/devmahesh-5/repos?sort=updated&per_page=6', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub repos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}


export default  function Home() {
  const authStatus = useSelector((state: { auth: { status: boolean; userData: userData; } }) => state.auth.status);
  const dispatch = useDispatch();
  const userData: userData = useSelector((state: { auth: { status: boolean; userData: userData; }; }) => state.auth.userData);
  const [isMobile, setIsMobile] = React.useState(false);
  const [githubRepos, setGithubRepos] = React.useState<GitHubRepo[]>([]);
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const fetchGithub = async () =>{
    const githubRepos = await getGitHubRepos();
    setGithubRepos(githubRepos);
  }
  React.useEffect(() => {
    fetchGithub();
  }, []);


    const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/blogs?page=1`);
      const blogData = response.data.blog || [];
      const total = response.data.total || 0;
      
      setBlogs(blogData);
      
    } catch (error: unknown) {
      console.error("Error fetching blog posts:", error);
    } 
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);



  const projects = [
    {
      title: "Sikshya Kendra",
      description: "An educational website offering a wide range of courses and resources to help students achieve their educational goals.Offers online Courses with in app tutoring and live classes.",
      liveDemo: "https://sikshyakendra.com/",
      image: "/sk.png"
    },
     {
      title: "RoomBazar",
      description: "A comprehensive room rental platform connecting tenants with property owners, featuring advanced search, secure authentication, and real-time communication.",
      tech: ["React", "Node.js", "MongoDB", "Express", "JWT Auth", "Tailwind CSS"],
      liveDemo: "https://room-bazar.vercel.app/",
      image: "/room-bazar.png"
    },
    {
      title: "Mahesh'Keep",
      description: "A note-taking application built with React that allows users to create, edit, and organize notes with rich text formatting.",
      tech: ["HTML", "CSS", "JavaScript", "Local Storage"],
      github: "https://github.com/devmahesh-5/Note",
      liveDemo: "https://devmahesh-5.github.io/Note/",
      image: "/note.png"
    },
    {
      title: "Tent Sewing Enterprises",
      description: "An business website for a local tent manufacturing business featuring product listings and contact forms.",
      tech: ["React", "Express", "MongoDB", "Tailwind CSS"],
      github: "https://github.com/devmahesh-5/Tent-Sewing-Enterprise",
      liveDemo: "https://devmahesh-5.github.io/Tent-Sewing-Enterprise/",
      image: "/tent.png"
    },
    {
      title: "Mega Blogging Platform",
      description: "A full-featured blogging platform with user authentication, CRUD operations, and rich text editing using Appwrite backend.",
      tech: ["React", "Appwrite", "Tailwind CSS"],
      github: "https://github.com/devmahesh-5/Appwrite-MegaBlog",
      liveDemo: "http://appwrite-mega-blog-gamma.vercel.app",
      image: "/mgblog.png"
    },
    {
      title: "Tweet-Tube",
      description: "A Backend for a Twitter and YouTube Clone in one using Mongodb and Express JS.",
      tech: ["Express", "MongoDB", "Postman"],
      github: "https://github.com/devmahesh-5/Tweet-Tube",
      liveDemo: "https://github.com/devmahesh-5/Tweet-Tube",
      image: "/tweet-tube.png"
    }
  ];

  const skills = {
    frontend: [
      "JavaScript (ES6+)",
      "React",
      "HTML5 & CSS3",
      "Tailwind CSS",
      "Next.js"
    ],
    backend: [
      "Node.js",
      "Express",
      "MongoDB",
      "PostgreSQL",
      "RESTful APIs",
      "Next.js"
    ],
    tools: [
      "Git & GitHub",
      "VS Code",
      "Postman",
      "Python"
    ]
  };



  const certificates = [
    {
      title: "Locus Software Fellowship Instructor",
      image: "/instructor_locus.png",
      date: "2024"
    },
     
  ];


  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/users/logout');
      dispatch(logout());
    } catch (error:unknown) {
      console.error("Error logging out:", error);
    }


  }

  const handleLinkClick = () => {
  // Small delay for better UX
  setTimeout(() => {
    setIsMobile(false);
  }, 100);
};



  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6]">
      {/* Header/Navigation */}
    <header
  className="
    fixed top-0 left-0 w-full z-50
    bg-[#0a192f]/90 backdrop-blur-md border-b border-[#112240]
  "
>
  <div className="container mx-auto px-6 py-4">
    <div className="flex items-center justify-between">

      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-bold text-[#64ffda] transition-transform duration-200 hover:scale-105"
      >
        M_B
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {[
          { label: "About", href: "#about" },
          { label: "Freelancing & Projects", href: "#projects_freelancing" },
          { label: "Skills", href: "#skills" },
          { label: "Blogs", href: "/blogs" },
          { label: "Contact", href: "#contact" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="
              relative text-sm text-[#ccd6f6] transition-colors 
              hover:text-[#64ffda] group
            "
          >
            {item.label}
            <span
              className="
                absolute left-0 -bottom-1 h-0.5 w-0 bg-[#64ffda]
                group-hover:w-full transition-all duration-300
              "
            />
          </Link>
        ))}

        {/* Auth Button */}
        {!authStatus ? (
          <Link
            href="/login"
            className="
              px-4 py-2 text-sm font-medium
              border border-[#64ffda] text-[#64ffda] rounded-lg
              transition-all duration-200
              hover:bg-[#64ffda] hover:text-[#0a192f]
            "
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="
              px-4 py-2 text-sm font-medium rounded-lg
              bg-[#64ffda] text-[#0a192f]
              transition-all duration-200
              hover:bg-[#64ffda]/90 hover:shadow-lg hover:shadow-[#64ffda]/20
            "
          >
            Logout
          </button>
        )}
      </nav>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsMobile(!isMobile)}
        aria-label="Toggle menu"
        className="
          md:hidden w-10 h-10 flex flex-col items-center justify-center 
          rounded-lg transition-all duration-300 group
        "
      >
        <span
          className={`
            w-6 h-0.5 bg-[#64ffda] rounded-full transition-all duration-300
            ${isMobile ? "rotate-45 translate-y-1.5" : "group-hover:bg-[#64ffda]"}
          `}
        />
        <span
          className={`
            w-6 h-0.5 bg-[#64ffda] my-1.5 rounded-full transition-all duration-300
            ${isMobile ? "opacity-0 -translate-x-2" : ""}
          `}
        />
        <span
          className={`
            w-6 h-0.5 bg-[#64ffda] rounded-full transition-all duration-300
            ${isMobile ? "-rotate-45 -translate-y-1.5" : ""}
          `}
        />
      </button>
    </div>
  </div>

  {/* Mobile Menu */}
  {isMobile && (
    <nav
      className="
        md:hidden absolute top-full left-0 w-full
        bg-[#0a192f] border-b border-[#64ffda]/20
        shadow-xl shadow-[#64ffda]/10 animate-fade-in
      "
    >
      <div className="container mx-auto px-4 py-3 space-y-1">

        {[
          { label: "About", href: "#about" },
          { label: "Freelancing & Projects", href: "#projects_freelancing" },
          { label: "Skills", href: "#skills" },
          { label: "Blog", href: "/blogs" },
          { label: "Contact", href: "#contact" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleLinkClick}
            className="
              flex items-center gap-3 px-4 py-4 rounded-lg
              text-[#ccd6f6] hover:text-[#64ffda] hover:bg-[#112240]
              border-l-2 border-transparent hover:border-[#64ffda]
              transition-all duration-300 text-base font-medium group
            "
          >
            <div
              className="
                w-1.5 h-1.5 bg-[#64ffda] rounded-full opacity-0 
                group-hover:opacity-100 transition-opacity
              "
            />
            {item.label}
          </Link>
        ))}

        {/* Mobile Auth */}
        <div className="pt-3 border-t border-[#112240]">
          {!authStatus ? (
            <Link
              href="/login"
              onClick={handleLinkClick}
              className="
                block text-center px-4 py-4 mx-2 border border-[#64ffda]
                text-[#64ffda] rounded-lg text-base font-medium
                hover:bg-[#64ffda] hover:text-[#0a192f]
                transition-all duration-300
              "
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                handleLinkClick();
              }}
              className="
                w-full mx-2 px-4 py-4 rounded-lg text-base font-medium
                bg-[#64ffda] text-[#0a192f]
                hover:bg-[#64ffda]/90 transition-all duration-300
              "
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )}
</header>


 {/* Hero Section */}
<section id="about" className="pt-32 pb-20 px-6">
  <div className="container mx-auto max-w-4xl">
    <p className="text-lg text-[#64ffda] mb-4 font-mono">
      Hi, my name is
    </p>

    <h1 className="text-5xl md:text-7xl font-bold text-[#ccd6f6] mb-4">
      Mahesh Bhandari.
    </h1>

    <h2 className="text-3xl md:text-5xl font-bold text-[#8892b0] mb-6">
      I build full-stack web and mobile apps, deploy them to the cloud, and keep everything running smoothly.
    </h2>

    <p className="text-xl text-[#8892b0] mb-8 max-w-2xl">
      I&apos;m a Computer Engineering student at Pulchowk Engineering Campus who loves creating clean, practical, and reliable digital experiences. 
      These days I&apos;m diving deeper into full-stack engineering, cloud systems, and devops.
    </p>

    <div className="flex flex-wrap gap-4">
      <Link
        href="#projects_freelancing"
        className="bg-transparent border border-[#64ffda] text-[#64ffda] px-8 py-3 rounded-lg hover:bg-[#64ffda]/10 transition-colors font-mono text-sm"
      >
        View My Work
      </Link>

      <Link
        href="#cv"
        className="bg-transparent border border-[#ccd6f6] text-[#ccd6f6] px-8 py-3 rounded-lg hover:bg-[#ccd6f6]/10 transition-colors font-mono text-sm"
      >
        View CV
      </Link>
    </div>
  </div>
</section>





      {/* CV Section - Enhanced */}
      <section id="cv" className="py-20 px-6 bg-[#0a192f]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-[#ccd6f6] mb-12 relative">
            <span className="text-[#64ffda] text-2xl mr-2 font-mono">01.</span>
            Curriculum Vitae
            <div className="absolute bottom-0 left-0 w-24 h-0.5 bg-[#64ffda]"></div>
          </h2>

          <div className="bg-[#112240] rounded-2xl shadow-2xl p-8 mb-8 border border-[#233554]">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-[#ccd6f6] mb-2">Mahesh Bhandari</h1>
                <p className="text-xl text-[#64ffda] mb-4 font-mono">MERN Stack Developer</p>
                <div className="flex items-center gap-4 text-[#8892b0]">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>Syangja, Nepal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>n31mahesh@gmail.com</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 bg-[#64ffda] text-[#0a192f] px-6 py-3 rounded-lg hover:bg-[#64ffda]/90 transition-colors font-mono font-semibold">
                <Download size={20} />
                Download CV
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Education */}
              <div className="bg-[#0a192f] rounded-xl p-6 border border-[#233554]">
                <h3 className="text-2xl font-bold text-[#ccd6f6] mb-4 flex items-center gap-2">
                  <BookOpen size={24} className="text-[#64ffda]" />
                  Education
                </h3>
                <div className="space-y-4">
                  <div className="border-l-2 border-[#64ffda] pl-4">
                    <h4 className="font-semibold text-[#ccd6f6]">Bachelor in Computer Engineering</h4>
                    <p className="text-[#64ffda]">Pulchowk Engineering Campus</p>
                    <p className="text-[#8892b0] text-sm flex items-center gap-1">
                      <Calendar size={14} />
                      2023 - Present
                    </p>
                  </div>
                  <div className="space-y-4">
                  <div className="border-l-2 border-[#64ffda] pl-4">
                    <h4 className="font-semibold text-[#ccd6f6]">+2 in Computer Science</h4>
                    <p className="text-[#64ffda]">Himalayan Whitehouse Int&apos;l College</p>
                    <p className="text-[#8892b0] text-sm flex items-center gap-1">
                      <Calendar size={14} />
                      2021 - 2023
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-l-2 border-[#64ffda] pl-4">
                    <h4 className="font-semibold text-[#ccd6f6]">Secondary School</h4>
                    <p className="text-[#64ffda]">Shree Gyanodaya Secondary School</p>
                    <p className="text-[#8892b0] text-sm flex items-center gap-1">
                      <Calendar size={14} />
                      3.86
                    </p>
                  </div>
                </div>
                </div>
              </div>

              {/* Experience */}
              {/* <div className="bg-[#0a192f] rounded-xl p-6 border border-[#233554]">
                <h3 className="text-2xl font-bold text-[#ccd6f6] mb-4 flex items-center gap-2">
                  <Award size={24} className="text-[#64ffda]" />
                  Experience
                </h3>
                <div className="space-y-4">
                  {experience && experience?.map((exp: Experience, index: number) => (
                    <div key={index} className="border-l-2 border-[#64ffda] pl-4">
                      <h4 className="font-semibold text-[#ccd6f6]">{exp.role}</h4>
                      <p className="text-[#64ffda]">{exp.company}</p>
                      <p className="text-[#8892b0] text-sm">{exp.period}</p>
                      <p className="text-[#8892b0] text-sm mt-2">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>

            {/* Skills Summary */}
            <div className="bg-[#0a192f] rounded-xl p-6 border border-[#233554]">
              <h3 className="text-2xl font-bold text-[#ccd6f6] mb-6 flex items-center gap-2">
                <Sparkles size={24} className="text-[#64ffda]" />
                Technical Skills
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Palette size={20} className="text-[#64ffda] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#ccd6f6] mb-2">Frontend</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.frontend.map((skill, index) => (
                        <span key={index} className="text-xs bg-[#64ffda]/10 text-[#64ffda] px-3 py-1 rounded-full border border-[#64ffda]/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Server size={20} className="text-[#64ffda] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#ccd6f6] mb-2">Backend</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.backend.map((skill, index) => (
                        <span key={index} className="text-xs bg-[#64ffda]/10 text-[#64ffda] px-3 py-1 rounded-full border border-[#64ffda]/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Code size={20} className="text-[#64ffda] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#ccd6f6] mb-2">Tools & Others</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.tools.map((skill, index) => (
                        <span key={index} className="text-xs bg-[#64ffda]/10 text-[#64ffda] px-3 py-1 rounded-full border border-[#64ffda]/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Activity Section */}
      <section id="github" className="py-20 px-6 bg-[#112240]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-[#ccd6f6] mb-12 relative">
            <span className="text-[#64ffda] text-2xl mr-2 font-mono">02.</span>
            Latest GitHub Activity
            <div className="absolute bottom-0 left-0 w-24 h-0.5 bg-[#64ffda]"></div>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {githubRepos.map((repo) => (
              <div key={repo.id} className="bg-[#0a192f] rounded-xl p-6 border border-[#233554] hover:border-[#64ffda]/50 transition-all duration-300 hover:transform hover:-translate-y-2">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-[#ccd6f6] truncate flex-1">
                    {repo.name}
                  </h3>
                  <Link
                    href={repo.html_url}
                    target="_blank"
                    className="text-[#8892b0] hover:text-[#64ffda] transition-colors ml-2"
                  >
                    <Github size={18} />
                  </Link>
                </div>

                <p className="text-[#8892b0] text-sm mb-4 line-clamp-2">
                  {repo.description || 'No description available'}
                </p>

                <div className="flex justify-between items-center text-xs text-[#8892b0]">
                  <div className="flex items-center gap-4">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#64ffda] rounded-full"></div>
                        {repo.language}
                      </span>
                    )}
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>🍴 {repo.forks_count}</span>
                  </div>
                  {repo.homepage && (
                    <Link
                      href={repo.homepage}
                      target="_blank"
                      className="text-[#64ffda] hover:text-[#64ffda]/80 transition-colors"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {githubRepos.length === 0 && (
            <div className="text-center text-[#8892b0] py-12">
              <Github size={48} className="mx-auto mb-4 text-[#64ffda]" />
              <p>Unable to load GitHub repositories</p>
            </div>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects_freelancing" className="py-20 px-6 bg-[#0a192f]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-[#ccd6f6] mb-12 relative">
            <span className="text-[#64ffda] text-2xl mr-2 font-mono">03.</span>
            Freelancing & Projects
            <div className="absolute bottom-0 left-0 w-24 h-0.5 bg-[#64ffda]"></div>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-[#112240] rounded-2xl overflow-hidden border border-[#233554] hover:border-[#64ffda]/50 transition-all duration-300 group">
                {/* Project Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="flex gap-3 w-full">
                      {project.github && (
                        <Link
                          href={project.github}
                          target="_blank"
                          className="flex-1 bg-[#64ffda] text-[#0a192f] py-2 px-4 rounded text-center text-sm hover:bg-[#64ffda]/90 transition-colors font-mono font-semibold"
                        >
                          Code
                        </Link>
                      )}
                      {project.liveDemo && (
                        <Link
                          href={project.liveDemo}
                          target="_blank"
                          className="flex-1 bg-transparent border border-[#64ffda] text-[#64ffda] py-2 px-4 rounded text-center text-sm hover:bg-[#64ffda]/10 transition-colors font-mono flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={16} />
                          Live
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#ccd6f6] mb-3">{project.title}</h3>
                  <p className="text-[#8892b0] mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(project?.tech ?? []).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-xs bg-[#64ffda]/10 text-[#64ffda] px-3 py-1 rounded-full border border-[#64ffda]/20 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
     

      <section id="skills" className="py-20 px-6 bg-[#112240]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-[#ccd6f6] mb-12 relative">
            <span className="text-[#64ffda] text-2xl mr-2 font-mono">04.</span>
            Skills & Technologies
            <div className="absolute bottom-0 left-0 w-24 h-0.5 bg-[#64ffda]"></div>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0a192f] rounded-2xl p-6 border border-[#233554] hover:border-[#64ffda]/50 transition-colors">
              <h3 className="text-xl font-bold text-[#ccd6f6] mb-4 flex items-center gap-2">
                <Palette size={20} className="text-[#64ffda]" />
                Frontend
              </h3>
              <ul className="space-y-2">
                {skills.frontend.map((skill, index) => (
                  <li key={index} className="text-[#8892b0] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#64ffda] rounded-full"></div>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0a192f] rounded-2xl p-6 border border-[#233554] hover:border-[#64ffda]/50 transition-colors">
              <h3 className="text-xl font-bold text-[#ccd6f6] mb-4 flex items-center gap-2">
                <Server size={20} className="text-[#64ffda]" />
                Backend
              </h3>
              <ul className="space-y-2">
                {skills.backend.map((skill, index) => (
                  <li key={index} className="text-[#8892b0] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#64ffda] rounded-full"></div>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0a192f] rounded-2xl p-6 border border-[#233554] hover:border-[#64ffda]/50 transition-colors">
              <h3 className="text-xl font-bold text-[#ccd6f6] mb-4 flex items-center gap-2">
                <Code size={20} className="text-[#64ffda]" />
                Tools & Other
              </h3>
              <ul className="space-y-2">
                {skills.tools.map((skill, index) => (
                  <li key={index} className="text-[#8892b0] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#64ffda] rounded-full"></div>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>


       <section id="blogs" className="py-20 px-6 bg-[#112240]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-[#ccd6f6] mb-12 relative">
            <span className="text-[#64ffda] text-2xl mr-2 font-mono">05.</span>
            Latest From My Blog
            <div className="absolute bottom-0 left-0 w-24 h-0.5 bg-[#64ffda]"></div>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {blogs.slice(0, 4).map((blog) => (
              <div key={blog._id} className="bg-[#0a192f] rounded-2xl overflow-hidden border border-[#233554] hover:border-[#64ffda]/50 transition-all duration-300 group">
                
                {/* Thumbnail */}
                {blog.thumbnail && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#ccd6f6] mb-2 group-hover:text-[#64ffda] transition-colors">{blog.title}</h3>
                  <p className="text-[#64ffda] text-xs mb-3 font-mono flex items-center gap-2">
                    <Calendar size={14} />
                    {blog.readTime}
                  </p>
                  
                  {/* Render HTML content preview */}
                  <div
                    className="text-[#8892b0] text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  ></div>

                  <Link
                    href={`/blogs/${blog._id}`}
                    className="inline-flex items-center gap-2 text-[#64ffda] hover:text-[#64ffda]/80 transition-colors text-sm font-mono"
                  >
                    Read More
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Blogs Button */}
          <div className="flex justify-center mt-8">
            <Link
              href="/blogs"
              className="bg-transparent border border-[#64ffda] text-[#64ffda] py-3 px-8 rounded-lg text-sm font-mono hover:bg-[#64ffda]/10 transition-all duration-200"
            >
              View All Blogs
            </Link>
          </div>
        </div>
      </section>

       <section id="Experience" className="py-20 px-6 bg-[#112240]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-[#ccd6f6] mb-12 relative">
            <span className="text-[#64ffda] text-2xl mr-2 font-mono">06.</span>
            Experence & Certifications
            <div className="absolute bottom-0 left-0 w-24 h-0.5 bg-[#64ffda]"></div>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((cert, index) => (
              <div key={index} className="bg-[#0a192f] rounded-2xl p-4 border border-[#233554] hover:border-[#64ffda]/50 transition-colors">
                <img src={cert.image} alt={cert.title} className="w-full h-80 object-contain mb-4" />
                <h3 className="text-xl font-bold text-[#ccd6f6] mb-2">{cert.title}</h3>
                <p className="text-[#8892b0] text-sm flex items-center gap-2">
                  <Calendar size={14} />
                  {cert.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-[#0a192f]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-[#ccd6f6] mb-4">Get In Touch</h2>

          <p className="text-[#8892b0] text-lg mb-8 max-w-2xl mx-auto">
            I'm currently looking for work as a freelancer,and my inbox is always open.
            Whether you have a question or just want to say hi, I'll do my best to get back to you!
          </p>

          <Link
            href="mailto:n31mahesh@gmail.com"
            className="inline-flex items-center gap-2 border border-[#64ffda] text-[#64ffda] px-8 py-3 rounded-lg hover:bg-[#64ffda]/10 transition-colors mb-8 font-mono"
          >
            <Mail size={20} />
            Say Hello
          </Link>

          <div className="flex justify-center gap-6">
            <Link href="https://github.com/devmahesh-5" target="_blank" className="text-[#8892b0] hover:text-[#64ffda] transition-colors">
              <Github size={24} />
            </Link>
            <Link href="https://www.linkedin.com/in/mahesh-bhandari-b901a4312/" target="_blank" className="text-[#8892b0] hover:text-[#64ffda] transition-colors">
              <Linkedin size={24} />
            </Link>
            <Link href="#" target="_blank" className="text-[#8892b0] hover:text-[#64ffda] transition-colors">
              <Twitter size={24} />
            </Link>
            <Link href="https://www.facebook.com/mahesh.bhandari.31149359/" target="_blank" className="text-[#8892b0] hover:text-[#64ffda] transition-colors">
              <Facebook size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a192f] border-t border-[#112240] py-8 px-6">
        <div className="container mx-auto text-center text-[#8892b0] text-sm">
          <p>&copy; {new Date().getFullYear()} Mahesh Bhandari. All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}