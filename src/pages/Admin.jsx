import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function Admin() {
    const [activeTab, setActiveTab] = useState('courses');
    const [courses, setCourses] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Course Management State
    const [selectedCourseId, setSelectedCourseId] = useState('java'); // Default to Java
    const [courseName, setCourseName] = useState('');
    const [courseDesc, setCourseDesc] = useState('');
    const [courseIcon, setCourseIcon] = useState('');
    const [courseColor, setCourseColor] = useState('#6366f1');
    const [courseSlug, setCourseSlug] = useState('');
    const [isEditingCourse, setIsEditingCourse] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState(null);

    // Topic Management State
    const [topicTitle, setTopicTitle] = useState('');
    const [topicDesc, setTopicDesc] = useState('');
    const [isEditingTopic, setIsEditingTopic] = useState(false);
    const [editingTopicId, setEditingTopicId] = useState(null);

    // Question Management State
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [questionsList, setQuestionsList] = useState([]);
    const [editingQuestionId, setEditingQuestionId] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            fetchTopics(selectedCourseId);
        }
    }, [selectedCourseId]);

    const fetchCourses = async () => {
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

    const fetchTopics = async (courseId) => {
        try {
            const querySnapshot = await getDocs(collection(db, 'courses', courseId, 'topics'));
            const topicsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTopics(topicsList);
        } catch (error) {
            console.error("Error fetching topics:", error);
        }
    };

    const fetchQuestions = async (courseId, topicId) => {
        try {
            const qRef = collection(db, 'courses', courseId, 'topics', topicId, 'questions');
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

    // Course Management Functions
    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            const courseRef = doc(db, 'courses', courseSlug);
            await setDoc(courseRef, {
                name: courseName,
                description: courseDesc,
                icon: courseIcon,
                color: courseColor,
                slug: courseSlug,
                createdAt: new Date(),
                topicCount: 0
            });
            showMessage('success', 'Course added successfully!');
            resetCourseForm();
            fetchCourses();
        } catch (error) {
            showMessage('error', 'Error adding course: ' + error.message);
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            const courseRef = doc(db, 'courses', editingCourseId);
            await updateDoc(courseRef, {
                name: courseName,
                description: courseDesc,
                icon: courseIcon,
                color: courseColor
            });
            showMessage('success', 'Course updated successfully!');
            resetCourseForm();
            fetchCourses();
        } catch (error) {
            showMessage('error', 'Error updating course: ' + error.message);
        }
    };

    const handleEditCourse = (course) => {
        setCourseName(course.name);
        setCourseDesc(course.description);
        setCourseIcon(course.icon);
        setCourseColor(course.color);
        setCourseSlug(course.slug);
        setIsEditingCourse(true);
        setEditingCourseId(course.id);
        setActiveTab('courses');
    };

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course? This will delete all topics and questions!')) {
            return;
        }
        try {
            await deleteDoc(doc(db, 'courses', courseId));
            showMessage('success', 'Course deleted successfully!');
            fetchCourses();
            if (selectedCourseId === courseId) {
                setSelectedCourseId('');
                setTopics([]);
            }
        } catch (error) {
            showMessage('error', 'Error deleting course: ' + error.message);
        }
    };

    const resetCourseForm = () => {
        setCourseName('');
        setCourseDesc('');
        setCourseIcon('');
        setCourseColor('#6366f1');
        setCourseSlug('');
        setIsEditingCourse(false);
        setEditingCourseId(null);
    };

    // Topic Management Functions
    const handleAddTopic = async (e) => {
        e.preventDefault();
        if (!selectedCourseId) {
            showMessage('error', 'Please select a course first!');
            return;
        }
        try {
            const topicRef = collection(db, 'courses', selectedCourseId, 'topics');
            await addDoc(topicRef, {
                title: topicTitle,
                description: topicDesc,
                createdAt: new Date()
            });

            // Update topic count
            const courseRef = doc(db, 'courses', selectedCourseId);
            const currentCourse = courses.find(c => c.id === selectedCourseId);
            await updateDoc(courseRef, {
                topicCount: (currentCourse?.topicCount || 0) + 1
            });

            showMessage('success', 'Topic added successfully!');
            resetTopicForm();
            fetchTopics(selectedCourseId);
            fetchCourses();
        } catch (error) {
            showMessage('error', 'Error adding topic: ' + error.message);
        }
    };

    const handleUpdateTopic = async (e) => {
        e.preventDefault();
        try {
            const topicRef = doc(db, 'courses', selectedCourseId, 'topics', editingTopicId);
            await updateDoc(topicRef, {
                title: topicTitle,
                description: topicDesc
            });
            showMessage('success', 'Topic updated successfully!');
            resetTopicForm();
            fetchTopics(selectedCourseId);
        } catch (error) {
            showMessage('error', 'Error updating topic: ' + error.message);
        }
    };

    const handleEditTopic = (topic) => {
        setTopicTitle(topic.title);
        setTopicDesc(topic.description);
        setIsEditingTopic(true);
        setEditingTopicId(topic.id);
        setActiveTab('topics');
    };

    const handleDeleteTopic = async (topicId) => {
        if (!window.confirm('Are you sure you want to delete this topic?')) {
            return;
        }
        try {
            await deleteDoc(doc(db, 'courses', selectedCourseId, 'topics', topicId));

            // Update topic count
            const courseRef = doc(db, 'courses', selectedCourseId);
            const currentCourse = courses.find(c => c.id === selectedCourseId);
            await updateDoc(courseRef, {
                topicCount: Math.max(0, (currentCourse?.topicCount || 1) - 1)
            });

            showMessage('success', 'Topic deleted successfully!');
            fetchTopics(selectedCourseId);
            fetchCourses();
        } catch (error) {
            showMessage('error', 'Error deleting topic: ' + error.message);
        }
    };

    const resetTopicForm = () => {
        setTopicTitle('');
        setTopicDesc('');
        setIsEditingTopic(false);
        setEditingTopicId(null);
    };

    // Question Management Functions
    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (!selectedTopicId) {
            showMessage('error', 'Please select a topic first!');
            return;
        }
        try {
            const questionRef = collection(db, 'courses', selectedCourseId, 'topics', selectedTopicId, 'questions');
            await addDoc(questionRef, {
                question,
                answer,
                createdAt: new Date()
            });
            showMessage('success', 'Question added successfully!');
            resetQuestionForm();
            fetchQuestions(selectedCourseId, selectedTopicId);
        } catch (error) {
            showMessage('error', 'Error adding question: ' + error.message);
        }
    };

    const handleUpdateQuestion = async (e) => {
        e.preventDefault();
        try {
            const questionRef = doc(db, 'courses', selectedCourseId, 'topics', selectedTopicId, 'questions', editingQuestionId);
            await updateDoc(questionRef, {
                question,
                answer
            });
            showMessage('success', 'Question updated successfully!');
            resetQuestionForm();
            fetchQuestions(selectedCourseId, selectedTopicId);
        } catch (error) {
            showMessage('error', 'Error updating question: ' + error.message);
        }
    };

    const handleEditQuestion = (q) => {
        setQuestion(q.question);
        setAnswer(q.answer);
        setEditingQuestionId(q.id);
        setActiveTab('questions');
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm('Are you sure you want to delete this question?')) {
            return;
        }
        try {
            await deleteDoc(doc(db, 'courses', selectedCourseId, 'topics', selectedTopicId, 'questions', questionId));
            showMessage('success', 'Question deleted successfully!');
            fetchQuestions(selectedCourseId, selectedTopicId);
        } catch (error) {
            showMessage('error', 'Error deleting question: ' + error.message);
        }
    };

    const resetQuestionForm = () => {
        setQuestion('');
        setAnswer('');
        setEditingQuestionId(null);
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handleTopicSelect = (topicId) => {
        setSelectedTopicId(topicId);
        fetchQuestions(selectedCourseId, topicId);
        setActiveTab('questions');
    };

    if (loading) {
        return (
            <div className="flex-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="container-custom py-6">
                    <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
                    <p className="text-slate-600 mt-2">Manage courses, topics, and questions</p>
                </div>
            </div>

            {/* Message Alert */}
            {message.text && (
                <div className="container-custom mt-6">
                    <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                        {message.text}
                    </div>
                </div>
            )}

            {/* Course Selector */}
            <div className="container-custom mt-6">
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Select Course to Manage
                    </label>
                    <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="input-field"
                    >
                        <option value="">-- Select a Course --</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.icon} {course.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabs */}
            <div className="container-custom mt-6">
                <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                    <div className="border-b border-slate-200">
                        <nav className="flex overflow-x-auto">
                            {['courses', 'topics', 'questions'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${activeTab === tab
                                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                            : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Courses Tab */}
                        {activeTab === 'courses' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {isEditingCourse ? 'Edit Course' : 'Add New Course'}
                                </h2>

                                <form onSubmit={isEditingCourse ? handleUpdateCourse : handleAddCourse} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Course Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={courseName}
                                                onChange={(e) => setCourseName(e.target.value)}
                                                className="input-field"
                                                required
                                                placeholder="e.g., Python Programming"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Slug * {isEditingCourse && '(Cannot edit)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={courseSlug}
                                                onChange={(e) => setCourseSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                                className="input-field"
                                                required
                                                disabled={isEditingCourse}
                                                placeholder="e.g., python"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Icon (Emoji) *
                                            </label>
                                            <input
                                                type="text"
                                                value={courseIcon}
                                                onChange={(e) => setCourseIcon(e.target.value)}
                                                className="input-field text-2xl"
                                                required
                                                placeholder="🐍"
                                                maxLength={2}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Color *
                                            </label>
                                            <input
                                                type="color"
                                                value={courseColor}
                                                onChange={(e) => setCourseColor(e.target.value)}
                                                className="input-field h-12"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            value={courseDesc}
                                            onChange={(e) => setCourseDesc(e.target.value)}
                                            className="input-field"
                                            rows="4"
                                            required
                                            placeholder="Describe the course..."
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button type="submit" className="btn-primary">
                                            {isEditingCourse ? 'Update Course' : 'Add Course'}
                                        </button>
                                        {isEditingCourse && (
                                            <button
                                                type="button"
                                                onClick={resetCourseForm}
                                                className="btn-secondary"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>

                                {/* Courses List */}
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">All Courses</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {courses.map(course => (
                                            <div key={course.id} className="card p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="text-4xl">{course.icon}</div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditCourse(course)}
                                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCourse(course.id)}
                                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-slate-900 mb-2">{course.name}</h4>
                                                <p className="text-sm text-slate-600 line-clamp-2 mb-2">{course.description}</p>
                                                <div className="text-xs text-slate-500">
                                                    {course.topicCount || 0} topics
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Topics Tab */}
                        {activeTab === 'topics' && (
                            <div className="space-y-6">
                                {!selectedCourseId ? (
                                    <div className="text-center py-12 bg-slate-50 rounded-lg">
                                        <p className="text-slate-600">Please select a course first</p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            {isEditingTopic ? 'Edit Topic' : 'Add New Topic'}
                                        </h2>

                                        <form onSubmit={isEditingTopic ? handleUpdateTopic : handleAddTopic} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Topic Title *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={topicTitle}
                                                    onChange={(e) => setTopicTitle(e.target.value)}
                                                    className="input-field"
                                                    required
                                                    placeholder="e.g., Introduction to Variables"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Description *
                                                </label>
                                                <textarea
                                                    value={topicDesc}
                                                    onChange={(e) => setTopicDesc(e.target.value)}
                                                    className="input-field"
                                                    rows="4"
                                                    required
                                                    placeholder="Describe the topic..."
                                                />
                                            </div>

                                            <div className="flex gap-4">
                                                <button type="submit" className="btn-primary">
                                                    {isEditingTopic ? 'Update Topic' : 'Add Topic'}
                                                </button>
                                                {isEditingTopic && (
                                                    <button
                                                        type="button"
                                                        onClick={resetTopicForm}
                                                        className="btn-secondary"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </form>

                                        {/* Topics List */}
                                        <div className="mt-8">
                                            <h3 className="text-xl font-bold text-slate-900 mb-4">All Topics</h3>
                                            <div className="space-y-3">
                                                {topics.map(topic => (
                                                    <div key={topic.id} className="card p-4 flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-slate-900 mb-1">{topic.title}</h4>
                                                            <p className="text-sm text-slate-600 line-clamp-2">{topic.description}</p>
                                                        </div>
                                                        <div className="flex gap-2 ml-4">
                                                            <button
                                                                onClick={() => handleTopicSelect(topic.id)}
                                                                className="text-green-600 hover:text-green-800 text-sm font-medium whitespace-nowrap"
                                                            >
                                                                Questions
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditTopic(topic)}
                                                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTopic(topic.id)}
                                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {topics.length === 0 && (
                                                    <div className="text-center py-8 bg-slate-50 rounded-lg">
                                                        <p className="text-slate-600">No topics yet. Add your first topic above!</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Questions Tab */}
                        {activeTab === 'questions' && (
                            <div className="space-y-6">
                                {!selectedTopicId ? (
                                    <div className="text-center py-12 bg-slate-50 rounded-lg">
                                        <p className="text-slate-600">Please select a topic from the Topics tab</p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            {editingQuestionId ? 'Edit Question' : 'Add New Question'}
                                        </h2>

                                        <form onSubmit={editingQuestionId ? handleUpdateQuestion : handleAddQuestion} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Question *
                                                </label>
                                                <textarea
                                                    value={question}
                                                    onChange={(e) => setQuestion(e.target.value)}
                                                    className="input-field"
                                                    rows="3"
                                                    required
                                                    placeholder="Enter the question..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Answer *
                                                </label>
                                                <textarea
                                                    value={answer}
                                                    onChange={(e) => setAnswer(e.target.value)}
                                                    className="input-field"
                                                    rows="6"
                                                    required
                                                    placeholder="Enter the answer..."
                                                />
                                            </div>

                                            <div className="flex gap-4">
                                                <button type="submit" className="btn-primary">
                                                    {editingQuestionId ? 'Update Question' : 'Add Question'}
                                                </button>
                                                {editingQuestionId && (
                                                    <button
                                                        type="button"
                                                        onClick={resetQuestionForm}
                                                        className="btn-secondary"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </form>

                                        {/* Questions List */}
                                        <div className="mt-8">
                                            <h3 className="text-xl font-bold text-slate-900 mb-4">All Questions</h3>
                                            <div className="space-y-4">
                                                {questionsList.map((q, index) => (
                                                    <div key={q.id} className="card p-4">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">
                                                                {index + 1}
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleEditQuestion(q)}
                                                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteQuestion(q.id)}
                                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <h4 className="font-bold text-slate-900 mb-2">{q.question}</h4>
                                                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{q.answer}</p>
                                                    </div>
                                                ))}
                                                {questionsList.length === 0 && (
                                                    <div className="text-center py-8 bg-slate-50 rounded-lg">
                                                        <p className="text-slate-600">No questions yet. Add your first question above!</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-12"></div>
        </div>
    );
}

export default Admin;
