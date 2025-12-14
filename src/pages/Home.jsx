import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

function Home() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const querySnapshot = await getDocs(collection(db, 'courses'));
                const coursesList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCourses(coursesList);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchCourses();
        }
    }, [user, authLoading]);

    const filteredCourses = courses.filter(course =>
        (course.type !== 'ongoing') &&
        (course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
            {/* Dark Premium Hero Section */}
            <section className="relative bg-slate-900 pt-24 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-slate-900/95 to-slate-900/90"></div>

                <div className="container-custom relative z-10 text-center max-w-4xl mx-auto px-6">
                    <div className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mb-6 animate-fadeIn">
                        <span className="flex w-2 h-2 bg-indigo-400 rounded-full mr-2 animate-pulse"></span>
                        Trusted by 10,000+ developers
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 animate-slideInRight">
                        Master Java Programming <br />
                        <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">The Modern Way</span>
                    </h1>

                    <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10 animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
                        Comprehensive courses, interactive exercises, and a supportive community. Everything you need to go from beginner to pro.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                        <a href="#courses" className="btn-primary px-8 py-4 text-lg shadow-glow-lg rounded-xl">
                            Start Learning Free
                        </a>
                        {!user && (
                            <Link to="/login" className="px-8 py-4 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-sm">
                                Resume Learning
                            </Link>
                        )}
                    </div>
                </div>

                {/* Floating Stats Card */}
                <div className="container-custom px-6 relative z-10 mt-16 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                    <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: "Active Learners", val: "10K+" },
                            { label: "Video Lessons", val: "500+" },
                            { label: "Lines of Code", val: "1M+" },
                            { label: "Community Rating", val: "4.9/5" }
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                                <div className="text-indigo-200 text-sm font-medium uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-1">
                    <svg viewBox="0 0 1440 120" fill="none" className="w-full">
                        <path d="M0 48L48 64C96 80 192 112 288 112C384 112 480 80 576 69.3C672 59 768 69 864 74.7C960 80 1056 80 1152 69.3C1248 59 1344 37 1392 26.7L1440 16V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V48Z" fill="#f8fafc" />
                    </svg>
                </div>
            </section>

            {/* Courses Section */}
            <section id="courses" className="py-24 bg-slate-50 min-h-[600px]">
                <div className="container-custom px-6">

                    {/* Logged Out State */}
                    {!user ? (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
                                <div className="md:w-1/2 p-12 bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex flex-col justify-center">
                                    <h2 className="text-3xl font-bold mb-6">Unlock Your Potential</h2>
                                    <p className="text-indigo-100 mb-8 leading-relaxed">
                                        Join our community of developers and get unlimited access to all courses, projects, and certification tracks.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Access to all 50+ premium courses",
                                            "Interactive coding environments",
                                            "Project-based learning path",
                                            "Certificate of completion"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center text-indigo-50">
                                                <svg className="w-5 h-5 mr-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="md:w-1/2 p-12 flex flex-col justify-center items-center text-center">
                                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to start?</h3>
                                    <p className="text-slate-600 mb-8">Create your free account today.</p>
                                    <Link to="/signup" className="btn-primary w-full py-4 text-lg mb-4">Create Free Account</Link>
                                    <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">Already a member? Sign In</Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Logged In State */}
                            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                                <div className="text-center md:text-left">
                                    <h2 className="text-indigo-600 font-semibold mb-2 tracking-wide uppercase">Your Learning Path</h2>
                                    <h3 className="text-4xl font-bold text-slate-900">Explore Courses</h3>
                                </div>

                                <div className="w-full md:w-96 relative">
                                    <input
                                        type="text"
                                        placeholder="Search topics..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                    <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                            </div>

                            {filteredCourses.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="inline-block p-6 rounded-full bg-slate-100 text-slate-400 mb-4">
                                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-700">No courses found matching "{searchQuery}"</h3>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredCourses.map((course) => (
                                        <Link key={course.id} to={`/course/${course.id}`} className="group h-full">
                                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col overflow-hidden relative">
                                                {/* Top Colored Accent */}
                                                <div className="h-2 w-full" style={{ backgroundColor: course.color || '#6366f1' }}></div>

                                                <div className="p-8 flex flex-col flex-grow">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform" style={{ backgroundColor: `${course.color}15` }}>
                                                            {course.icon}
                                                        </div>
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                                            {course.topicCount || 0} Lessons
                                                        </span>
                                                    </div>

                                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{course.name}</h3>
                                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">{course.description}</p>

                                                    <div className="mt-auto border-t border-slate-50 pt-4 flex items-center justify-between text-indigo-600 font-semibold text-sm">
                                                        <span>Start Learning</span>
                                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-60"></div>

                <div className="container-custom px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-indigo-600 font-semibold mb-2 tracking-wide uppercase">The JavaMastery Difference</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why learn with us?</h3>
                        <p className="text-lg text-slate-600">We don't just teach syntax; we teach you how to think like a developer.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
                                title: "Hands-on Labs",
                                desc: "Don't just watch videos. Write code in real-time with our interactive exercises and instant feedback.",
                                color: "indigo"
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                                title: "Industry Standard",
                                desc: "Learn the tools and practices used by top tech companies. From Git workflows to clean code principles.",
                                color: "emerald"
                            },
                            {
                                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
                                title: "Community Support",
                                desc: "Get unstuck quickly with our active Discord community and mentor support system.",
                                color: "violet"
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl transition-all duration-300">
                                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 text-${feature.color}-600 flex items-center justify-center mb-6`}>
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {feature.icon}
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
