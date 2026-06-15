import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      // toast handled in context
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      await googleLogin(response.credential);
      navigate(from, { replace: true });
    } catch (err) {
      // toast handled in context
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side: Brand Section (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#760000] items-center justify-center overflow-hidden">
        {/* Back Button (Desktop) */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 z-20 group flex items-center gap-2 text-sm font-bold text-red-100/80 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </button>

        {/* Abstract Background Design */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-white/10 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-black/20 blur-[120px]"></div>
        </div>

        <div className="relative z-10 text-center px-12">
          <Link to="/" className="inline-block mb-8 transform hover:scale-105 transition-transform duration-500">
             <img src="/logo-nav.webp" alt="CRAFTORIA" className="h-24 w-auto brightness-0 invert" />
          </Link>
          
          <div className="space-y-6 max-w-lg mx-auto">
            <h1 className="text-4xl xl:text-5xl font-serif font-bold text-white leading-tight">
              Handcrafted with Love, <br />
              <span className="text-red-200">Forever Wrapped.</span>
            </h1>
            <p className="text-red-50/80 text-lg font-sans leading-relaxed">
              Experience the art of thoughtful gifting. Join our community and discover unique, personalized treasures for every occasion.
            </p>
            
            <div className="pt-8 grid grid-cols-2 gap-4 text-left">
              <div className="flex items-center gap-3 text-red-100/90 text-sm">
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
                <span>Exclusive Collections</span>
              </div>
              <div className="flex items-center gap-3 text-red-100/90 text-sm">
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
                <span>Express Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Brand Credit */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-red-200/40 text-xs tracking-[0.2em] uppercase font-bold">
            Craftoria &copy; 2026 • Premium Gifting
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-[#fafafa] relative overflow-hidden">
        {/* Subtle background Blobs for mobile/tablet */}
        <div className="lg:hidden absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-50 blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-50 blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile Logo (visible only on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <img src="/logo-nav-alt.webp" alt="CRAFTORIA" className="h-14 w-auto mx-auto" />
            </Link>
          </div>

          {/* Back Button (Mobile) */}
          <button 
            onClick={() => navigate(-1)}
            className="lg:hidden group mb-6 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#760000] transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="p-5 sm:p-7">
              <div className="mb-5">
                <h2 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
                  Welcome Back
                </h2>
                <p className="mt-1 text-xs text-gray-500 font-sans">
                  Please enter your details
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="email-address" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#760000] transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#760000]/20 focus:border-[#760000] focus:bg-white transition-all text-sm"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 ml-1">
                      <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Password
                      </label>
                      <Link to="/forgot-password" size="xs" className="text-xs font-bold text-[#760000] hover:text-black transition-colors">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#760000] transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#760000]/20 focus:border-[#760000] focus:bg-white transition-all text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-0.5">
                  <button
                    type="submit"
                    className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-[#760000] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/20 hover:bg-black transition-all duration-300 transform active:scale-[0.98] mt-0.5"
                  >
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>

              <div className="mt-5">
                <div className="relative flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <div className="h-px w-full bg-gray-100"></div>
                  <span className="whitespace-nowrap scale-90">Or Social Login</span>
                  <div className="h-px w-full bg-gray-100"></div>
                </div>

                <div className="mt-5">
                  <div className="w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => console.log('Login Failed')}
                      useOneTap
                      theme="outline"
                      shape="pill"
                      width="100%"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-100 p-6 text-center">
              <p className="text-sm text-gray-600">
                New to CRAFTORIO?{' '}
                <Link to="/register" className="font-bold text-[#760000] hover:text-black transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
