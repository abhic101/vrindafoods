const bcrypt = require('bcrypt');

async function comparePassword(candidatePassword, passwordHash) {
    const isPasswordMatch = await bcrypt.compare(candidatePassword, passwordHash);
    return isPasswordMatch;
};

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

module.exports = {
    comparePassword,
    hashPassword
}