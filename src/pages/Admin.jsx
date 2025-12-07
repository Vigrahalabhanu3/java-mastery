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
    const [questionsList, setQuestionsList] = useState([]); // For managing questions of a topic
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
            // If we are in "Manage Questions" mode, refresh that list
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
        // Scroll to form
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

    // --- UI Components ---

    const MessageAlert = () => {
        if (!message.text) return null;
        const styles = {
            error: 'bg-red-50 text-red-700 border-red-200',
            success: 'bg-green-50 text-green-700 border-green-200',
            info: 'bg-blue-50 text-blue-700 border-blue-200'
        };
        return (
            <div className={`p-4 rounded-lg border ${styles[message.type]} mb-6 text-sm font-medium animate-fade-in`}>
                {message.text}
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
                    setSelectedTopicId(''); // Reset selection when going to generic add
                }
            }}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col lg:flex-row min-h-[80vh] gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24">
                    <div className="mb-6 px-4">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menu</h2>
                    </div>
                    <nav className="space-y-1">
                        <TabButton
                            id="overview"
                            label="Overview"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            }
                        />
                        <TabButton
                            id="add-topic"
                            label="Add Topic"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            }
                        />
                        <TabButton
                            id="add-question"
                            label="Add Question"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="text-slate-500 text-sm font-medium uppercase">Total Topics</h3>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{topics.length}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800">Topics Management</h3>
                                <button onClick={() => { setActiveTab('add-topic'); resetTopicForm(); }} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                    + Add New
                                </button>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {loading ? (
                                    <div className="p-6 text-center text-slate-500">Loading topics...</div>
                                ) : topics.length === 0 ? (
                                    <div className="p-6 text-center text-slate-500">No topics found. Start by adding one!</div>
                                ) : (
                                    topics.map((topic) => (
                                        <div key={topic.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h4 className="font-medium text-slate-900">{topic.title}</h4>
                                                <p className="text-sm text-slate-500 truncate max-w-md">{topic.description}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleManageQuestionsClick(topic.id)}
                                                    className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                                                >
                                                    Questions
                                                </button>
                                                <button
                                                    onClick={() => handleEditTopicClick(topic)}
                                                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTopic(topic.id)}
                                                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'add-topic' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl animate-fade-in">
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{isEditingTopic ? 'Edit Topic' : 'Add New Topic'}</h2>
                                <p className="text-slate-500 mt-1">{isEditingTopic ? 'Update existing topic details.' : 'Create a new subject area.'}</p>
                            </div>
                            {isEditingTopic && (
                                <button onClick={() => { resetTopicForm(); setActiveTab('overview'); }} className="text-sm text-slate-500 hover:text-slate-700">
                                    Cancel
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleSaveTopic} className="space-y-6">
                            <div>
                                <label className="block text-slate-700 font-medium mb-2 text-sm">Topic ID (Slug)</label>
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
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-slate-400">#</span>
                                    </div>
                                </div>
                                {!isEditingTopic && <p className="text-xs text-slate-400 mt-1.5">Unique identifier. Cannot be changed later.</p>}
                            </div>
                            <div>
                                <label className="block text-slate-700 font-medium mb-2 text-sm">Title</label>
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
                                <label className="block text-slate-700 font-medium mb-2 text-sm">Description</label>
                                <textarea
                                    value={topicDesc}
                                    onChange={(e) => setTopicDesc(e.target.value)}
                                    className="input-field h-40 resize-none leading-relaxed"
                                    placeholder="Enter a detailed description of the topic..."
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="submit" className="btn-primary px-8">
                                    {isEditingTopic ? 'Update Topic' : 'Create Topic'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Manage Questions View */}
                {activeTab === 'manage-questions' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <button onClick={() => setActiveTab('overview')} className="text-slate-500 hover:text-indigo-600 flex items-center gap-2">
                                &larr; Back to Overview
                            </button>
                            <h2 className="text-xl font-bold text-slate-900">
                                Questions for: <span className="text-indigo-600">{topics.find(t => t.id === selectedTopicId)?.title}</span>
                            </h2>
                        </div>

                        {/* Add/Edit Question Form */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-800 mb-4">{editingQuestionId ? 'Edit Question' : 'Add New Question'}</h3>
                            <form onSubmit={handleSaveQuestion} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        className="input-field"
                                        placeholder="Question..."
                                        required
                                    />
                                </div>
                                <div>
                                    <textarea
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        className="input-field h-32 resize-y leading-relaxed font-mono text-sm"
                                        placeholder="Answer..."
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    {editingQuestionId && (
                                        <button type="button" onClick={resetQuestionForm} className="btn-secondary text-sm">Cancel Edit</button>
                                    )}
                                    <button type="submit" className="btn-primary text-sm bg-emerald-600 hover:bg-emerald-700">
                                        {editingQuestionId ? 'Update Question' : 'Add Question'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Questions List */}
                        <div className="space-y-4">
                            {questionsList.length === 0 ? (
                                <p className="text-center text-slate-500 py-8">No questions yet.</p>
                            ) : (
                                questionsList.map(q => (
                                    <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-slate-900 flex-grow">{q.question}</h4>
                                            <div className="flex gap-2 flex-shrink-0 ml-4">
                                                <button onClick={() => handleEditQuestionClick(q)} className="text-xs text-indigo-600 hover:underline">Edit</button>
                                                <button onClick={() => handleDeleteQuestion(q.id)} className="text-xs text-red-600 hover:underline">Delete</button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 line-clamp-2">{q.answer}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Generic Add Question Tab (Standalone) */}
                {activeTab === 'add-question' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl animate-fade-in">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Add Question</h2>
                            <p className="text-slate-500 mt-1">Add a Q&A pair to an existing topic.</p>
                        </div>
                        <form onSubmit={handleSaveQuestion} className="space-y-6">
                            <div>
                                <label className="block text-slate-700 font-medium mb-2 text-sm">Select Topic</label>
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
                                <label className="block text-slate-700 font-medium mb-2 text-sm">Question</label>
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
                                <label className="block text-slate-700 font-medium mb-2 text-sm">Answer</label>
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className="input-field h-40 resize-y leading-relaxed font-mono text-sm"
                                    placeholder="Provide a comprehensive answer..."
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="btn-primary bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 px-8">
                                    Save Question
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Admin;
