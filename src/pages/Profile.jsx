import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { uploadProfileImage, validateImageFile } from '../utils/imageUpload';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
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

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) return;

        // Validation
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

            // Upload image if selected
            if (imageFile) {
                newPhotoURL = await uploadProfileImage(user.uid, imageFile);
            }

            // Prepare profile data
            const profileData = {
                email: user.email,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                photoURL: newPhotoURL,
                updatedAt: new Date()
            };

            // Check if profile exists
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists()) {
                // Update existing profile
                await updateDoc(doc(db, 'users', user.uid), profileData);
            } else {
                // Create new profile
                await setDoc(doc(db, 'users', user.uid), {
                    ...profileData,
                    createdAt: new Date()
                });
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
        if (firstName && lastName) {
            return `${firstName[0]}${lastName[0]}`.toUpperCase();
        }
        return user?.email?.substring(0, 2).toUpperCase() || 'U';
    };

    if (loading) {
        return (
            <div className="flex-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">My Profile</h1>
                    <p className="text-slate-600">Manage your personal information and profile picture</p>
                </div>

                {/* Message Alert */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center pb-6 border-b border-slate-200">
                            <div className="relative mb-4">
                                {imagePreview || photoURL ? (
                                    <img
                                        src={imagePreview || photoURL}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-indigo-100">
                                        {getInitials()}
                                    </div>
                                )}
                                <label
                                    htmlFor="photo-upload"
                                    className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </label>
                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-sm text-slate-500 text-center">
                                Click the camera icon to upload a profile picture<br />
                                <span className="text-xs">JPG, PNG or WEBP (max 5MB)</span>
                            </p>
                        </div>

                        {/* Email (Read-only) */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="input-field bg-slate-100 cursor-not-allowed"
                            />
                            <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="input-field"
                                    required
                                    placeholder="John"
                                    minLength={2}
                                    maxLength={50}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="input-field"
                                    required
                                    placeholder="Doe"
                                    minLength={2}
                                    maxLength={50}
                                />
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="input-field"
                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
                            />
                            <p className="text-xs text-slate-500 mt-1">You must be at least 13 years old</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary flex-1 disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* Account Info */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Account Information</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Your profile information is private and only visible to you</li>
                        <li>• Profile pictures are visible to other authenticated users</li>
                        <li>• All fields except email can be updated anytime</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Profile;
