import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Home from './pages/Home';
import Topic from './pages/Topic';
import Admin from './pages/Admin';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

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

    if (loading) return <div className="flex justify-center items-center h-screen text-indigo-600">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
}

function NavBar() {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const handleLogoDoubleClick = (e) => {
        e.preventDefault(); // Prevent default link behavior if needed, though usually double click is separate
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? "text-indigo-600 font-semibold" : "text-slate-600 hover:text-indigo-600";

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <div
                    onDoubleClick={handleLogoDoubleClick}
                    className="cursor-pointer select-none"
                    title="Double click for Admin"
                >
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                        JavaMastery
                    </Link>
                </div>
                <div className="flex items-center space-x-6">
                    <Link to="/" className={`${isActive('/')} transition-colors`}>Home</Link>
                    {user && (
                        <>
                            <Link to="/admin" className={`${isActive('/admin')} transition-colors`}>Dashboard</Link>
                            <button onClick={handleLogout} className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors font-medium">
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
                <NavBar />
                <main className="container mx-auto px-4 py-8 flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/topic/:topicId" element={<Topic />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
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
                <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
                    <div className="container mx-auto px-4 text-center text-slate-500">
                        <p>&copy; 2024 JavaMastery. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
