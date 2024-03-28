const fetch = require('node-fetch');

async function getWord(size = 5) {
    return new Promise((resolve, reject) => {
        fetch(`https://trouve-mot.fr/api/size/${size}`)
            .then((response) => response.json())
            .then((words) => {
                resolve(words[0]?.name)
            })
            .catch((error) => reject(error));
    });
}

module.exports = { getWord };