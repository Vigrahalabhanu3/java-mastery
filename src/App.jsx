import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { isAdminEmail } from './config/admin';
import Home from './pages/Home';
import Topic from './pages/Topic';
import Admin from './pages/Admin';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Contact from './pages/Contact';
import About from './pages/About';
import Unauthorized from './pages/Unauthorized';

function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex-center h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // Check if user is authenticated
    if (!user) return <Navigate to="/login" />;

    // Check if user has admin privileges
    if (!isAdminEmail(user.email)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}

function NavBar() {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsAdmin(currentUser ? isAdminEmail(currentUser.email) : false);
        });
        return () => unsubscribe();
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const handleLogoDoubleClick = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    const isActive = (path) =>
        location.pathname === path
            ? "text-indigo-600 font-semibold"
            : "text-slate-600 hover:text-indigo-600";

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shadow-sm">
            <div className="container-custom">
                <div className="h-16 flex justify-between items-center">
                    {/* Logo */}
                    <div
                        onDoubleClick={handleLogoDoubleClick}
                        className="cursor-pointer select-none"
                        title="Double click for Admin"
                    >
                        <Link
                            to="/"
                            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                        >
                            JavaMastery
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className={`${isActive('/')} transition-colors`}>
                            Home
                        </Link>
                        <Link to="/about" className={`${isActive('/about')} transition-colors`}>
                            About
                        </Link>
                        <Link to="/contact" className={`${isActive('/contact')} transition-colors`}>
                            Contact
                        </Link>
                        {user && (
                            <>
                                {isAdmin && (
                                    <Link to="/admin" className={`${isActive('/admin')} transition-colors`}>
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                        {!user && (
                            <Link
                                to="/login"
                                className="btn-primary text-sm px-4 py-2"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6 text-slate-600"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {mobileMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white animate-slideInLeft">
                    <div className="container-custom py-4 space-y-3">
                        <Link
                            to="/"
                            className={`block px-4 py-2 rounded-lg ${isActive('/')} transition-colors`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className={`block px-4 py-2 rounded-lg ${isActive('/about')} transition-colors`}
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className={`block px-4 py-2 rounded-lg ${isActive('/contact')} transition-colors`}
                        >
                            Contact
                        </Link>
                        {user && (
                            <>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className={`block px-4 py-2 rounded-lg ${isActive('/admin')} transition-colors`}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                        {!user && (
                            <Link
                                to="/login"
                                className="block px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-center font-medium"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <NavBar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/topic/:topicId" element={<Topic />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <Admin />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/super-secret-admin-6421" element={<Navigate to="/admin" />} />
                    </Routes>
                </main>

                {/* Enhanced Footer */}
                <footer className="bg-slate-900 text-slate-300 mt-auto">
                    <div className="container-custom py-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Brand */}
                            <div className="md:col-span-2">
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-3">
                                    JavaMastery
                                </h3>
                                <p className="text-slate-400 mb-4 max-w-md">
                                    Master Java programming with comprehensive tutorials, interactive Q&A, and hands-on examples. From basics to advanced concepts.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex-center transition-colors" aria-label="Twitter">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex-center transition-colors" aria-label="GitHub">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex-center transition-colors" aria-label="LinkedIn">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                                <ul className="space-y-2">
                                    <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
                                    <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About</Link></li>
                                    <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
                                    <li><Link to="/admin" className="hover:text-indigo-400 transition-colors">Dashboard</Link></li>
                                </ul>
                            </div>

                            {/* Resources */}
                            <div>
                                <h4 className="font-semibold text-white mb-4">Resources</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a></li>
                                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Tutorials</a></li>
                                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Community</a></li>
                                    <li><a href="#" className="hover:text-indigo-400 transition-colors">Support</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
                            <p>&copy; {new Date().getFullYear()} JavaMastery. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
