import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

function OngoingCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'courses'));
                const coursesList = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(c => c.type === 'ongoing'); // FILTER FOR ONGOING ONLY
                setCourses(coursesList);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Hero Section */}
            <section className="relative bg-slate-900 pt-24 pb-32 overflow-hidden text-white">
                <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')" }}></div>
                <div className="container-custom relative z-10 text-center max-w-4xl mx-auto px-6">
                    <div className="inline-flex items-center rounded-full bg-indigo-500/10 px-4 py-1.5 text-sm font-bold border border-indigo-500/20 mb-6 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
                        Live Cohorts & Ongoing Batches
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        Learn Live with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Industry Experts</span>
                    </h1>
                    <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
                        Join our immersive, instructor-led cohorts. Get real-time feedback, work on live projects, and accelerate your career growth.
                    </p>
                </div>
            </section>

            {/* Course List */}
            <section className="py-20 -mt-20 relative z-20 container-custom px-6">
                {courses.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-slate-100">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            🚧
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No Ongoing Batches</h3>
                        <p className="text-slate-500">Check back later for new cohort announcements.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <Link key={course.id} to={`/course/${course.id}`} className="group h-full">
                                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col overflow-hidden relative">
                                    <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-violet-500"></div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                                                {course.icon}
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                                                    ONGOING
                                                </span>
                                                <span className="text-xs font-semibold text-slate-400">
                                                    {course.topicCount || 0} Modules
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{course.name}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">{course.description}</p>

                                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-indigo-600 font-bold text-sm">
                                            <span>Join Cohort</span>
                                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default OngoingCourses;
