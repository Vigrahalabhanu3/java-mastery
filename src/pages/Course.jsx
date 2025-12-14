import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

function Course() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Fetch course details
                const courseDocRef = doc(db, 'courses', courseId);
                const courseDoc = await getDoc(courseDocRef);

                if (courseDoc.exists()) {
                    setCourse({ id: courseDoc.id, ...courseDoc.data() });

                    // Fetch topics for this course
                    const topicsColRef = collection(db, 'courses', courseId, 'topics');
                    const topicsSnapshot = await getDocs(topicsColRef);
                    const topicsList = topicsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setTopics(topicsList);
                }
            } catch (error) {
                console.error("Error fetching course data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchCourseData();
        }
    }, [courseId, user, authLoading]);

    // Redirect to login if not authenticated
    if (!authLoading && !user) {
        return <Navigate to="/login" />;
    }

    const filteredTopics = topics.filter(topic =>
        topic.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading || authLoading) {
        return (
            <div className="min-h-screen">
                <div className="container-custom section">
                    <div className="skeleton-shimmer h-8 w-32 mb-8"></div>
                    <div className="skeleton-shimmer h-64 rounded-2xl mb-12"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="skeleton-shimmer h-48 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container-custom section text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex-center">
                    <svg className="w-12 h-12 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Course Not Found</h2>
                <p className="text-slate-600 mb-8">The course you're looking for doesn't exist or has been removed.</p>
                <Link to="/" className="btn-primary inline-block">
                    Back to Courses
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-slate-200">
                <div className="container-custom py-4">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link to="/" className="text-slate-500 hover:text-primary-600 transition-colors">
                            Courses
                        </Link>
                        <svg className="w-4 h-4 text-slate-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-slate-700 font-medium truncate">{course.name}</span>
                    </nav>
                </div>
            </div>

            {/* Course Header */}
            <section className="relative bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container-custom section relative z-10">
                    <Link
                        to="/"
                        className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors font-medium group"
                    >
                        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Courses
                    </Link>

                    <div className="max-w-4xl">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="text-6xl">{course.icon}</div>
                            <div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                                    {course.name}
                                </h1>
                            </div>
                        </div>
                        <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
                            {course.description}
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex-center">
                                    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{topics.length}</div>
                                    <div className="text-primary-100 text-sm">Topics</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(248 250 252)" />
                    </svg>
                </div>
            </section>

            {/* Topics Section */}
            <section className="container-custom section">
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-12 pr-4 py-4 text-lg shadow-md"
                        />
                        <svg
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                        Course Topics
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Explore comprehensive topics and master {course.name}
                    </p>
                </div>

                {/* Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTopics.map((topic, index) => (
                        <Link
                            key={topic.id}
                            to={`/course/${courseId}/topic/${topic.id}`}
                            className="group block h-full animate-fadeIn"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="card-hover h-full p-6 flex flex-col relative overflow-hidden">
                                {/* Gradient Border Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                <div className="absolute inset-[2px] bg-white rounded-xl z-0"></div>

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Topic Number Badge */}
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-500 text-white font-bold mb-4 group-hover:scale-110 transition-transform">
                                        {index + 1}
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-primary-600 transition-colors">
                                        {topic.title}
                                    </h3>

                                    <p className="text-slate-600 line-clamp-3 mb-4 flex-grow leading-relaxed">
                                        {topic.description}
                                    </p>

                                    {/* Read More Link */}
                                    <div className="flex items-center text-primary-600 font-semibold text-sm mt-auto group-hover:translate-x-2 transition-transform">
                                        <span>Read Article</span>
                                        <svg
                                            className="w-5 h-5 ml-2"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {filteredTopics.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300">
                        <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex-center">
                            <svg
                                className="w-12 h-12 text-slate-400"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                            {searchQuery ? 'No topics found' : 'No topics available yet'}
                        </h3>
                        <p className="text-slate-500 text-lg mb-6">
                            {searchQuery
                                ? 'Try adjusting your search query'
                                : 'Topics will be added soon'}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="btn-primary"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Course;
