'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, LogIn } from 'lucide-react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login, logout } from '@/store/authSlice';
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // API call to login
      const response = await axios.post('/api/users/login', formData);
      
      if (response.data.success) {
        console.log('Login successful', response.data);
        dispatch(login(response.data.user));
        router.push('/'); // Redirect to home or dashboard
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] pt-20">
      <div className="container mx-auto px-6 py-8 max-w-md">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#64ffda] hover:text-[#64ffda]/80 transition-colors mb-8 font-mono"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-[#112240] rounded-2xl p-8 border border-[#233554] shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#64ffda]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn size={32} className="text-[#64ffda]" />
            </div>
            <h1 className="text-3xl font-bold text-[#ccd6f6] mb-2">
              Welcome Back
            </h1>
            <p className="text-[#8892b0]">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-4 mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#ccd6f6] uppercase tracking-wide flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full bg-[#0a192f] border border-[#233554] rounded-lg px-4 py-3 text-[#ccd6f6] placeholder-[#8892b0] focus:border-[#64ffda] focus:outline-none transition-colors"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#ccd6f6] uppercase tracking-wide flex items-center gap-2">
                <Lock size={16} />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-[#0a192f] border border-[#233554] rounded-lg px-4 py-3 text-[#ccd6f6] placeholder-[#8892b0] focus:border-[#64ffda] focus:outline-none transition-colors pr-12"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8892b0] hover:text-[#64ffda] transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
        

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="w-full bg-[#64ffda] text-[#0a192f] px-6 py-3 rounded-lg font-semibold hover:bg-[#64ffda]/90 disabled:bg-[#64ffda]/50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#0a192f] border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

        
        </div>

        {/* Security Notice */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#8892b0]">
            Your data is securely encrypted and protected
          </p>
        </div>
      </div>
    </div>
  );
}