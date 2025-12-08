import React, { useState } from 'react';
import { migrateJavaTopics, createOtherCourses } from '../initializeCourses';

function MigrationTool() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleMigrate = async () => {
        if (!window.confirm('Migrate your existing Java topics to the new courses structure? This will preserve all your data.')) {
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const migrationResult = await migrateJavaTopics();
            setResult(migrationResult);
        } catch (error) {
            setResult({
                success: false,
                error: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSamples = async () => {
        if (!window.confirm('Create sample courses (Python, JavaScript, Data Structures)?')) {
            return;
        }

        setLoading(true);
        try {
            const createResult = await createOtherCourses();
            setResult(createResult);
        } catch (error) {
            setResult({
                success: false,
                error: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-2xl mx-auto p-8">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Data Migration Tool</h1>
                    <p className="text-slate-600 mb-6">
                        Migrate your existing Java topics from the old structure to the new multi-course platform.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={handleMigrate}
                            disabled={loading}
                            className="w-full btn-primary py-3 text-lg disabled:opacity-50"
                        >
                            {loading ? 'Migrating...' : 'Migrate Java Topics'}
                        </button>

                        <button
                            onClick={handleCreateSamples}
                            disabled={loading}
                            className="w-full btn-secondary py-3 text-lg disabled:opacity-50"
                        >
                            Create Sample Courses
                        </button>
                    </div>

                    {result && (
                        <div className={`mt-6 p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                            <h3 className={`font-semibold mb-2 ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                                {result.success ? '✅ Success' : '❌ Error'}
                            </h3>
                            <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                                {result.message || result.error}
                            </p>
                            {result.migratedTopics && (
                                <div className="text-green-700 mt-2 space-y-1">
                                    <p>📚 Migrated {result.migratedTopics} topics</p>
                                    <p>❓ Migrated {result.migratedQuestions} questions</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Instructions</h4>
                        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                            <li>Click "Migrate Java Topics" to move your existing data to new structure</li>
                            <li>All your topics and questions will be preserved</li>
                            <li>Optionally create sample courses (Python, JS, DSA)</li>
                            <li>Check home page to see the Java course</li>
                            <li>Use Admin panel to manage all courses</li>
                            <li>Old java_topics collection will remain (you can delete it later)</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MigrationTool;
