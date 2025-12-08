import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

function Home() {
    const [topics, setTopics] = useState([]);
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
        const fetchTopics = async () => {
            // Only fetch topics if user is logged in
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const querySnapshot = await getDocs(collection(db, 'java_topics'));
                const topicsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTopics(topicsList);
            } catch (error) {
                console.error("Error fetching topics:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchTopics();
        }
    }, [user, authLoading]);

    const filteredTopics = topics.filter(topic =>
        topic.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen">
                {/* Hero Skeleton */}
                <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white">
                    <div className="container-custom section">
                        <div className="skeleton-shimmer h-16 w-3/4 mx-auto mb-6"></div>
                        <div className="skeleton-shimmer h-8 w-1/2 mx-auto"></div>
                    </div>
                </div>

                {/* Topics Skeleton */}
                <div className="container-custom section">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="skeleton-shimmer h-64 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container-custom section relative z-10">
                    <div className="text-center max-w-4xl mx-auto animate-fadeIn">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                            Master Java Programming
                        </h1>
                        <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Explore comprehensive tutorials, interactive Q&A, and hands-on examples. From basics to advanced concepts.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a
                                href="#topics"
                                className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                            >
                                Explore Topics
                            </a>
                            <Link
                                to="/signup"
                                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300"
                            >
                                Get Started Free
                            </Link>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
                        <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                            <div className="text-4xl font-bold mb-2">{topics.length}+</div>
                            <div className="text-indigo-100">Topics Covered</div>
                        </div>
                        <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-indigo-100">Practice Questions</div>
                        </div>
                        <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                            <div className="text-4xl font-bold mb-2">1000+</div>
                            <div className="text-indigo-100">Active Learners</div>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Search and Topics Section */}
            <section id="topics" className="container-custom section">
                {/* Show login prompt if user is not authenticated */}
                {!user && !authLoading ? (
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12">
                            {/* Lock Icon */}
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>

                            {/* Heading */}
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                Sign In to Access Topics
                            </h2>

                            {/* Description */}
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Create a free account or sign in to unlock access to our comprehensive Java learning resources, interactive Q&A, and practice questions.
                            </p>

                            {/* Benefits List */}
                            <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
                                <h3 className="font-semibold text-slate-900 mb-4 text-center">What you'll get:</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Full Topic Access</h4>
                                            <p className="text-sm text-slate-600">Browse all Java topics from basics to advanced</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Interactive Q&A</h4>
                                            <p className="text-sm text-slate-600">Practice with hundreds of questions and answers</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Track Your Progress</h4>
                                            <p className="text-sm text-slate-600">Monitor your learning journey</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/signup"
                                    className="btn-primary px-8 py-4 text-lg font-semibold inline-block"
                                >
                                    Create Free Account
                                </Link>
                                <Link
                                    to="/login"
                                    className="btn-secondary px-8 py-4 text-lg font-semibold inline-block"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Search Bar - Only show for logged-in users */}
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
                                Explore Java Topics
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Choose from our curated collection of Java programming topics
                            </p>
                        </div>

                        {/* Topics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredTopics.map((topic, index) => (
                                <Link
                                    key={topic.id}
                                    to={`/topic/${topic.id}`}
                                    className="group block h-full animate-fadeIn"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="card-hover h-full p-6 flex flex-col relative overflow-hidden">
                                        {/* Gradient Border Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                        <div className="absolute inset-[2px] bg-white rounded-xl z-0"></div>

                                        {/* Content */}
                                        <div className="relative z-10">
                                            {/* Topic Number Badge */}
                                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-bold mb-4 group-hover:scale-110 transition-transform">
                                                {index + 1}
                                            </div>

                                            <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                {topic.title}
                                            </h3>

                                            <p className="text-slate-600 line-clamp-3 mb-4 flex-grow leading-relaxed">
                                                {topic.description}
                                            </p>

                                            {/* Read More Link */}
                                            <div className="flex items-center text-indigo-600 font-semibold text-sm mt-auto group-hover:translate-x-2 transition-transform">
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
                                        : 'Check back later or add some via Admin Dashboard'}
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
                    </>
                )}
            </section>

            {/* Features Section */}
            <section className="bg-slate-50 section">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                            Why Choose JavaMastery?
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Everything you need to become a Java expert
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="card p-8 text-center hover-lift">
                            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex-center">
                                <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800">Comprehensive Content</h3>
                            <p className="text-slate-600 leading-relaxed">
                                In-depth tutorials covering Java from fundamentals to advanced topics
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="card p-8 text-center hover-lift">
                            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-orange-400 rounded-2xl flex-center">
                                <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800">Interactive Q&A</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Practice with curated questions and detailed explanations
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="card p-8 text-center hover-lift">
                            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-teal-400 rounded-2xl flex-center">
                                <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800">Fast & Modern</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Clean, responsive interface optimized for learning on any device
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
