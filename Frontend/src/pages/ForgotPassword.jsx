import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, KeyRound, Eye, EyeOff } from 'lucide-react';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const navigate = useNavigate();

    const handleRequestCode = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/forgot-password', { email });
            if (response.data.success) {
                toast.success('Verification code sent to your email');
                setStep(2);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if (code.length !== 6) {
            return toast.error('Please enter a valid 6-digit code');
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/verify-reset-code', { email, code });
            if (response.data.success) {
                toast.success('Code verified successfully');
                setStep(3);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired code');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/reset-password', { email, code, newPassword });
            if (response.data.success) {
                toast.success('Password reset successful! Please login.');
                navigate('/login');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Left Side: Brand Section */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#760000] items-center justify-center overflow-hidden">
                {/* Back Button (Desktop) */}
                <button
                    onClick={() => navigate('/login')}
                    className="absolute top-8 left-8 z-20 group flex items-center gap-2 text-sm font-bold text-red-100/80 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </button>

                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-white/10 blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-black/20 blur-[120px]"></div>
                </div>

                <div className="relative z-10 text-center px-12">
                    <Link to="/" className="inline-block mb-8 transform hover:scale-105 transition-transform duration-500">
                        <img src="/logo2.png" alt="CRAFTORIAL" className="h-24 w-auto brightness-0 invert" />
                    </Link>

                    <div className="space-y-6 max-w-lg mx-auto text-white">
                        <h1 className="text-4xl xl:text-5xl font-serif font-bold leading-tight">
                            {step === 1 ? 'Recover Access.' : step === 2 ? 'Verify Identity.' : 'Reset Security.'} <br />
                            <span className="text-red-200">Secure & Simple.</span>
                        </h1>
                        <p className="text-red-50/80 text-lg font-sans leading-relaxed">
                            {step === 1 ? 'Enter your email to start the recovery process.' : step === 2 ? 'Check your inbox for the 6-digit verification code.' : 'Create a strong new password to protect your account.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Process Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#fafafa] relative overflow-hidden">
                <div className="relative z-10 w-full max-w-md">
                    <button
                        onClick={() => {
                            if (step === 2) setStep(1);
                            else if (step === 3) setStep(2);
                            else navigate('/login');
                        }}
                        className="group mb-5 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#760000] transition-colors"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        {step === 1 ? 'Login' : 'Previous Step'}
                    </button>

                    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100">
                        <div className="p-6 sm:p-8">
                            {/* Step Indicator */}
                            <div className="flex justify-center gap-2 mb-8">
                                {[1, 2, 3].map((s) => (
                                    <div
                                        key={s}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-[#760000]' : 'w-4 bg-gray-200'}`}
                                    />
                                ))}
                            </div>

                            {step === 1 && (
                                <>
                                    <div className="mb-8 text-center">
                                        <h2 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
                                            Account Recovery
                                        </h2>
                                        <p className="mt-1 text-xs text-gray-500">Provide your account email</p>
                                    </div>

                                    <form className="space-y-6" onSubmit={handleRequestCode}>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#760000] transition-colors">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#760000]/20 focus:border-[#760000] focus:bg-white transition-all outline-none"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#760000] hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {loading ? 'Sending...' : 'Send Code'} <ArrowRight size={18} />
                                        </button>
                                    </form>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="mb-8 text-center">
                                        <h2 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
                                            Check Email
                                        </h2>
                                        <p className="mt-1 text-xs text-gray-500">Enter code sent to <span className="text-[#760000] font-bold">{email}</span></p>
                                    </div>

                                    <form className="space-y-6" onSubmit={handleVerifyCode}>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#760000] transition-colors">
                                                <ShieldCheck size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                maxLength="6"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-xl font-bold tracking-[0.4em] focus:ring-2 focus:ring-[#760000]/20 focus:border-[#760000] outline-none"
                                                placeholder="000000"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#760000] hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {loading ? 'Verifying...' : 'Verify Code'} <ArrowRight size={18} />
                                        </button>
                                        <button type="button" onClick={() => handleRequestCode()} className="w-full text-xs font-bold text-[#760000] hover:underline">
                                            Resend Code
                                        </button>
                                    </form>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <div className="mb-8 text-center">
                                        <h2 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
                                            New Password
                                        </h2>
                                        <p className="mt-1 text-xs text-gray-500 font-sans">Set a strong password for your account</p>
                                    </div>

                                    <form className="space-y-4" onSubmit={handleResetPassword}>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#760000] transition-colors">
                                                <KeyRound size={18} />
                                            </div>
                                            <input
                                                type={showPass ? 'text' : 'password'}
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#760000]/20 focus:border-[#760000]"
                                                placeholder="New Password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPass(!showPass)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#760000]"
                                            >
                                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>

                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#760000] transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type={showPass ? 'text' : 'password'}
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#760000]/20 focus:border-[#760000]"
                                                placeholder="Confirm New Password"
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-[#760000] hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                                            >
                                                {loading ? 'Updating...' : 'Update Password'} <CheckCircle2 size={18} />
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>

                        <div className="bg-gray-50 border-t border-gray-100 p-6 text-center">
                            <p className="text-sm text-gray-600">
                                Remember your password?{' '}
                                <Link to="/login" className="font-bold text-[#760000] hover:text-black transition-colors">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
