import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

function LiveClass() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex-center h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-indigo-900 to-slate-900 text-white overflow-hidden py-20">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container-custom relative z-10 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/50 text-sm font-bold mb-6 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        LIVE NOW
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Interactive Live <span className="text-indigo-400">Classroom</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        Join the session, ask questions in real-time, and master advanced concepts with expert instructors.
                    </p>
                </div>
            </section>

            {/* Live Stream Container */}
            <section className="container-custom -mt-16 relative z-20 pb-20">
                <div className="bg-black rounded-2xl shadow-2xl overflow-hidden aspect-video border-4 border-slate-800 relative group">
                    {/* Stream Placeholder */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-900">
                        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6 shadow-xl border border-slate-700">
                            <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Waiting for Host...</h3>
                        <p className="text-slate-400 max-w-md">The live stream hasn't started yet. Please check the schedule or wait for the notification.</p>
                    </div>

                    {/* Controls Overlay (Mockup) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4">
                            <button className="text-white hover:text-indigo-400 transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></button>
                            <div className="text-white text-sm">
                                <span className="font-bold">Next:</span> Understanding Java Streams
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <span className="text-xs bg-red-600 px-2 py-1 rounded">LIVE</span>
                            <span className="text-xs">124 Viewers</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Class Info */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Java Mastery: Advanced Algorithms</h2>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                In this session, we dive deep into Graph algorithms (BFS, DFS) and their practical applications.
                                Make sure you have your IDE ready for some live coding exercises!
                            </p>
                            <div className="flex items-center gap-6 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>2 Hours</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    <span>Instructor: Bhanu</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Chat Box (Mockup) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[500px]">
                            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
                                <h3 className="font-bold text-slate-800">Live Chat</h3>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">JD</div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700">John Doe</p>
                                        <p className="text-sm text-slate-600">Is this recorded?</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0">SA</div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700">Sarah</p>
                                        <p className="text-sm text-slate-600">Yes, it will be available later!</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-100">
                                <input type="text" placeholder="Type a message..." className="input-field text-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LiveClass;
