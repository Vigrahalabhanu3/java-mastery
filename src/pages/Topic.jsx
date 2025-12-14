import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

// Sub-components
import TopicContent from '../components/Topic/TopicContent';
import TopicSlides from '../components/Topic/TopicSlides';
import TopicMCQs from '../components/Topic/TopicMCQs';
import TopicQuestions from '../components/Topic/TopicQuestions';

function Topic() {
    const { courseId, topicId } = useParams();
    const [course, setCourse] = useState(null);
    const [topic, setTopic] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [mcqs, setMcqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedQuestions, setExpandedQuestions] = useState(new Set());
    const [userAnswers, setUserAnswers] = useState({}); // { mcqId: selectedOption }
    const [feedback, setFeedback] = useState({}); // { mcqId: 'correct' | 'incorrect' }
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Tab State
    const [activeTab, setActiveTab] = useState('concept'); // concept, slides, mcqs, questions

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
                // Fetch course details
                const courseDocRef = doc(db, 'courses', courseId);
                const courseDoc = await getDoc(courseDocRef);
                if (courseDoc.exists()) {
                    setCourse({ id: courseDoc.id, ...courseDoc.data() });
                }

                // Fetch topic details
                const topicDocRef = doc(db, 'courses', courseId, 'topics', topicId);
                const topicDoc = await getDoc(topicDocRef);

                if (topicDoc.exists()) {
                    setTopic({ id: topicDoc.id, ...topicDoc.data() });

                    // Fetch questions for this topic
                    const questionsColRef = collection(db, 'courses', courseId, 'topics', topicId, 'questions');
                    const questionsSnapshot = await getDocs(questionsColRef);
                    setQuestions(questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                    // Fetch MCQs for this topic
                    const mcqsColRef = collection(db, 'courses', courseId, 'topics', topicId, 'mcqs');
                    const mcqsSnapshot = await getDocs(mcqsColRef);
                    setMcqs(mcqsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
    }, [courseId, topicId, user, authLoading]);

    const toggleQuestion = (questionId) => {
        setExpandedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) newSet.delete(questionId);
            else newSet.add(questionId);
            return newSet;
        });
    };

    const handleMCQSelect = (mcqId, option, correctOption) => {
        setUserAnswers(prev => ({ ...prev, [mcqId]: option }));
        setFeedback(prev => ({ ...prev, [mcqId]: option === correctOption ? 'correct' : 'incorrect' }));
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

    const tabs = [
        { id: 'concept', label: 'Concept', icon: '📖' },
        { id: 'slides', label: 'Slides', icon: '📊' },
        { id: 'mcqs', label: 'MCQs', icon: '📝' },
        { id: 'questions', label: 'Start Interview', icon: '❓' },
    ];

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
                        {course && (
                            <>
                                <Link to={`/course/${courseId}`} className="text-slate-500 hover:text-primary-600 transition-colors">
                                    {course.name}
                                </Link>
                                <svg className="w-4 h-4 text-slate-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M9 5l7 7-7 7" />
                                </svg>
                            </>
                        )}
                        <span className="text-slate-700 font-medium truncate">{topic?.title}</span>
                    </nav>
                </div>
            </div>

            <div className="container-custom section">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link
                        to={`/course/${courseId}`}
                        className="inline-flex items-center text-slate-600 hover:text-primary-600 mb-8 transition-colors font-medium group"
                    >
                        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to {course?.name || 'Course'}
                    </Link>

                    {/* Article Card */}
                    <article className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12 animate-fadeIn">
                        {/* Article Header */}
                        <div className="bg-gradient-to-r from-primary-600 to-primary-600 p-8 md:p-12 text-white">
                            <div className="flex items-center space-x-4 mb-6 text-primary-100">
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
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-8">
                                {topic.title}
                            </h1>

                            {/* Tab Navigation */}
                            <div className="flex flex-wrap gap-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
                                                ? 'bg-white text-primary-600 shadow-md transform scale-105'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                            }`}
                                    >
                                        <span>{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Article Content - Switch based on activeTab */}
                        <div className="p-8 md:p-12 bg-slate-50/50 min-h-[400px]">

                            {activeTab === 'concept' && <TopicContent topic={topic} />}

                            {activeTab === 'slides' && <TopicSlides slideUrl={topic.slideUrl} />}

                            {activeTab === 'mcqs' && (
                                <TopicMCQs
                                    mcqs={mcqs}
                                    userAnswers={userAnswers}
                                    feedback={feedback}
                                    handleMCQSelect={handleMCQSelect}
                                />
                            )}

                            {activeTab === 'questions' && (
                                <TopicQuestions
                                    questions={questions}
                                    expandedQuestions={expandedQuestions}
                                    toggleQuestion={toggleQuestion}
                                />
                            )}

                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}

export default Topic;
