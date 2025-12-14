import React from 'react';

const TopicMCQs = ({ mcqs, userAnswers, feedback, handleMCQSelect }) => {
    if (!mcqs || mcqs.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 animate-fadeIn">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center text-3xl">
                    📝
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Knowledge Check</h3>
                <p className="text-slate-500">There are no MCQs available for this topic yet.</p>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center mb-8">
                <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full mr-4"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                    Knowledge Check
                </h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {mcqs.map((m, idx) => (
                    <div key={m.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                        <div className="flex items-start gap-4 mb-6">
                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 font-bold rounded-lg text-sm">{idx + 1}</span>
                            <h4 className="text-xl font-bold text-slate-800 leading-snug">{m.question}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['A', 'B', 'C', 'D'].map(opt => {
                                const isSelected = userAnswers[m.id] === opt;
                                const isCorrect = m.correctOption === opt;
                                const showResult = !!userAnswers[m.id];

                                let btnClass = "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3 font-medium ";
                                if (showResult) {
                                    if (isSelected && isCorrect) btnClass += "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-emerald-100 ring-2 ring-emerald-500/20";
                                    else if (isSelected && !isCorrect) btnClass += "bg-red-50 border-red-500 text-red-700 shadow-red-100";
                                    else if (!isSelected && isCorrect) btnClass += "bg-emerald-50 border-emerald-500 text-emerald-700 opacity-70";
                                    else btnClass += "bg-slate-50 border-slate-100 text-slate-400 opacity-50";
                                } else {
                                    btnClass += "bg-white border-slate-200 hover:border-indigo-400 hover:bg-slate-50 text-slate-600 hover:shadow-md";
                                }

                                return (
                                    <button
                                        key={opt}
                                        onClick={() => !showResult && handleMCQSelect(m.id, opt, m.correctOption)}
                                        disabled={showResult}
                                        className={btnClass}
                                    >
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border ${showResult && (isSelected || isCorrect) ? 'border-transparent bg-white/50' : 'border-slate-300 bg-slate-100'}`}>
                                            {opt}
                                        </span>
                                        {m[`option${opt}`]}
                                        {showResult && isCorrect && <svg className="w-5 h-5 ml-auto text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                        {showResult && isSelected && !isCorrect && <svg className="w-5 h-5 ml-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                                    </button>
                                );
                            })}
                        </div>
                        {feedback[m.id] && (
                            <div className={`mt-4 p-4 rounded-lg text-sm font-bold flex items-center gap-2 animate-fadeIn ${feedback[m.id] === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                {feedback[m.id] === 'correct' ? (
                                    <>
                                        <span className="text-xl">🎉</span> Correct Answer! Great job.
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl">❌</span> Incorrect. The correct answer was option {m.correctOption}.
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopicMCQs;
