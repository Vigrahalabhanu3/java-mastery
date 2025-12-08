// Admin email configuration
// Add or remove email addresses that should have admin access

const ADMIN_EMAILS = [
    'banuvigrahala@gmail.com'
];

/**
 * Check if an email address has admin privileges
 * @param {string} email - The email address to check
 * @returns {boolean} - True if the email is an admin, false otherwise
 */
export const isAdminEmail = (email) => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

export default ADMIN_EMAILS;
