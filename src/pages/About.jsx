import React from 'react';
import { Link } from 'react-router-dom';

function About() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container-custom section relative z-10">
                    <div className="text-center max-w-3xl mx-auto animate-fadeIn">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">About JavaMastery</h1>
                        <p className="text-xl text-indigo-100 leading-relaxed">
                            Empowering developers to master Java programming through comprehensive, accessible, and high-quality learning resources.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc" />
                    </svg>
                </div>
            </section>

            {/* Mission Section */}
            <section className="container-custom section">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold gradient-text mb-4">Our Mission</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            To make Java programming education accessible, engaging, and effective for developers at all skill levels.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12 mb-12">
                        <p className="text-lg text-slate-700 leading-relaxed mb-6">
                            JavaMastery was created with a simple goal: to provide a comprehensive, free platform where anyone can learn Java programming from the ground up. We believe that quality education should be accessible to everyone, regardless of their background or financial situation.
                        </p>
                        <p className="text-lg text-slate-700 leading-relaxed">
                            Our platform combines in-depth tutorials, practical examples, and interactive Q&A to create a complete learning experience. Whether you're a complete beginner or an experienced developer looking to deepen your Java knowledge, JavaMastery has something for you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-white section">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold gradient-text mb-4">Our Values</h2>
                        <p className="text-lg text-slate-600">The principles that guide everything we do</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 rounded-xl bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex-center">
                                <svg className="w-10 h-10 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Quality Content</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Every tutorial and example is carefully crafted to ensure accuracy, clarity, and practical value.
                            </p>
                        </div>

                        <div className="text-center p-8 rounded-xl bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-orange-400 rounded-2xl flex-center">
                                <svg className="w-10 h-10 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Community First</h3>
                            <p className="text-slate-600 leading-relaxed">
                                We're building a supportive community where learners can grow together and help each other succeed.
                            </p>
                        </div>

                        <div className="text-center p-8 rounded-xl bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-teal-400 rounded-2xl flex-center">
                                <svg className="w-10 h-10 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Always Free</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Education should be accessible to all. Our platform will always remain free for everyone to use.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container-custom section">
                <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl p-12 text-white">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">JavaMastery by the Numbers</h2>
                        <p className="text-xl text-indigo-100">Our impact on the Java learning community</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-5xl font-bold mb-2">50+</div>
                            <div className="text-indigo-100">Topics Covered</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold mb-2">500+</div>
                            <div className="text-indigo-100">Practice Questions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold mb-2">1000+</div>
                            <div className="text-indigo-100">Active Learners</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold mb-2">100%</div>
                            <div className="text-indigo-100">Free Forever</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container-custom section">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold gradient-text mb-4">What Makes Us Different</h2>
                    <p className="text-lg text-slate-600">Features that set JavaMastery apart</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <div className="card p-8">
                        <div className="flex items-start">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex-center flex-shrink-0 mr-4">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Practical Examples</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Learn by doing with real-world code examples that you can run and modify yourself.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card p-8">
                        <div className="flex items-start">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex-center flex-shrink-0 mr-4">
                                <svg className="w-6 h-6 text-pink-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Interactive Q&A</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Test your knowledge with curated questions and detailed explanations for each answer.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card p-8">
                        <div className="flex items-start">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex-center flex-shrink-0 mr-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Structured Learning Path</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Follow a carefully designed curriculum that takes you from beginner to advanced topics.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card p-8">
                        <div className="flex items-start">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex-center flex-shrink-0 mr-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Fast & Modern</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Enjoy a clean, responsive interface optimized for learning on any device, anywhere.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container-custom section">
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-12 text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
                    <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of developers who are mastering Java with JavaMastery
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/" className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                            Browse Topics
                        </Link>
                        <Link to="/contact" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
