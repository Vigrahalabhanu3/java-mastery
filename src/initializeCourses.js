import { doc, setDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Migrate existing Java topics from java_topics to courses/java/topics
 * This preserves all your existing data
 */

export const migrateJavaTopics = async () => {
    console.log('🚀 Starting migration from java_topics to courses structure...');

    try {
        // Step 1: Check if java_topics collection exists
        const oldTopicsRef = collection(db, 'java_topics');
        const topicsSnapshot = await getDocs(oldTopicsRef);

        if (topicsSnapshot.empty) {
            console.log('⚠️ No topics found in java_topics collection');
            return {
                success: false,
                message: 'No existing Java topics found to migrate'
            };
        }

        console.log(`📚 Found ${topicsSnapshot.size} topics to migrate`);

        // Step 2: Create Java course
        const javaCoursRef = doc(db, 'courses', 'java');
        await setDoc(javaCoursRef, {
            name: 'Java Programming',
            description: 'Master Java from basics to advanced concepts. Learn object-oriented programming, data structures, and build real-world applications.',
            icon: '☕',
            color: '#f89820',
            slug: 'java',
            createdAt: new Date(),
            topicCount: topicsSnapshot.size
        });
        console.log('✅ Created Java course');

        // Step 3: Migrate each topic with all its questions
        let migratedTopics = 0;
        let migratedQuestions = 0;

        for (const topicDoc of topicsSnapshot.docs) {
            const topicData = topicDoc.data();
            const topicId = topicDoc.id;

            console.log(`📝 Migrating topic: ${topicData.title || topicId}`);

            // Create topic in new structure
            const newTopicRef = doc(db, 'courses', 'java', 'topics', topicId);
            await setDoc(newTopicRef, {
                title: topicData.title || 'Untitled Topic',
                description: topicData.description || '',
                createdAt: topicData.createdAt || new Date()
            });

            // Migrate all questions for this topic
            const oldQuestionsRef = collection(db, 'java_topics', topicId, 'questions');
            const questionsSnapshot = await getDocs(oldQuestionsRef);

            console.log(`  ↳ Found ${questionsSnapshot.size} questions`);

            for (const questionDoc of questionsSnapshot.docs) {
                const questionData = questionDoc.data();
                const questionId = questionDoc.id;

                const newQuestionRef = doc(db, 'courses', 'java', 'topics', topicId, 'questions', questionId);
                await setDoc(newQuestionRef, {
                    question: questionData.question || '',
                    answer: questionData.answer || '',
                    createdAt: questionData.createdAt || new Date()
                });

                migratedQuestions++;
            }

            migratedTopics++;
            console.log(`✅ Migrated topic ${migratedTopics}/${topicsSnapshot.size}: ${topicData.title}`);
        }

        console.log('🎉 Migration completed successfully!');
        console.log(`📊 Summary:`);
        console.log(`   - Migrated ${migratedTopics} topics`);
        console.log(`   - Migrated ${migratedQuestions} questions`);
        console.log(`   - Old data in java_topics is preserved (you can delete it later)`);

        return {
            success: true,
            message: `Successfully migrated ${migratedTopics} topics and ${migratedQuestions} questions`,
            migratedTopics,
            migratedQuestions
        };

    } catch (error) {
        console.error('❌ Migration failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Create other sample courses (empty, for future use)
export const createOtherCourses = async () => {
    console.log('🚀 Creating sample courses...');

    const courses = [
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

    try {
        for (const course of courses) {
            const courseRef = doc(db, 'courses', course.id);
            await setDoc(courseRef, {
                ...course,
                createdAt: new Date(),
                topicCount: 0
            });
            console.log(`✅ Created course: ${course.name}`);
        }

        return {
            success: true,
            message: 'Sample courses created successfully'
        };
    } catch (error) {
        console.error('❌ Error creating courses:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
