const fs = require('fs');

class SpellChecker {
  constructor(file) {
    this.words = this.loadWords(file);
  }

  // Load words from a text file
  loadWords(file) {
    const content = fs.readFileSync(file, 'utf8');
    return content.trim().split('\n').map(word => this.removeAccents(word));
  }

  removeAccents(word) {
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Spell check function
  checkSpelling(word) {
    return this.words.includes(this.removeAccents(word).toLowerCase());
  }
}

module.exports = { SpellChecker };