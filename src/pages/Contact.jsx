import React, { useState } from 'react';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission
        setTimeout(() => {
            setSubmitted(true);
            setLoading(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container-custom section relative z-10">
                    <div className="text-center max-w-3xl mx-auto animate-fadeIn">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Get in Touch</h1>
                        <p className="text-xl text-indigo-100 leading-relaxed">
                            Have questions about Java programming? Need help with our platform? We'd love to hear from you!
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc" />
                    </svg>
                </div>
            </section>

            {/* Contact Content */}
            <section className="container-custom section">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Contact Info Cards */}
                    <div className="card-hover p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex-center">
                            <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Email Us</h3>
                        <p className="text-slate-600 mb-3">Send us an email anytime</p>
                        <a href="mailto:support@javamastery.com" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                            support@javamastery.com
                        </a>
                    </div>

                    <div className="card-hover p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-orange-400 rounded-2xl flex-center">
                            <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Visit Us</h3>
                        <p className="text-slate-600 mb-3">Come say hello</p>
                        <p className="text-slate-700 font-medium">
                            123 Learning Street<br />
                            Tech City, TC 12345
                        </p>
                    </div>

                    <div className="card-hover p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-400 rounded-2xl flex-center">
                            <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Call Us</h3>
                        <p className="text-slate-600 mb-3">Mon-Fri from 8am to 5pm</p>
                        <a href="tel:+1234567890" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                            +91 7671988410

                        </a>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-3">Send Us a Message</h2>
                            <p className="text-slate-600">Fill out the form below and we'll get back to you as soon as possible</p>
                        </div>

                        {submitted && (
                            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 flex items-start animate-fadeIn">
                                <svg className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h4 className="font-semibold mb-1">Message Sent Successfully!</h4>
                                    <p className="text-sm">Thank you for contacting us. We'll respond within 24 hours.</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-slate-700 font-semibold mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-semibold mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="How can we help you?"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-semibold mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="input-field h-40 resize-y"
                                    placeholder="Tell us more about your question or feedback..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold gradient-text mb-4">Frequently Asked Questions</h2>
                        <p className="text-slate-600">Quick answers to common questions</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card p-6">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-start">
                                <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                How do I get started?
                            </h3>
                            <p className="text-slate-600 text-sm">Simply browse our topics on the home page and start learning! No registration required to view content.</p>
                        </div>

                        <div className="card p-6">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-start">
                                <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                Is JavaMastery free?
                            </h3>
                            <p className="text-slate-600 text-sm">Yes! All our Java learning resources are completely free to access and use.</p>
                        </div>

                        <div className="card p-6">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-start">
                                <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                Can I suggest new topics?
                            </h3>
                            <p className="text-slate-600 text-sm">Absolutely! Use the contact form above to suggest topics you'd like to see covered.</p>
                        </div>

                        <div className="card p-6">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-start">
                                <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                How often is content updated?
                            </h3>
                            <p className="text-slate-600 text-sm">We regularly add new topics and update existing content to keep up with Java best practices.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
