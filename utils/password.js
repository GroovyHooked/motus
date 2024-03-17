const bcrypt = require('bcrypt');
const saltRounds = 10; // Nombre de tours de salage

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw new Error('Erreur lors du hachage du mot de passe');
    }
};

async function comparePassword(password, hashedPassword) {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Erreur lors de la comparaison du mot de passe');
    }
};

module.exports = { hashPassword, comparePassword };