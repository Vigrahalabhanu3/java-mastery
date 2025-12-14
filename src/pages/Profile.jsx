import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { uploadProfileImage, validateImageFile } from '../utils/imageUpload';

const Icons = {
    Camera: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    User: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    Calendar: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Mail: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Shield: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
};

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // User Stats (mock for now, could be fetched)
    const [joinDate, setJoinDate] = useState(new Date());

    // Form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isImageFullView, setIsImageFullView] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setJoinDate(new Date(currentUser.metadata.creationTime));
                await fetchUserProfile(currentUser.uid);
            } else {
                navigate('/login');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchUserProfile = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setFirstName(data.firstName || '');
                setLastName(data.lastName || '');
                setDateOfBirth(data.dateOfBirth ? new Date(data.dateOfBirth.seconds * 1000).toISOString().split('T')[0] : '');
                setPhotoURL(data.photoURL || '');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.valid) {
            showMessage('error', validation.error);
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        if (!firstName.trim() || !lastName.trim()) {
            showMessage('error', 'First name and last name are required');
            return;
        }

        if (dateOfBirth) {
            const dob = new Date(dateOfBirth);
            const age = (new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000);
            if (age < 13) {
                showMessage('error', 'You must be at least 13 years old');
                return;
            }
        }

        setSaving(true);
        try {
            let newPhotoURL = photoURL;
            if (imageFile) {
                newPhotoURL = await uploadProfileImage(user.uid, imageFile);
            }

            const profileData = {
                email: user.email,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                photoURL: newPhotoURL,
                updatedAt: new Date()
            };

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                await updateDoc(doc(db, 'users', user.uid), profileData);
            } else {
                await setDoc(doc(db, 'users', user.uid), { ...profileData, createdAt: new Date() });
            }

            setPhotoURL(newPhotoURL);
            setImageFile(null);
            setImagePreview('');
            showMessage('success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            showMessage('error', 'Failed to save profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const getInitials = () => {
        if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
        return user?.email?.substring(0, 2).toUpperCase() || 'U';
    };

    if (loading) {
        return (
            <div className="flex-center min-h-screen bg-slate-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Hero Section */}
            <div className="relative bg-slate-900 overflow-hidden py-20 pb-32">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <span className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold tracking-wider mb-4">
                        ACCOUNT SETTINGS
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Profile</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Manage your personal details, secure your account, and personalize your experience on JavaMastery.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-24 pb-20 relative z-20">
                {/* Message Alert */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl shadow-lg border flex items-center animate-slideInRight ${message.type === 'success' ? 'bg-white border-green-500 text-green-700' : 'bg-white border-red-500 text-red-700'}`}>
                        <div className={`mr-3 p-1 rounded-full ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {message.type === 'success' ?
                                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> :
                                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            }
                        </div>
                        <span className="font-medium">{message.text}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-violet-600 opacity-90"></div>

                            <div className="relative mb-4 mt-8">
                                <div
                                    onClick={() => setIsImageFullView(true)}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden relative bg-slate-100 flex items-center justify-center group cursor-pointer"
                                    title="Click to view full size"
                                >
                                    {imagePreview || photoURL ? (
                                        <img src={imagePreview || photoURL} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <span className="text-4xl font-bold text-slate-400">{getInitials()}</span>
                                    )}

                                    {/* Hover Overlay hint */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">

                                    </div>
                                </div>
                                <button onClick={() => document.getElementById('photo-upload').click()} className="absolute bottom-1 right-1 bg-white text-indigo-600 p-2 rounded-full shadow-md hover:scale-110 transition-transform z-10">
                                    <Icons.Camera />
                                </button>
                                {/* Hidden File Input */}
                                <input id="photo-upload" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                            </div>

                            {/* Lightbox Overlay */}
                            {isImageFullView && (
                                <div
                                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
                                    onClick={() => setIsImageFullView(false)}
                                >
                                    <button
                                        onClick={() => setIsImageFullView(false)}
                                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
                                    >
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                    <img
                                        src={imagePreview || photoURL}
                                        alt="Profile Full View"
                                        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl animate-scaleIn"
                                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                                    />
                                </div>
                            )}

                            <h2 className="text-2xl font-bold text-slate-800">{firstName || 'User'} {lastName}</h2>
                            <p className="text-slate-500 mb-6">{user.email}</p>

                            <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</p>
                                    <p className="font-semibold text-slate-700">{joinDate.toLocaleDateString()}</p>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                            <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-3">
                                <Icons.Shield /> Privacy Tips
                            </h3>
                            <ul className="text-sm text-indigo-700 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1">•</span>
                                    <span>Your profile details are private.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1">•</span>
                                    <span>Only your name and photo are visible on certificates.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1">•</span>
                                    <span>Use a strong password to keep your account safe.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Icons.User /></span>
                                Personal Details
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="input-field"
                                            placeholder="Jane"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="input-field"
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <Icons.Mail />
                                        </div>
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="input-field pl-10 bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">To change your email, please contact support.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <Icons.Calendar />
                                        </div>
                                        <input
                                            type="date"
                                            value={dateOfBirth}
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                            className="input-field pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="btn-primary py-3 px-8 text-base shadow-indigo-500/20 disabled:opacity-70"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/')}
                                        className="btn-ghost"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
