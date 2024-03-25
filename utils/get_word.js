
async function getWord(size = 5) {
    return new Promise((resolve, reject) => {
        import('node-fetch').then(({ default: fetch }) => {
            fetch(`https://trouve-mot.fr/api/size/${size}`)
                .then((response) => response.json())
                .then((words) => {
                    console.log({words});
                    resolve(words[0]?.name)
                })
                .catch((error) => reject(error));
        });
    });
}

module.exports = { getWord };