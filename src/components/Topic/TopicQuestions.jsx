import React from 'react';

const TopicQuestions = ({ questions, expandedQuestions, toggleQuestion }) => {
    if (!questions || questions.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 animate-fadeIn">
                <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 rounded-full flex items-center justify-center text-3xl">
                    ❓
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Interview Questions</h3>
                <p className="text-slate-500">There are no interview questions available for this topic yet.</p>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center mb-8">
                <div className="h-1 w-12 bg-gradient-to-r from-primary-600 to-primary-600 rounded-full mr-4"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                    Interview Questions
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
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-500 text-white font-bold text-sm mr-3 flex-shrink-0 mt-0.5">
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
                                        <div className="mt-4 text-slate-700 text-base leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-lg border-l-4 border-primary-500">
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
    );
};

export default TopicQuestions;
