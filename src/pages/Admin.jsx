import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, getDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

// --- Icons ---
const Icons = {
    Dashboard: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Courses: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    Topics: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    Questions: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Add: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Edit: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Delete: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Search: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    MCQs: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
    Close: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
};

// --- Sub-Components ---

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 animate-scaleIn overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
                        <Icons.Close />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color, icon: Icon }) => (
    <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500`}></div>
        <div className="relative flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${color} shadow-lg shadow-indigo-500/20`}>
                <Icon />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
            </div>
        </div>
    </div>
);

// --- Main Admin Component ---

function Admin() {
    const [activeView, setActiveView] = useState('dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Data State
    const [courses, setCourses] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    // Logic State
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [questionsList, setQuestionsList] = useState([]);
    const [mcqsList, setMcqsList] = useState([]);

    // Modal State
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);

    // Form States
    const [courseForm, setCourseForm] = useState({ name: '', description: '', icon: '', color: '#6366f1', slug: '', accessCode: '', type: 'self-paced', isEditing: false, id: null });
    const [topicForm, setTopicForm] = useState({ title: '', description: '', slideUrl: '', cheatsheetUrl: '', isEditing: false, id: null });
    const [questionForm, setQuestionForm] = useState({ question: '', answer: '', isEditing: false, id: null });
    const [mcqForm, setMcqForm] = useState({ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', isEditing: false, id: null });

    // --- Effects ---

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            fetchTopics(selectedCourseId);
            fetchTopics(selectedCourseId);
            setQuestionsList([]);
            setMcqsList([]);
            setSelectedTopicId('');
        }
    }, [selectedCourseId]);

    useEffect(() => {
        if (selectedCourseId && selectedTopicId) {
            if (selectedCourseId && selectedTopicId) {
                fetchQuestions(selectedCourseId, selectedTopicId);
                fetchMCQs(selectedCourseId, selectedTopicId);
            }
        }
    }, [selectedCourseId, selectedTopicId]);

    // --- Data Fetching ---

    const fetchCourses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'courses'));
            const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCourses(list);
        } catch (error) {
            console.error(error);
            showMessage('error', 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const fetchTopics = async (courseId) => {
        const querySnapshot = await getDocs(collection(db, 'courses', courseId, 'topics'));
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTopics(list);
    };

    const fetchQuestions = async (courseId, topicId) => {
        const qRef = collection(db, 'courses', courseId, 'topics', topicId, 'questions');
        const qQuery = query(qRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(qQuery);
        setQuestionsList(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchMCQs = async (courseId, topicId) => {
        const mRef = collection(db, 'courses', courseId, 'topics', topicId, 'mcqs');
        const mQuery = query(mRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(mQuery);
        setMcqsList(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    // --- Actions ---

    const handleSaveCourse = async (e) => {
        e.preventDefault();
        const { name, description, icon, color, slug, accessCode, isEditing, id } = courseForm;

        try {
            if (isEditing) {
                await updateDoc(doc(db, 'courses', id), { name, description, icon, color, accessCode: accessCode || '', type: courseForm.type || 'self-paced' });
                showMessage('success', 'Course updated successfully');
            } else {
                const cleanSlug = slug.toLowerCase().replace(/\s+/g, '-');
                const courseRef = doc(db, 'courses', cleanSlug);
                const docSnap = await getDoc(courseRef);
                if (docSnap.exists()) {
                    showMessage('error', 'A course with this slug already exists! Please choose another.');
                    return;
                }
                await setDoc(courseRef, {
                    name, description, icon, color, slug: cleanSlug, accessCode: accessCode || '',
                    type: courseForm.type || 'self-paced',
                    createdAt: serverTimestamp(),
                    topicCount: 0
                });
                showMessage('success', 'Course created successfully');
            }
            setIsCourseModalOpen(false);
            fetchCourses();
            resetCourseForm();
        } catch (error) {
            showMessage('error', 'Operation failed: ' + error.message);
        }
    };

    const handleDeleteCourse = async (id) => {
        if (!window.confirm('Delete this course? All data inside will be lost!')) return;
        try {
            await deleteDoc(doc(db, 'courses', id));
            showMessage('success', 'Course deleted');
            fetchCourses();
            if (selectedCourseId === id) setSelectedCourseId('');
        } catch (e) {
            showMessage('error', e.message);
        }
    };

    const handleSaveTopic = async (e) => {
        e.preventDefault();
        if (!selectedCourseId) return showMessage('error', 'No course selected');
        const { title, description, slideUrl, cheatsheetUrl, isEditing, id } = topicForm;

        try {
            if (isEditing) {
                await updateDoc(doc(db, 'courses', selectedCourseId, 'topics', id), { title, description, slideUrl: slideUrl || '', cheatsheetUrl: cheatsheetUrl || '' });
                showMessage('success', 'Topic updated');
            } else {
                await addDoc(collection(db, 'courses', selectedCourseId, 'topics'), {
                    title, description, slideUrl: slideUrl || '', cheatsheetUrl: cheatsheetUrl || '', createdAt: serverTimestamp()
                });
                // Update count
                const course = courses.find(c => c.id === selectedCourseId);
                const courseRef = doc(db, 'courses', selectedCourseId);
                await updateDoc(courseRef, { topicCount: (course?.topicCount || 0) + 1 });
                showMessage('success', 'Topic added');
            }
            setIsTopicModalOpen(false);
            fetchTopics(selectedCourseId);
            fetchCourses();
            resetTopicForm();
        } catch (e) {
            showMessage('error', e.message);
        }
    };

    const handleDeleteTopic = async (id) => {
        if (!window.confirm('Delete this topic?')) return;
        try {
            await deleteDoc(doc(db, 'courses', selectedCourseId, 'topics', id));
            const course = courses.find(c => c.id === selectedCourseId);
            const courseRef = doc(db, 'courses', selectedCourseId);
            await updateDoc(courseRef, { topicCount: Math.max(0, (course?.topicCount || 1) - 1) });
            showMessage('success', 'Topic deleted');
            fetchTopics(selectedCourseId);
            fetchCourses();
        } catch (e) {
            showMessage('error', e.message);
        }
    };

    const handleSaveQuestion = async (e) => {
        e.preventDefault();
        if (!selectedCourseId || !selectedTopicId) return showMessage('error', 'Select course & topic');
        const { question, answer, isEditing, id } = questionForm;

        try {
            if (isEditing) {
                await updateDoc(doc(db, 'courses', selectedCourseId, 'topics', selectedTopicId, 'questions', id), { question, answer });
                showMessage('success', 'Question updated');
            } else {
                await addDoc(collection(db, 'courses', selectedCourseId, 'topics', selectedTopicId, 'questions'), {
                    question, answer, createdAt: serverTimestamp()
                });
                showMessage('success', 'Question added');
            }
            setIsQuestionModalOpen(false);
            fetchQuestions(selectedCourseId, selectedTopicId);
            resetQuestionForm();
        } catch (e) {
            showMessage('error', e.message);
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (!window.confirm('Delete question?')) return;
        try {
            await deleteDoc(doc(db, 'courses', selectedCourseId, 'topics', selectedTopicId, 'questions', id));
            showMessage('success', 'Question deleted');
            fetchQuestions(selectedCourseId, selectedTopicId);
        } catch (e) {
            showMessage('error', e.message);
        }
    };

    const handleSaveMCQ = async (e) => {
        e.preventDefault();
        if (!selectedCourseId || !selectedTopicId) return showMessage('error', 'Select course & topic');
        const { question, optionA, optionB, optionC, optionD, correctOption, isEditing, id } = mcqForm;

        try {
            const mcqData = { question, optionA, optionB, optionC, optionD, correctOption };
            if (isEditing) {
                await updateDoc(doc(db, 'courses', selectedCourseId, 'topics', selectedTopicId, 'mcqs', id), mcqData);
                showMessage('success', 'MCQ updated');
            } else {
                await addDoc(collection(db, 'courses', selectedCourseId, 'topics', selectedTopicId, 'mcqs'), {
                    ...mcqData, createdAt: serverTimestamp()
                });
                showMessage('success', 'MCQ added');
            }
            setIsMCQModalOpen(false);
            fetchMCQs(selectedCourseId, selectedTopicId);
            resetMCQForm();
        } catch (e) {
            showMessage('error', e.message);
        }
    };

    const handleDeleteMCQ = async (id) => {
        if (!window.confirm('Delete MCQ?')) return;
        try {
            await deleteDoc(doc(db, 'courses', selectedCourseId, 'topics', selectedTopicId, 'mcqs', id));
            showMessage('success', 'MCQ deleted');
            fetchMCQs(selectedCourseId, selectedTopicId);
        } catch (e) {
            showMessage('error', e.message);
        }
    };

    // --- Helpers ---

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const resetCourseForm = () => setCourseForm({ name: '', description: '', icon: '', color: '#6366f1', slug: '', accessCode: '', type: 'self-paced', isEditing: false, id: null });
    const resetTopicForm = () => setTopicForm({ title: '', description: '', slideUrl: '', cheatsheetUrl: '', isEditing: false, id: null });
    const resetQuestionForm = () => setQuestionForm({ question: '', answer: '', isEditing: false, id: null });
    const resetMCQForm = () => setMcqForm({ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', isEditing: false, id: null });

    const openEditCourse = (c) => { setCourseForm({ ...c, isEditing: true }); setIsCourseModalOpen(true); };
    const openEditTopic = (t) => { setTopicForm({ ...t, isEditing: true }); setIsTopicModalOpen(true); };
    const openEditQuestion = (q) => { setQuestionForm({ ...q, isEditing: true }); setIsQuestionModalOpen(true); };
    const openEditMCQ = (m) => { setMcqForm({ ...m, isEditing: true }); setIsMCQModalOpen(true); };

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

    // --- Views ---

    const DashboardView = () => (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
                <p className="text-slate-500">Welcome back, Admin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Courses" value={courses.length} color="from-indigo-500 to-violet-600" icon={Icons.Courses} />
                <StatCard title="Total Topics" value={courses.reduce((acc, c) => acc + (c.topicCount || 0), 0)} color="from-pink-500 to-rose-500" icon={Icons.Topics} />
                <StatCard title="System Status" value="Online" color="from-emerald-400 to-teal-500" icon={Icons.Dashboard} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                    <button onClick={() => { setActiveView('courses'); setIsCourseModalOpen(true); resetCourseForm(); }} className="btn-primary shadow-indigo-500/20 flex items-center gap-2">
                        <Icons.Add /> Create New Course
                    </button>
                    {courses.length > 0 && <button onClick={() => { setActiveView('topics'); }} className="btn-secondary">Manage Curriculum</button>}
                    {topics.length > 0 && <button onClick={() => { setActiveView('mcqs'); }} className="btn-secondary">Add MCQs</button>}
                </div>
            </div>
        </div>
    );

    const CoursesView = () => (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Courses</h2>
                    <p className="text-slate-500">Manage your learning paths</p>
                </div>
                <button onClick={() => { resetCourseForm(); setIsCourseModalOpen(true); }} className="btn-primary flex items-center gap-2">
                    <Icons.Add /> Add Course
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white group rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col">
                        <div className="h-1.5 w-full" style={{ backgroundColor: course.color }}></div>
                        <div className="p-6 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                                    {course.icon}
                                </div>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                    <button onClick={() => openEditCourse(course)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Icons.Edit /></button>
                                    <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Icons.Delete /></button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-2">{course.name}</h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">{course.description}</p>

                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${course.type === 'ongoing' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {course.type === 'ongoing' ? 'Ongoing' : 'Self-Paced'}
                                </span>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    {course.topicCount || 0} Topics
                                </span>
                                <span className="text-xs font-mono text-slate-300">#{course.slug}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const TopicsView = () => (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Topics</h2>
                    <p className="text-slate-500">Organize course content</p>
                </div>
                <button onClick={() => { if (!selectedCourseId) return showMessage('error', 'Select a course first'); resetTopicForm(); setIsTopicModalOpen(true); }} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedCourseId}>
                    <Icons.Add /> Add Topic
                </button>
            </div>

            {/* Course Selector */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-4">
                <span className="text-sm font-bold text-slate-700 whitespace-nowrap">Active Course:</span>
                <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} className="input-field max-w-md bg-slate-50 border-transparent focus:bg-white transition-colors">
                    <option value="">-- Select a Course to Manage --</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
            </div>

            {!selectedCourseId && (
                <div className="text-center py-20 opacity-50">
                    <div className="text-6xl mb-4">📚</div>
                    <p className="text-xl font-medium text-slate-400">Please select a course above to view topics</p>
                </div>
            )}

            {selectedCourseId && (
                <div className="grid grid-cols-1 gap-4">
                    {topics.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-500">No topics yet. Start looking by adding one!</p>
                        </div>
                    ) : (
                        topics.map((topic, idx) => (
                            <div key={topic.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center group hover:shadow-md transition-all gap-4">
                                <div className="flex items-start gap-4 w-full md:w-auto">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">{idx + 1}</span>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800">{topic.title}</h4>
                                        <p className="text-slate-500 text-sm line-clamp-1">{topic.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                    <button onClick={() => { setSelectedTopicId(topic.id); setActiveView('questions'); }} className="px-4 py-2 bg-slate-50 text-slate-600 text-sm font-semibold rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                        Manage Questions
                                    </button>
                                    <div className="h-6 w-px bg-slate-200 mx-2"></div>
                                    <button onClick={() => openEditTopic(topic)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"><Icons.Edit /></button>
                                    <button onClick={() => handleDeleteTopic(topic.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"><Icons.Delete /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );

    const MCQsView = () => (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">MCQs</h2>
                    <p className="text-slate-500">Manage interactive quizzes</p>
                </div>
                <button onClick={() => { if (!selectedTopicId) return showMessage('error', 'Select a topic'); resetMCQForm(); setIsMCQModalOpen(true); }} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedTopicId}>
                    <Icons.Add /> Add MCQ
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Selected Course</label>
                    <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} className="input-field w-full bg-slate-50 border-transparent focus:bg-white">
                        <option value="">-- Select Course --</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.type === 'ongoing' ? 'Ongoing' : 'Self-Paced'})</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Selected Topic</label>
                    <select value={selectedTopicId} onChange={(e) => setSelectedTopicId(e.target.value)} className="input-field w-full bg-slate-50 border-transparent focus:bg-white" disabled={!selectedCourseId}>
                        <option value="">-- Select Topic --</option>
                        {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                </div>
            </div>

            {selectedTopicId && (
                <div className="space-y-4">
                    {mcqsList.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-500">No MCQs found. Add some to test your students!</p>
                        </div>
                    ) : (
                        mcqsList.map((m, idx) => (
                            <div key={m.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-emerald-600 text-white font-bold rounded-lg text-sm shadow-md shadow-emerald-200">
                                            {idx + 1}
                                        </span>
                                        <h4 className="font-bold text-slate-900 text-lg">{m.question}</h4>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditMCQ(m)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg"><Icons.Edit /></button>
                                        <button onClick={() => handleDeleteMCQ(m.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg"><Icons.Delete /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {['A', 'B', 'C', 'D'].map(opt => (
                                        <div key={opt} className={`p-3 rounded-lg border ${m.correctOption === opt ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                                            <span className="font-bold mr-2">{opt}.</span> {m[`option${opt}`]}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );

    const QuestionsView = () => (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Questions</h2>
                    <p className="text-slate-500">Manage assessments & Q/A</p>
                </div>
                <button onClick={() => { if (!selectedTopicId) return showMessage('error', 'Select a topic'); resetQuestionForm(); setIsQuestionModalOpen(true); }} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedTopicId}>
                    <Icons.Add /> Add Question
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Selected Course</label>
                    <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} className="input-field w-full bg-slate-50 border-transparent focus:bg-white">
                        <option value="">-- Select Course --</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.type === 'ongoing' ? 'Ongoing' : 'Self-Paced'})</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Selected Topic</label>
                    <select value={selectedTopicId} onChange={(e) => setSelectedTopicId(e.target.value)} className="input-field w-full bg-slate-50 border-transparent focus:bg-white" disabled={!selectedCourseId}>
                        <option value="">-- Select Topic --</option>
                        {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                </div>
            </div>

            {selectedTopicId && (
                <div className="space-y-4">
                    {questionsList.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-500">No questions found. Add some to test your students!</p>
                        </div>
                    ) : (
                        questionsList.map((q, idx) => (
                            <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-600 text-white font-bold rounded-lg text-sm shadow-md shadow-indigo-200">
                                            Q{idx + 1}
                                        </span>
                                        <h4 className="font-bold text-slate-900 text-lg">{q.question}</h4>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditQuestion(q)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg"><Icons.Edit /></button>
                                        <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg"><Icons.Delete /></button>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed font-medium">
                                    {q.answer}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );

    // --- Sidebar Menu ---
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
        { id: 'courses', label: 'Courses', icon: Icons.Courses },
        { id: 'topics', label: 'Topics', icon: Icons.Topics },
        { id: 'questions', label: 'Questions', icon: Icons.Questions },
        { id: 'mcqs', label: 'MCQs', icon: Icons.MCQs },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/80 z-40 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>}

            {/* Sidebar (Dark Theme) */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col relative overflow-hidden">
                    {/* Decorative Gradients */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <div className="p-8 relative z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
                                🚀
                            </div>
                            <h1 className="text-xl font-bold tracking-tight">JavaMastery <span className="text-indigo-400">Admin</span></h1>
                        </div>

                        <nav className="space-y-2">
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveView(item.id); setMobileMenuOpen(false); }}
                                    className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium group ${activeView === item.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <div className={`${activeView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                                        <item.icon />
                                    </div>
                                    <span>{item.label}</span>
                                    {activeView === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto p-6 border-t border-white/5 relative z-10 bg-black/20">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 p-0.5">
                                <img src={`https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff`} alt="Admin" className="w-full h-full rounded-full object-cover border-2 border-slate-900" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">System Admin</p>
                                <p className="text-xs text-slate-400">super_admin@javamastery.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-screen overflow-y-auto relative">
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex justify-between items-center md:hidden">
                    <span className="font-bold text-slate-800">Admin Panel</span>
                    <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-600 bg-slate-100 rounded-lg active:scale-95 transition-transform">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </header>

                <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
                    {/* Toast Notification */}
                    {message && (
                        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slideInRight ${message.type === 'success' ? 'bg-white border-l-4 border-green-500 text-green-700' : 'bg-white border-l-4 border-red-500 text-red-700'}`}>
                            {message.type === 'success' ?
                                <div className="p-1 bg-green-100 rounded-full"><svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div> :
                                <div className="p-1 bg-red-100 rounded-full"><svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></div>
                            }
                            <div>
                                <h4 className="font-bold text-sm">{message.type === 'success' ? 'Success' : 'Error'}</h4>
                                <p className="text-sm">{message.text}</p>
                            </div>
                        </div>
                    )}

                    {activeView === 'dashboard' && <DashboardView />}
                    {activeView === 'courses' && <CoursesView />}
                    {activeView === 'topics' && <TopicsView />}
                    {activeView === 'questions' && <QuestionsView />}
                    {activeView === 'mcqs' && <MCQsView />}
                </div>
            </main>

            {/* Modals Injected Here (Reused Logic) */}
            <Modal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} title={courseForm.isEditing ? 'Edit Course' : 'Create New Course'}>
                <form onSubmit={handleSaveCourse} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Course Name</label>
                        <input type="text" value={courseForm.name} onChange={e => setCourseForm({ ...courseForm, name: e.target.value })} className="input-field" required placeholder="Python Programming" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Slug (URL)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">/course/</span>
                            <input type="text" value={courseForm.slug} onChange={e => setCourseForm({ ...courseForm, slug: e.target.value })} className="input-field pl-20 bg-slate-50 font-mono text-sm" disabled={courseForm.isEditing} required placeholder="python-mastery" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Icon (Emoji)</label>
                            <input type="text" value={courseForm.icon} onChange={e => setCourseForm({ ...courseForm, icon: e.target.value })} className="input-field text-center text-2xl" required maxLength={2} placeholder="🐍" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Theme Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={courseForm.color} onChange={e => setCourseForm({ ...courseForm, color: e.target.value })} className="h-10 w-10 rounded-lg cursor-pointer border-0 bg-transparent p-0" />
                                <span className="text-sm font-mono text-slate-500 uppercase">{courseForm.color}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Short Description</label>
                        <textarea value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} className="input-field" rows="3" required placeholder="Brief summary of the course..." />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Course Type</label>
                        <select value={courseForm.type} onChange={e => setCourseForm({ ...courseForm, type: e.target.value })} className="input-field bg-white">
                            <option value="self-paced">Self-Paced (Standard)</option>
                            <option value="ongoing">Ongoing (Live Cohort)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Access Code (Optional)</label>
                        <input type="text" value={courseForm.accessCode} onChange={e => setCourseForm({ ...courseForm, accessCode: e.target.value })} className="input-field" placeholder="Leave empty for public access" />
                        <p className="text-xs text-slate-500 mt-1">If set, users must enter this code to view the course content.</p>
                    </div>
                    <button type="submit" className="btn-primary w-full py-3.5 text-lg shadow-lg shadow-indigo-500/20">{courseForm.isEditing ? 'Save Updates' : 'Create Course'}</button>
                </form>
            </Modal>

            <Modal isOpen={isTopicModalOpen} onClose={() => setIsTopicModalOpen(false)} title={topicForm.isEditing ? 'Edit Topic' : 'Add New Topic'}>
                <form onSubmit={handleSaveTopic} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Topic Title</label>
                        <input type="text" value={topicForm.title} onChange={e => setTopicForm({ ...topicForm, title: e.target.value })} className="input-field" required placeholder="Introduction to Variables" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                        <textarea value={topicForm.description} onChange={e => setTopicForm({ ...topicForm, description: e.target.value })} className="input-field" rows="4" required placeholder="What will students learn in this topic?" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Slides URL (Embed)</label>
                        <input type="text" value={topicForm.slideUrl} onChange={e => setTopicForm({ ...topicForm, slideUrl: e.target.value })} className="input-field" placeholder="https://docs.google.com/presentation/d/.../embed" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Cheatsheet URL</label>
                        <input type="text" value={topicForm.cheatsheetUrl} onChange={e => setTopicForm({ ...topicForm, cheatsheetUrl: e.target.value })} className="input-field" placeholder="https://example.com/sheet.pdf" />
                    </div>
                    <button type="submit" className="btn-primary w-full py-3.5 shadow-lg shadow-indigo-500/20">{topicForm.isEditing ? 'Save Changes' : 'Add Topic'}</button>
                </form>
            </Modal>

            <Modal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} title={questionForm.isEditing ? 'Edit Question' : 'Add Question'}>
                <form onSubmit={handleSaveQuestion} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">The Question</label>
                        <textarea value={questionForm.question} onChange={e => setQuestionForm({ ...questionForm, question: e.target.value })} className="input-field font-medium" rows="3" required placeholder="e.g. What is the output of print(10/2)?" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">The Answer</label>
                        <div className="relative">
                            <textarea value={questionForm.answer} onChange={e => setQuestionForm({ ...questionForm, answer: e.target.value })} className="input-field bg-slate-50 font-mono text-sm" rows="5" required placeholder="The correct answer is 5.0 because / operator performs float division." />
                            <div className="absolute top-2 right-2 px-2 py-1 bg-slate-200 rounded text-xs font-bold text-slate-500">MARKDOWN SUPPORTED</div>
                        </div>
                    </div>
                    <button type="submit" className="btn-primary w-full py-3.5 shadow-lg shadow-indigo-500/20">{questionForm.isEditing ? 'Save Changes' : 'Add Question'}</button>
                </form>
            </Modal>

            <Modal isOpen={isMCQModalOpen} onClose={() => setIsMCQModalOpen(false)} title={mcqForm.isEditing ? 'Edit MCQ' : 'Add MCQ'}>
                <form onSubmit={handleSaveMCQ} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Question</label>
                        <textarea value={mcqForm.question} onChange={e => setMcqForm({ ...mcqForm, question: e.target.value })} className="input-field" rows="2" required placeholder="e.g. What is 2 + 2?" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {['A', 'B', 'C', 'D'].map(opt => (
                            <div key={opt}>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Option {opt}</label>
                                <input type="text" value={mcqForm[`option${opt}`]} onChange={e => setMcqForm({ ...mcqForm, [`option${opt}`]: e.target.value })} className="input-field" required placeholder={`Option ${opt}`} />
                            </div>
                        ))}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Correct Option</label>
                        <div className="flex gap-4">
                            {['A', 'B', 'C', 'D'].map(opt => (
                                <label key={opt} className={`flex-1 p-3 rounded-lg border cursor-pointer text-center transition-all ${mcqForm.correctOption === opt ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold ring-2 ring-emerald-500/20' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                    <input type="radio" name="correctOption" value={opt} checked={mcqForm.correctOption === opt} onChange={() => setMcqForm({ ...mcqForm, correctOption: opt })} className="hidden" />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="btn-primary w-full py-3.5 shadow-lg shadow-indigo-500/20">{mcqForm.isEditing ? 'Save MCQ' : 'Add MCQ'}</button>
                </form>
            </Modal>
        </div>
    );
}

export default Admin;
