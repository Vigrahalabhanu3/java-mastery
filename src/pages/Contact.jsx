import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

// Accordion Component
const AccordionItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
                onClick={onClick}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none bg-white"
            >
                <span className={`text-lg font-semibold ${isOpen ? 'text-indigo-600' : 'text-slate-800'}`}>
                    {question}
                </span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-slate-400`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-50 bg-slate-50/50 pt-4">
                    {answer}
                </div>
            </div>
        </div>
    );
};

function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [openOutput, setOpenOutput] = useState(0); // Index of open FAQ
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
                if (user.email) {
                    setFormData(prev => ({ ...prev, email: user.email }));
                }
            } else {
                setIsLoggedIn(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        }, 1500);
    };

    const faqs = [
        { q: "Is JavaMastery really free?", a: "Yes! All our courses, tutorials, and practice questions are completely free. We believe in open access to education." },
        { q: "Do I need to sign up?", a: "No, you can browse all content without an account. However, creating an account helps you track your progress and bookmark topics." },
        { q: "Can I contribute to the courses?", a: "Absolutely! We welcome contributions. Please contact us using the form above if you're interested in becoming a mentor or content creator." },
        { q: "How do I report a bug?", a: "If you spot an error in our code or a bug on the site, please let us know via the contact form. We appreciate your help in keeping JavaMastery accurate!" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
            {/* Hero Section */}
            <section className="relative bg-slate-900 py-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black"></div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="container-custom px-6 relative z-10 text-center max-w-3xl mx-auto">
                    <div className="inline-block mb-4 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/30">
                        24/7 Support
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">We'd love to hear from you</h1>
                    <p className="text-xl text-slate-300 leading-relaxed">
                        Whether you have a question about our courses, pricing, or anything else, our team is ready to answer all your questions.
                    </p>
                </div>
            </section>

            {/* Main Content Overlay */}
            <section className="container-custom px-6 -mt-20 relative z-20 mb-24">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row">

                    {/* Contact Info Sidebar */}
                    <div className="lg:w-1/3 bg-gradient-to-br from-indigo-600 to-violet-700 p-10 text-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                            <p className="text-indigo-100 mb-10 text-sm leading-relaxed">
                                Fill up the form and our team will get back to you within 24 hours.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Call Us</h4>
                                        <p className="text-indigo-200 text-sm">+91 7671988410</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Email</h4>
                                        <p className="text-indigo-200 text-sm">support@javamastery.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Address</h4>
                                        <p className="text-indigo-200 text-sm">123 Learning Street, Tech City</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <div className="flex space-x-4">
                                {/* Social Icons Placeholders */}
                                <a href="#" className="w-8 h-8 rounded-full bg-indigo-500/50 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                </a>
                                <a href="#" className="w-8 h-8 rounded-full bg-indigo-500/50 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.072 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="lg:w-2/3 p-10 bg-white">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-600">First Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field bg-slate-50 border-slate-200 focus:bg-white" placeholder="John" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-600">Last Name</label>
                                    <input type="text" className="input-field bg-slate-50 border-slate-200 focus:bg-white" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoggedIn}
                                    className={`input-field border-slate-200 focus:bg-white ${isLoggedIn ? 'bg-slate-100 cursor-not-allowed text-slate-500' : 'bg-slate-50'}`}
                                    placeholder="john@example.com"
                                    required
                                />
                                {isLoggedIn && <p className="text-xs text-slate-400">Email is auto-filled from your account.</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600">Message</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} className="input-field bg-slate-50 border-slate-200 focus:bg-white h-32 resize-none" placeholder="Write your message here..." required></textarea>
                            </div>

                            <button type="submit" disabled={status === 'loading' || status === 'success'} className={`btn-primary w-full py-4 text-lg font-semibold shadow-lg transition-all duration-300 flex justify-center items-center ${status === 'success' ? 'bg-green-500 hover:bg-green-600 border-green-500' : ''}`}>
                                {status === 'loading' && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                                {status === 'success' ? 'Message Sent!' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mt-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Frequently Asked Questions</h2>
                        <p className="text-slate-600">Everything you need to know about JavaMastery</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                question={faq.q}
                                answer={faq.a}
                                isOpen={openOutput === index}
                                onClick={() => setOpenOutput(openOutput === index ? -1 : index)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
