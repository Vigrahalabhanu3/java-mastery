import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

function Topic() {
    const { topicId } = useParams();
    const [topic, setTopic] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedQuestions, setExpandedQuestions] = useState(new Set());
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
        const fetchTopicData = async () => {
            // Only fetch if user is authenticated
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const topicDocRef = doc(db, 'java_topics', topicId);
                const topicDoc = await getDoc(topicDocRef);

                if (topicDoc.exists()) {
                    setTopic({ id: topicDoc.id, ...topicDoc.data() });

                    const questionsColRef = collection(db, 'java_topics', topicId, 'questions');
                    const questionsSnapshot = await getDocs(questionsColRef);
                    const questionsList = questionsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setQuestions(questionsList);
                }
            } catch (error) {
                console.error("Error fetching topic data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchTopicData();
        }
    }, [topicId, user, authLoading]);

    const toggleQuestion = (questionId) => {
        setExpandedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
    };

    // Redirect to login if not authenticated
    if (!authLoading && !user) {
        return <Navigate to="/login" />;
    }

    if (loading || authLoading) {
        return (
            <div className="container-custom section">
                <div className="skeleton-shimmer h-8 w-32 mb-8"></div>
                <div className="skeleton-shimmer h-96 rounded-2xl mb-12"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton-shimmer h-24 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!topic) {
        return (
            <div className="container-custom section text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex-center">
                    <svg className="w-12 h-12 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Topic Not Found</h2>
                <p className="text-slate-600 mb-8">The topic you're looking for doesn't exist or has been removed.</p>
                <Link to="/" className="btn-primary inline-block">
                    Back to Home
                </Link>
            </div>
        );
    }

    const readTime = Math.max(1, Math.ceil((topic.description?.length || 0) / 1000));

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-slate-200">
                <div className="container-custom py-4">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link to="/" className="text-slate-500 hover:text-indigo-600 transition-colors">
                            Home
                        </Link>
                        <svg className="w-4 h-4 text-slate-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-slate-700 font-medium truncate">{topic.title}</span>
                    </nav>
                </div>
            </div>

            <div className="container-custom section">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center text-slate-600 hover:text-indigo-600 mb-8 transition-colors font-medium group"
                    >
                        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Topics
                    </Link>

                    {/* Article Card */}
                    <article className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12 animate-fadeIn">
                        {/* Article Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 md:p-12 text-white">
                            <div className="flex items-center space-x-4 mb-6 text-indigo-100">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{readTime} min read</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{questions.length} Questions</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                                {topic.title}
                            </h1>
                        </div>

                        {/* Article Content */}
                        <div className="p-8 md:p-12">
                            <div className="prose prose-lg max-w-none">
                                <div className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                                    {topic.description}
                                </div>
                            </div>

                            {/* Share Buttons */}
                            <div className="mt-12 pt-8 border-t border-slate-200">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Share this article</h3>
                                <div className="flex space-x-3">
                                    <button className="p-3 rounded-lg bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </button>
                                    <button className="p-3 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </button>
                                    <button className="p-3 rounded-lg bg-slate-100 hover:bg-green-100 hover:text-green-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Questions Section */}
                    {questions.length > 0 && (
                        <div className="mb-12">
                            <div className="flex items-center mb-8">
                                <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full mr-4"></div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                    Common Questions
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {questions.map((q, index) => {
                                    const isExpanded = expandedQuestions.has(q.id);
                                    return (
                                        <div
                                            key={q.id}
                                            className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 animate-fadeIn"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            {/* Question Header */}
                                            <button
                                                onClick={() => toggleQuestion(q.id)}
                                                className="w-full px-6 py-5 flex items-start justify-between text-left hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="flex-1 pr-4">
                                                    <div className="flex items-start">
                                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-bold text-sm mr-3 flex-shrink-0 mt-0.5">
                                                            {index + 1}
                                                        </span>
                                                        <h3 className="font-bold text-slate-900 text-lg leading-snug">
                                                            {q.question}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <svg
                                                    className={`w-6 h-6 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* Answer Content */}
                                            {isExpanded && (
                                                <div className="px-6 pb-6 animate-fadeIn">
                                                    <div className="pl-11 pt-2 border-t border-slate-100">
                                                        <div className="mt-4 text-slate-700 text-base leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-lg border-l-4 border-indigo-500">
                                                            {q.answer}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* No Questions State */}
                    {questions.length === 0 && (
                        <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex-center">
                                <svg className="w-10 h-10 text-slate-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No Questions Yet</h3>
                            <p className="text-slate-500">Questions for this topic haven't been added yet.</p>
                        </div>
                    )}

                    {/* Back to Top Button */}
                    <div className="text-center mt-12">
                        <Link to="/" className="btn-secondary inline-flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to All Topics
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Topic;
