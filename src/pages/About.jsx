import React from 'react';
import { Link } from 'react-router-dom';

function About() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-slate-900/95 to-slate-900/90"></div>

                <div className="container-custom relative z-10 text-center max-w-4xl mx-auto px-6">
                    <div className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mb-6 animate-fadeIn">
                        About JavaMastery
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 animate-slideInRight">
                        Empowering the next generation of <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Developers</span>
                    </h1>
                    <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10 animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
                        We provide high-quality, free education to help you master Java programming, from your first line of code to building complex applications.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                        <a href="#mission" className="btn-primary px-8 py-3.5 text-lg shadow-glow-lg">
                            Our Mission
                        </a>
                        <Link to="/contact" className="px-8 py-3.5 rounded-lg bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-sm">
                            Contact Team
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section id="mission" className="py-24 bg-white relative overflow-hidden">
                <div className="container-custom px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-50"></div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-50"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                                alt="Team collaborating"
                                className="relative rounded-2xl shadow-2xl border-4 border-slate-50 rotate-2 hover:rotate-0 transition-transform duration-500"
                            />
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-indigo-600 font-semibold mb-2 tracking-wide uppercase">Our Mission</h2>
                            <h3 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                                Making education accessible, <br />engaging, and effective.
                            </h3>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                JavaMastery started with a simple idea: that quality programming education should be available to everyone. We've replaced dry textbooks with interactive examples, comprehensive guides, and a supportive community.
                            </p>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Whether you're a student, a career changer, or a professional developer, our platform is designed to help you grow. We believe in learning by doing, which is why practicality is at the core of everything we teach.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="border-l-4 border-indigo-500 pl-4">
                                    <div className="text-3xl font-bold text-slate-900 mb-1">100%</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-wide">Free Content</div>
                                </div>
                                <div className="border-l-4 border-pink-500 pl-4">
                                    <div className="text-3xl font-bold text-slate-900 mb-1">24/7</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-wide">Community Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-slate-50">
                <div className="container-custom px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-indigo-600 font-semibold mb-2 tracking-wide uppercase">Why Choose Us</h2>
                        <h3 className="text-4xl font-bold text-slate-900 mb-4">Core Values that Drive Us</h3>
                        <p className="text-lg text-slate-600">
                            We're committed to excellence in education and building a platform that truly serves our learners.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
                                title: "Quality First",
                                desc: "Rigorous standards for every tutorial. We ensure accuracy and best practices in every line of code we share.",
                                color: "indigo"
                            },
                            {
                                icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
                                title: "Community Driven",
                                desc: "We listen to our learners. Your feedback shapes the curriculum and helps us improve constantly.",
                                color: "pink"
                            },
                            {
                                icon: <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />,
                                title: "Always Open",
                                desc: "Knowledge should be free. We pledge to keep our core learning resources open and accessible to all.",
                                color: "teal"
                            }
                        ].map((item, i) => (
                            <div key={i} className="group bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-14 h-14 rounded-xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        {item.icon}
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section with Glassmorphism */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-900">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/50 to-purple-600/50"></div>
                </div>

                <div className="container-custom px-6 relative z-10">
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                                { number: "50+", label: "Courses" },
                                { number: "10K+", label: "Students" },
                                { number: "500+", label: "Lessons" },
                                { number: "4.9", label: "Rating" }
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.number}</div>
                                    <div className="text-indigo-100 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team/Join Section */}
            <section className="py-24 bg-white">
                <div className="container-custom px-6 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Join the Movement</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
                        We're always looking for passionate developers to contribute to our open-source curriculum or help mentor new students.
                    </p>
                    <Link to="/contact" className="btn-primary px-10 py-4 text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40">
                        Get Involved
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default About;
