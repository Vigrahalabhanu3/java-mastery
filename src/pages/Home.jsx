import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Home() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchTopics();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-slate-200 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Master Java Programming
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Explore our comprehensive collection of Java topics, from basics to advanced concepts.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map(topic => (
                    <Link key={topic.id} to={`/topic/${topic.id}`} className="group block h-full">
                        <div className="card h-full p-6 flex flex-col hover:border-indigo-200 transition-colors">
                            <h2 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-indigo-600 transition-colors">
                                {topic.title}
                            </h2>
                            <p className="text-slate-600 line-clamp-3 mb-4 flex-grow">
                                {topic.description}
                            </p>
                            <div className="flex items-center text-indigo-600 font-medium text-sm mt-auto group-hover:translate-x-1 transition-transform">
                                Read Article &rarr;
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {topics.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 text-lg">No topics found yet.</p>
                    <p className="text-slate-400 text-sm mt-2">Check back later or add some via Admin.</p>
                </div>
            )}
        </div>
    );
}

export default Home;
