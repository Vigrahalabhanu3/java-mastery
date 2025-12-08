import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Compress and resize image to optimize for profile pictures
 * @param {File} file - The image file to compress
 * @returns {Promise<Blob>} - Compressed image blob
 */
export const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 400; // 400x400px

                let width = img.width;
                let height = img.height;

                // Maintain aspect ratio, fit to square
                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to compress image'));
                        }
                    },
                    'image/jpeg',
                    0.8 // 80% quality
                );
            };
            img.onerror = () => reject(new Error('Failed to load image'));
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
    });
};

/**
 * Upload profile image to Firebase Storage
 * @param {string} userId - User ID
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export const uploadProfileImage = async (userId, file) => {
    try {
        // Compress image first
        const compressedBlob = await compressImage(file);

        // Create storage reference
        const storageRef = ref(storage, `profile-images/${userId}/profile.jpg`);

        // Upload file
        await uploadBytes(storageRef, compressedBlob);

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading profile image:', error);
        throw error;
    }
};

/**
 * Delete profile image from Firebase Storage
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const deleteProfileImage = async (userId) => {
    try {
        const storageRef = ref(storage, `profile-images/${userId}/profile.jpg`);
        await deleteObject(storageRef);
    } catch (error) {
        // Ignore error if file doesn't exist
        if (error.code !== 'storage/object-not-found') {
            console.error('Error deleting profile image:', error);
            throw error;
        }
    }
};

/**
 * Get profile image URL
 * @param {string} userId - User ID
 * @returns {Promise<string|null>} - Download URL or null if not found
 */
export const getProfileImageURL = async (userId) => {
    try {
        const storageRef = ref(storage, `profile-images/${userId}/profile.jpg`);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        if (error.code === 'storage/object-not-found') {
            return null;
        }
        console.error('Error getting profile image URL:', error);
        throw error;
    }
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateImageFile = (file) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    if (!file) {
        return { valid: false, error: 'No file selected' };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, error: 'Only JPG, PNG, and WEBP images are allowed' };
    }

    if (file.size > MAX_SIZE) {
        return { valid: false, error: 'Image must be less than 5MB' };
    }

    return { valid: true, error: null };
};
