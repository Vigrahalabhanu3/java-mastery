import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function Admin() {
    const [activeTab, setActiveTab] = useState('overview');
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // State for Add/Edit Topic
    const [topicId, setTopicId] = useState('');
    const [topicTitle, setTopicTitle] = useState('');
    const [topicDesc, setTopicDesc] = useState('');
    const [isEditingTopic, setIsEditingTopic] = useState(false);

    // State for Add/Edit Question
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [questionsList, setQuestionsList] = useState([]);
    const [editingQuestionId, setEditingQuestionId] = useState(null);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
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

    const fetchQuestions = async (tId) => {
        try {
            const qRef = collection(db, 'java_topics', tId, 'questions');
            const qQuery = query(qRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(qQuery);
            const qList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setQuestionsList(qList);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const handleFirestoreError = (error) => {
        console.error("Firestore Error:", error);
        if (error.code === 'permission-denied') {
            setMessage({
                type: 'error',
                text: 'Permission Denied! Please check your Firestore Rules in the Firebase Console.'
            });
        } else {
            setMessage({
                type: 'error',
                text: `Error: ${error.message}`
            });
        }
    };

    // --- Topic Handlers ---

    const handleSaveTopic = async (e) => {
        e.preventDefault();
        setMessage({ type: 'info', text: isEditingTopic ? 'Updating topic...' : 'Adding topic...' });
        try {
            if (!topicId || !topicTitle || !topicDesc) throw new Error('Missing required fields');

            if (isEditingTopic) {
                await updateDoc(doc(db, 'java_topics', topicId), {
                    title: topicTitle,
                    description: topicDesc
                });
                setMessage({ type: 'success', text: 'Topic updated successfully!' });
            } else {
                await setDoc(doc(db, 'java_topics', topicId), {
                    title: topicTitle,
                    description: topicDesc,
                    createdAt: serverTimestamp()
                });
                setMessage({ type: 'success', text: 'Topic added successfully!' });
            }

            resetTopicForm();
            fetchTopics();
            if (isEditingTopic) setActiveTab('overview');
        } catch (error) {
            handleFirestoreError(error);
        }
    };

    const handleEditTopicClick = (topic) => {
        setTopicId(topic.id);
        setTopicTitle(topic.title);
        setTopicDesc(topic.description);
        setIsEditingTopic(true);
        setActiveTab('add-topic');
        setMessage({ type: '', text: '' });
    };

    const handleDeleteTopic = async (id) => {
        if (!window.confirm("Are you sure? This will delete the topic and all its questions!")) return;
        try {
            await deleteDoc(doc(db, 'java_topics', id));
            setMessage({ type: 'success', text: 'Topic deleted.' });
            fetchTopics();
        } catch (error) {
            handleFirestoreError(error);
        }
    };

    const resetTopicForm = () => {
        setTopicId('');
        setTopicTitle('');
        setTopicDesc('');
        setIsEditingTopic(false);
    };

    // --- Question Handlers ---

    const handleManageQuestionsClick = (tId) => {
        setSelectedTopicId(tId);
        fetchQuestions(tId);
        setActiveTab('manage-questions');
        setMessage({ type: '', text: '' });
        resetQuestionForm();
    };

    const handleSaveQuestion = async (e) => {
        e.preventDefault();
        setMessage({ type: 'info', text: editingQuestionId ? 'Updating question...' : 'Adding question...' });
        try {
            if (!selectedTopicId || !question || !answer) throw new Error('Missing required fields');

            if (editingQuestionId) {
                await updateDoc(doc(db, 'java_topics', selectedTopicId, 'questions', editingQuestionId), {
                    question,
                    answer
                });
                setMessage({ type: 'success', text: 'Question updated successfully!' });
            } else {
                await addDoc(collection(db, 'java_topics', selectedTopicId, 'questions'), {
                    question,
                    answer,
                    createdAt: serverTimestamp()
                });
                setMessage({ type: 'success', text: 'Question added successfully!' });
            }

            resetQuestionForm();
            if (activeTab === 'manage-questions') {
                fetchQuestions(selectedTopicId);
            }
        } catch (error) {
            handleFirestoreError(error);
        }
    };

    const handleEditQuestionClick = (q) => {
        setQuestion(q.question);
        setAnswer(q.answer);
        setEditingQuestionId(q.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteQuestion = async (qId) => {
        if (!window.confirm("Delete this question?")) return;
        try {
            await deleteDoc(doc(db, 'java_topics', selectedTopicId, 'questions', qId));
            fetchQuestions(selectedTopicId);
            setMessage({ type: 'success', text: 'Question deleted.' });
        } catch (error) {
            handleFirestoreError(error);
        }
    };

    const resetQuestionForm = () => {
        setQuestion('');
        setAnswer('');
        setEditingQuestionId(null);
    };

    // Calculate total questions
    const totalQuestions = topics.reduce((sum, topic) => sum + (topic.questionsCount || 0), 0);

    // --- UI Components ---

    const MessageAlert = () => {
        if (!message.text) return null;
        const styles = {
            error: 'bg-red-50 text-red-700 border-l-4 border-red-500',
            success: 'bg-green-50 text-green-700 border-l-4 border-green-500',
            info: 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
        };
        const icons = {
            error: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>,
            success: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
            info: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
        };
        return (
            <div className={`p-4 rounded-lg ${styles[message.type]} mb-6 flex items-start animate-fadeIn`}>
                <div className="flex-shrink-0 mr-3">{icons[message.type]}</div>
                <span className="font-medium">{message.text}</span>
            </div>
        );
    };

    const TabButton = ({ id, label, icon }) => (
        <button
            onClick={() => {
                setActiveTab(id);
                setMessage({ type: '', text: '' });
                if (id === 'add-topic') resetTopicForm();
                if (id === 'add-question') {
                    resetQuestionForm();
                    setSelectedTopicId('');
                }
            }}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === id
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Page Header */}
            <div className="bg-white border-b border-slate-200 mb-8">
                <div className="container-custom py-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
                    <p className="text-slate-600">Manage topics, questions, and content</p>
                </div>
            </div>

            <div className="container-custom pb-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24">
                            <div className="mb-6 px-4">
                                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Navigation</h2>
                            </div>
                            <nav className="space-y-2">
                                <TabButton
                                    id="overview"
                                    label="Overview"
                                    icon={
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    }
                                />
                                <TabButton
                                    id="add-topic"
                                    label="Add Topic"
                                    icon={
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    }
                                />
                                <TabButton
                                    id="add-question"
                                    label="Add Question"
                                    icon={
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    }
                                />
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-grow">
                        <MessageAlert />

                        {activeTab === 'overview' && (
                            <div className="space-y-8 animate-fadeIn">
                                {/* Statistics Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Total Topics */}
                                    <div className="card-hover p-6 bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex-center">
                                                <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide mb-1">Total Topics</h3>
                                        <p className="text-4xl font-bold">{topics.length}</p>
                                    </div>

                                    {/* Total Questions */}
                                    <div className="card-hover p-6 bg-gradient-to-br from-pink-500 to-orange-400 text-white">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex-center">
                                                <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide mb-1">Questions</h3>
                                        <p className="text-4xl font-bold">{questionsList.length}+</p>
                                    </div>

                                    {/* Active Status */}
                                    <div className="card-hover p-6 bg-gradient-to-br from-green-500 to-teal-400 text-white">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex-center">
                                                <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide mb-1">Status</h3>
                                        <p className="text-2xl font-bold">All Systems Active</p>
                                    </div>
                                </div>

                                {/* Topics Management Table */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">Topics Management</h3>
                                            <p className="text-sm text-slate-500 mt-1">Manage all your Java topics</p>
                                        </div>
                                        <button
                                            onClick={() => { setActiveTab('add-topic'); resetTopicForm(); }}
                                            className="btn-primary text-sm px-4 py-2 whitespace-nowrap"
                                        >
                                            + Add New Topic
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <div className="divide-y divide-slate-100">
                                            {loading ? (
                                                <div className="p-12 text-center">
                                                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                                                    <p className="text-slate-500">Loading topics...</p>
                                                </div>
                                            ) : topics.length === 0 ? (
                                                <div className="p-12 text-center">
                                                    <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex-center">
                                                        <svg className="w-10 h-10 text-slate-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                    </div>
                                                    <h4 className="text-lg font-semibold text-slate-800 mb-2">No topics found</h4>
                                                    <p className="text-slate-500 mb-6">Start by adding your first topic!</p>
                                                    <button onClick={() => setActiveTab('add-topic')} className="btn-primary">
                                                        Create First Topic
                                                    </button>
                                                </div>
                                            ) : (
                                                topics.map((topic) => (
                                                    <div key={topic.id} className="p-6 hover:bg-slate-50 transition-colors">
                                                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                                            <div className="flex-grow">
                                                                <h4 className="font-semibold text-slate-900 text-lg mb-1">{topic.title}</h4>
                                                                <p className="text-sm text-slate-600 line-clamp-2">{topic.description}</p>
                                                                <div className="flex items-center mt-2 text-xs text-slate-500">
                                                                    <span className="inline-flex items-center">
                                                                        <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                                        </svg>
                                                                        ID: {topic.id}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                                <button
                                                                    onClick={() => handleManageQuestionsClick(topic.id)}
                                                                    className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                                                >
                                                                    Manage Q&A
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEditTopicClick(topic)}
                                                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteTopic(topic.id)}
                                                                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'add-topic' && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-3xl animate-fadeIn">
                                <div className="mb-8 flex justify-between items-start">
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-900 mb-2">{isEditingTopic ? 'Edit Topic' : 'Add New Topic'}</h2>
                                        <p className="text-slate-600">{isEditingTopic ? 'Update existing topic details.' : 'Create a new subject area for Java learning.'}</p>
                                    </div>
                                    {isEditingTopic && (
                                        <button onClick={() => { resetTopicForm(); setActiveTab('overview'); }} className="btn-ghost text-sm">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                                <form onSubmit={handleSaveTopic} className="space-y-6">
                                    <div>
                                        <label className="block text-slate-700 font-semibold mb-2">Topic ID (Slug)</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={topicId}
                                                onChange={(e) => setTopicId(e.target.value)}
                                                className={`input-field pl-10 ${isEditingTopic ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                                                placeholder="e.g., oop-java"
                                                required
                                                disabled={isEditingTopic}
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-slate-400">#</span>
                                            </div>
                                        </div>
                                        {!isEditingTopic && <p className="text-xs text-slate-500 mt-2">Unique identifier. Cannot be changed later.</p>}
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-semibold mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={topicTitle}
                                            onChange={(e) => setTopicTitle(e.target.value)}
                                            className="input-field"
                                            placeholder="e.g., Object Oriented Programming"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-semibold mb-2">Description</label>
                                        <textarea
                                            value={topicDesc}
                                            onChange={(e) => setTopicDesc(e.target.value)}
                                            className="input-field h-48 resize-y leading-relaxed"
                                            placeholder="Enter a detailed description of the topic..."
                                            required
                                        />
                                        <p className="text-xs text-slate-500 mt-2">{topicDesc.length} characters</p>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button type="submit" className="btn-primary px-8 py-3 text-lg">
                                            {isEditingTopic ? 'Update Topic' : 'Create Topic'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Manage Questions View */}
                        {activeTab === 'manage-questions' && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <button onClick={() => setActiveTab('overview')} className="text-slate-600 hover:text-indigo-600 flex items-center gap-2 font-medium transition-colors">
                                        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Back to Overview
                                    </button>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        Questions for: <span className="gradient-text">{topics.find(t => t.id === selectedTopicId)?.title}</span>
                                    </h2>
                                </div>

                                {/* Add/Edit Question Form */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="font-bold text-slate-800 text-lg mb-6">{editingQuestionId ? 'Edit Question' : 'Add New Question'}</h3>
                                    <form onSubmit={handleSaveQuestion} className="space-y-5">
                                        <div>
                                            <label className="block text-slate-700 font-semibold mb-2">Question</label>
                                            <input
                                                type="text"
                                                value={question}
                                                onChange={(e) => setQuestion(e.target.value)}
                                                className="input-field"
                                                placeholder="Enter the question..."
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-slate-700 font-semibold mb-2">Answer</label>
                                            <textarea
                                                value={answer}
                                                onChange={(e) => setAnswer(e.target.value)}
                                                className="input-field h-40 resize-y leading-relaxed font-mono text-sm"
                                                placeholder="Provide a comprehensive answer..."
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-2">
                                            {editingQuestionId && (
                                                <button type="button" onClick={resetQuestionForm} className="btn-secondary">Cancel Edit</button>
                                            )}
                                            <button type="submit" className="btn-primary bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                                                {editingQuestionId ? 'Update Question' : 'Add Question'}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Questions List */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-800 text-lg">All Questions ({questionsList.length})</h3>
                                    {questionsList.length === 0 ? (
                                        <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex-center">
                                                <svg className="w-8 h-8 text-slate-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-slate-600 font-medium">No questions yet. Add your first one above!</p>
                                        </div>
                                    ) : (
                                        questionsList.map((q, index) => (
                                            <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-grow">
                                                        <div className="flex items-start gap-3 mb-3">
                                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-bold text-sm flex-shrink-0">
                                                                {index + 1}
                                                            </span>
                                                            <h4 className="font-semibold text-slate-900 text-lg leading-snug">{q.question}</h4>
                                                        </div>
                                                        <p className="text-sm text-slate-600 pl-11 line-clamp-3 leading-relaxed">{q.answer}</p>
                                                    </div>
                                                    <div className="flex gap-2 flex-shrink-0">
                                                        <button onClick={() => handleEditQuestionClick(q)} className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium">
                                                            Edit
                                                        </button>
                                                        <button onClick={() => handleDeleteQuestion(q.id)} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Generic Add Question Tab */}
                        {activeTab === 'add-question' && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-3xl animate-fadeIn">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Add Question</h2>
                                    <p className="text-slate-600">Add a Q&A pair to an existing topic.</p>
                                </div>
                                <form onSubmit={handleSaveQuestion} className="space-y-6">
                                    <div>
                                        <label className="block text-slate-700 font-semibold mb-2">Select Topic</label>
                                        <select
                                            value={selectedTopicId}
                                            onChange={(e) => setSelectedTopicId(e.target.value)}
                                            className="input-field"
                                            required
                                        >
                                            <option value="">-- Choose a Topic --</option>
                                            {topics.map(t => (
                                                <option key={t.id} value={t.id}>{t.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-semibold mb-2">Question</label>
                                        <input
                                            type="text"
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            className="input-field"
                                            placeholder="e.g., What is the difference between abstract class and interface?"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-semibold mb-2">Answer</label>
                                        <textarea
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            className="input-field h-48 resize-y leading-relaxed font-mono text-sm"
                                            placeholder="Provide a comprehensive answer..."
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button type="submit" className="btn-primary bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-3 text-lg">
                                            Save Question
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Admin;
