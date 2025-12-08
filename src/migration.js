import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Migration Script: Convert java_topics to courses structure
 * 
 * Old Structure:
 * java_topics/{topicId}/{ title, description, questions/{questionId} }
 * 
 * New Structure:
 * courses/{courseId}/{ name, description, icon, color }
 * courses/{courseId}/topics/{topicId}/{ title, description, questions/{questionId} }
 */

export const migrateToCoursesStructure = async () => {
    console.log('🚀 Starting migration to multi-course structure...');

    try {
        // Step 1: Create Java course
        const javaCoursRef = doc(db, 'courses', 'java');
        await setDoc(javaCoursRef, {
            name: 'Java Programming',
            description: 'Master Java from basics to advanced concepts. Learn object-oriented programming, data structures, and build real-world applications.',
            icon: '☕', // Coffee emoji for Java
            color: '#f89820', // Java orange color
            slug: 'java',
            createdAt: new Date(),
            topicCount: 0
        });
        console.log('✅ Created Java course');

        // Step 2: Get all existing topics from java_topics
        const oldTopicsRef = collection(db, 'java_topics');
        const topicsSnapshot = await getDocs(oldTopicsRef);

        console.log(`📚 Found ${topicsSnapshot.size} topics to migrate`);

        // Step 3: Migrate each topic
        let migratedCount = 0;
        for (const topicDoc of topicsSnapshot.docs) {
            const topicData = topicDoc.data();
            const topicId = topicDoc.id;

            // Create topic in new structure
            const newTopicRef = doc(db, 'courses', 'java', 'topics', topicId);
            await setDoc(newTopicRef, {
                title: topicData.title,
                description: topicData.description,
                createdAt: topicData.createdAt || new Date()
            });

            // Migrate questions for this topic
            const oldQuestionsRef = collection(db, 'java_topics', topicId, 'questions');
            const questionsSnapshot = await getDocs(oldQuestionsRef);

            for (const questionDoc of questionsSnapshot.docs) {
                const questionData = questionDoc.data();
                const questionId = questionDoc.id;

                const newQuestionRef = doc(db, 'courses', 'java', 'topics', topicId, 'questions', questionId);
                await setDoc(newQuestionRef, {
                    question: questionData.question,
                    answer: questionData.answer,
                    createdAt: questionData.createdAt || new Date()
                });
            }

            migratedCount++;
            console.log(`✅ Migrated topic ${migratedCount}/${topicsSnapshot.size}: ${topicData.title}`);
        }

        // Step 4: Update course topic count
        await setDoc(javaCoursRef, {
            topicCount: migratedCount
        }, { merge: true });

        console.log('🎉 Migration completed successfully!');
        console.log(`📊 Summary: Migrated ${migratedCount} topics to Java course`);

        return {
            success: true,
            migratedTopics: migratedCount,
            message: 'Migration completed successfully'
        };

    } catch (error) {
        console.error('❌ Migration failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Optional: Function to create sample courses
export const createSampleCourses = async () => {
    const sampleCourses = [
        {
            id: 'python',
            name: 'Python Programming',
            description: 'Learn Python from scratch. Master data science, web development, and automation with Python.',
            icon: '🐍',
            color: '#3776ab',
            slug: 'python'
        },
        {
            id: 'javascript',
            name: 'JavaScript Mastery',
            description: 'Become a JavaScript expert. Learn modern ES6+, React, Node.js, and build full-stack applications.',
            icon: '⚡',
            color: '#f7df1e',
            slug: 'javascript'
        },
        {
            id: 'data-structures',
            name: 'Data Structures & Algorithms',
            description: 'Master fundamental data structures and algorithms. Prepare for technical interviews and competitive programming.',
            icon: '🌳',
            color: '#4caf50',
            slug: 'data-structures'
        }
    ];

    for (const course of sampleCourses) {
        const courseRef = doc(db, 'courses', course.id);
        await setDoc(courseRef, {
            ...course,
            createdAt: new Date(),
            topicCount: 0
        });
        console.log(`✅ Created sample course: ${course.name}`);
    }
};
