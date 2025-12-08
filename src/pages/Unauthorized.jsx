import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">Access Denied</h1>

                    {/* Message */}
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        This page is restricted to administrators only. You don't have permission to access the admin dashboard.
                    </p>

                    {/* Info Box */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-1">Need Admin Access?</h4>
                                <p className="text-sm text-blue-700">
                                    If you believe you should have admin access, please contact the site administrator.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link
                            to="/"
                            className="btn-primary w-full py-3 text-lg font-semibold inline-block"
                        >
                            Go to Home
                        </Link>
                        <Link
                            to="/contact"
                            className="block text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Unauthorized;
