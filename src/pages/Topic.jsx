import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Topic() {
    const { topicId } = useParams();
    const [topic, setTopic] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopicData = async () => {
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

        fetchTopicData();
    }, [topicId]);

    if (loading) {
        return <div className="max-w-3xl mx-auto h-96 bg-slate-200 rounded-xl animate-pulse"></div>;
    }

    if (!topic) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Topic not found</h2>
                <Link to="/" className="btn-primary inline-block">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-medium">
                &larr; Back to Topics
            </Link>

            <article className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-slate-900 tracking-tight leading-tight border-b pb-6 border-slate-100">
                    {topic.title}
                </h1>
                <div className="prose prose-slate max-w-none text-lg text-slate-700 leading-loose whitespace-pre-line">
                    {topic.description}
                </div>
            </article>

            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-8 text-slate-900 flex items-center border-l-4 border-indigo-600 pl-4">
                    Common Questions
                </h2>

                <div className="space-y-8">
                    {questions.map((q, index) => (
                        <div key={q.id} className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100">
                                <h3 className="font-bold text-slate-900 text-xl leading-snug">
                                    <span className="text-indigo-600 mr-2">Q{index + 1}:</span>
                                    {q.question}
                                </h3>
                            </div>
                            <div className="p-8 text-slate-700 text-lg leading-loose bg-white whitespace-pre-wrap font-medium">
                                {q.answer}
                            </div>
                        </div>
                    ))}
                    {questions.length === 0 && (
                        <p className="text-slate-500 italic text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            No questions added for this topic yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Topic;
