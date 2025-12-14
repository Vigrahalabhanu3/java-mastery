import React from 'react';

const TopicSlides = ({ slideUrl }) => {
    if (!slideUrl) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 animate-fadeIn">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center text-3xl">
                    📊
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Slides Available</h3>
                <p className="text-slate-500">There are no slides attached to this topic yet.</p>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <span className="mr-3 text-3xl">📊</span> Lecture Slides
            </h3>
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <iframe
                    src={slideUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen={true}
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                ></iframe>
            </div>
        </div>
    );
};

export default TopicSlides;
