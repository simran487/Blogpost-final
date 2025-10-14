import bcrypt from 'bcrypt';

const saltRounds = 10; // Standard value for bcrypt hashing

/**
 * Generates a secure hash for a given plaintext password.
 * @param {string} password - The user's plaintext password.
 * @returns {Promise<string>} The securely salted and hashed password string.
 */
export async function hashPassword(password) {
    if (!password) {
        throw new Error("Password cannot be empty.");
    }
    // bcrypt handles salt generation and hashing in one step
    return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plaintext password against a stored hash.
 * @param {string} password - The user's plaintext password attempt.
 * @param {string} hash - The hash stored in the database.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
 */
export async function comparePassword(password, hash) {
    // bcrypt uses the salt embedded in the hash to generate a new hash 
    // for comparison.
    return bcrypt.compare(password, hash);
}
