import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    CalendarDays,
    Camera,
    Check,
    Heart,
    LockKeyhole,
    LogOut,
    Mail,
    Package,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Star,
    Trash2,
    UserRound,
    X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import giftDecor from '../assets/home/contact.png?w=960&format=webp&quality=78';

const softPanel =
    'rounded-[1.35rem] border border-red-100/90 bg-white/82 shadow-[0_24px_80px_rgba(118,0,0,0.06)] backdrop-blur-sm';

const iconBubble = 'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-red-100 bg-red-50 text-[#b60000]';

const Profile = () => {
    const { user, logout, setUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    if (!user) return null;

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            const response = await api.delete('/auth/delete-account');
            if (response.data.success) {
                toast.success('Account deleted successfully');
                logout();
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete account');
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleSendCode = async () => {
        setLoading(true);
        try {
            await api.post('/auth/send-verification-email');
            toast.success('Verification code sent to your email');
            setShowVerifyModal(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/verify-email', { code: verificationCode });
            if (data.success) {
                toast.success('Email verified successfully!');
                setUser(data.user);
                setShowVerifyModal(false);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired code');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const { data } = await api.put('/auth/update-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (data.success) {
                toast.success('Profile picture updated');
                setUser(data.user);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const initials = user.name ? user.name.charAt(0).toUpperCase() : 'U';
    const joinedSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'June 2026';
    const authProvider = user.authProvider || 'local';
    const role = user.role || 'User';
    const orderCount = user.stats?.orderCount ?? 0;
    const reviewCount = user.stats?.reviewCount ?? 0;

    const detailCards = [
        {
            label: 'Status',
            value: user.isEmailVerified ? 'Verified Member' : 'Pending Verification',
            icon: user.isEmailVerified ? ShieldCheck : ShieldAlert,
            tone: user.isEmailVerified ? 'green' : 'amber',
            action: !user.isEmailVerified && authProvider === 'local' ? handleSendCode : null,
        },
        {
            label: 'Joined Since',
            value: joinedSince,
            icon: CalendarDays,
        },
        {
            label: 'Auth Type',
            value: `${authProvider} Account`,
            icon: LockKeyhole,
        },
        {
            label: 'Account Role',
            value: role,
            icon: UserRound,
        },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#fffdfc] px-4 pb-12 pt-28 font-sans text-gray-950 sm:px-6 lg:px-10 xl:px-16">
            <img
                src={giftDecor}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-10 -left-48 z-0 hidden w-[520px] max-w-none -scale-x-100 opacity-90 lg:block"
            />
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_28%,rgba(182,0,0,0.05),transparent_28%),radial-gradient(circle_at_70%_82%,rgba(182,0,0,0.055),transparent_32%)]" />

            <div className="relative z-10 mx-auto max-w-[1500px]">

                <header className="mb-7 text-center">
                    <h1 className="font-serif text-4xl font-bold tracking-tight text-[#2a0e0e] sm:text-5xl">
                        Account Settings
                    </h1>
                    <div className="mt-4 flex items-center justify-center gap-4 text-[#b60000]">
                        <span className="h-px w-10 bg-red-200" />
                        <Heart size={13} fill="currentColor" />
                        <span className="h-px w-10 bg-red-200" />
                    </div>
                </header>

                <div className="grid items-start gap-7 lg:grid-cols-[410px_minmax(0,1fr)] xl:gap-8">
                    <aside className={`${softPanel} relative overflow-hidden p-6 text-center sm:p-8 lg:min-h-[660px]`}>
                        <div className="absolute inset-x-0 top-0 h-3 bg-[#b60000]" />

                        <div className="mx-auto mt-10 w-fit">
                            <div className="relative">
                                <div className={`h-36 w-36 overflow-hidden rounded-full border-[6px] border-white bg-[#760000] shadow-[0_18px_40px_rgba(118,0,0,0.13)] sm:h-44 sm:w-44 ${uploading ? 'opacity-50' : ''}`}>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name || 'Profile'} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center font-serif text-6xl text-white">
                                            {initials}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="absolute bottom-2 right-0 flex h-14 w-14 items-center justify-center rounded-full border border-red-100 bg-white text-[#c30000] shadow-[0_12px_28px_rgba(182,0,0,0.18)] transition-transform hover:scale-105 disabled:opacity-50"
                                    aria-label="Upload profile picture"
                                >
                                    <Camera size={23} />
                                </button>
                                <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept="image/*" />

                                {uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#b60000] border-t-transparent" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="font-serif text-3xl font-bold text-[#2a0e0e]">{user.name || 'User'}</h2>
                            <p className="mt-2 break-words text-base font-medium text-gray-500">{user.email}</p>
                        </div>

                        <div className="mx-auto my-10 flex max-w-[320px] items-center justify-center gap-4 text-[#b60000]">
                            <span className="h-px flex-1 bg-red-200" />
                            <Heart size={13} fill="currentColor" />
                            <span className="h-px flex-1 bg-red-200" />
                        </div>

                        <div className="mx-auto grid max-w-[290px] grid-cols-2 divide-x divide-red-100">
                            <div className="flex flex-col items-center px-4">
                                <div className={iconBubble}>
                                    <Package size={24} />
                                </div>
                                <p className="mt-5 text-3xl font-extrabold text-gray-950">{orderCount}</p>
                                <p className="mt-1 text-base font-medium text-gray-600">Orders</p>
                            </div>
                            <div className="flex flex-col items-center px-4">
                                <div className={iconBubble}>
                                    <Star size={24} />
                                </div>
                                <p className="mt-5 text-3xl font-extrabold text-gray-950">{reviewCount}</p>
                                <p className="mt-1 text-base font-medium text-gray-600">Reviews</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-14 inline-flex w-full max-w-[340px] items-center justify-center gap-3 rounded-lg border border-[#d10000] bg-white px-6 py-4 text-base font-bold text-[#c30000] transition-all hover:bg-[#c30000] hover:text-white"
                        >
                            <LogOut size={22} />
                            Sign Out
                        </button>
                    </aside>

                    <section className="space-y-7">
                        <div className={`${softPanel} p-6 sm:p-8 lg:p-10`}>
                            <div className="mb-8 flex items-center gap-4">
                                <div className={iconBubble}>
                                    <UserRound size={27} />
                                </div>
                                <h2 className="font-serif text-3xl font-bold text-gray-950">Account Details</h2>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {detailCards.map((item) => {
                                    const Icon = item.icon;
                                    const isGreen = item.tone === 'green';
                                    const isAmber = item.tone === 'amber';
                                    return (
                                        <div
                                            key={item.label}
                                            className="flex min-h-[110px] items-center gap-5 rounded-[1.1rem] border border-red-100 bg-white/70 p-5 shadow-[0_16px_44px_rgba(118,0,0,0.035)]"
                                        >
                                            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border ${isGreen ? 'border-green-100 bg-green-50 text-green-600' : isAmber ? 'border-amber-100 bg-amber-50 text-amber-600' : 'border-red-100 bg-red-50 text-[#b60000]'}`}>
                                                <Icon size={26} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-base font-medium text-gray-500">{item.label}</p>
                                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                                    <p className={`text-lg font-extrabold capitalize leading-snug ${isGreen ? 'text-green-600' : isAmber ? 'text-amber-600' : 'text-gray-950'}`}>
                                                        {item.value}
                                                    </p>
                                                    {isGreen && <Check size={19} className="rounded-full bg-green-600 p-0.5 text-white" />}
                                                    {item.action && (
                                                        <button
                                                            type="button"
                                                            onClick={item.action}
                                                            disabled={loading}
                                                            className="rounded-full bg-[#b60000] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#760000] disabled:opacity-50"
                                                        >
                                                            Verify
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={`${softPanel} relative min-h-[320px] overflow-hidden p-6 sm:p-8 lg:p-10`}>
                            <img
                                src={giftDecor}
                                alt=""
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full object-cover object-right opacity-95 md:block"
                            />
                            <div className="relative z-10 max-w-[620px]">
                                <div className="mb-5 flex items-center gap-4">
                                    <div className={iconBubble}>
                                        <BadgeCheck size={27} />
                                    </div>
                                    <h2 className="font-serif text-3xl font-bold text-gray-950">Security & Privacy</h2>
                                </div>
                                <p className="max-w-[560px] text-base font-medium leading-8 text-gray-600">
                                    Permanently remove all your account data, orders, and history.
                                    <br />
                                    This action cannot be undone.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="mt-8 inline-flex items-center justify-center gap-3 rounded-lg border border-[#d10000] bg-white px-8 py-4 text-sm font-extrabold text-[#c30000] transition-all hover:bg-[#c30000] hover:text-white"
                                >
                                    <Trash2 size={21} />
                                    Delete My Account
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {showVerifyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowVerifyModal(false)} />
                    <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-white p-4 shadow-2xl">
                        <div className="rounded-[1.5rem] bg-gray-50 p-8">
                            <button onClick={() => setShowVerifyModal(false)} className="absolute right-8 top-8 text-gray-400 hover:text-gray-900" aria-label="Close verification modal">
                                <X size={20} />
                            </button>

                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#760000]/10 text-[#760000]">
                                <Mail size={32} />
                            </div>

                            <h2 className="mb-2 font-serif text-2xl font-bold text-gray-900">Check Email</h2>
                            <p className="mb-8 text-sm leading-relaxed text-gray-500">
                                Enter the 6-digit verification code we just sent to your inbox.
                            </p>

                            <form onSubmit={handleVerifyEmail} className="space-y-6">
                                <input
                                    type="text"
                                    maxLength="6"
                                    required
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="w-full rounded-2xl border border-gray-200 bg-white py-4 text-center text-2xl font-bold tracking-[0.5em] outline-none transition-all focus:border-[#760000] focus:ring-4 focus:ring-[#760000]/10"
                                    placeholder="000000"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#760000] py-4 font-bold text-white shadow-xl shadow-red-900/10 transition-all hover:bg-black disabled:opacity-50"
                                >
                                    {loading ? 'Verifying...' : 'Verify Now'} <ArrowRight size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowDeleteConfirm(false)} />
                    <div className="relative w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <Trash2 size={40} />
                        </div>
                        <h2 className="mb-3 text-center font-serif text-2xl font-bold text-gray-900">Final Request</h2>
                        <p className="mb-8 px-4 text-center text-sm leading-relaxed text-gray-500">
                            Are you sure you want to delete your account? This will permanently erase your data.
                        </p>
                        <div className="space-y-4">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50"
                            >
                                {loading ? 'Deleting...' : 'Confirm Deletion'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="w-full rounded-2xl bg-gray-50 py-4 font-bold text-gray-600 transition-all hover:bg-gray-100"
                            >
                                Not Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
