const simpleGit = require("simple-git/promise")

const git = simpleGit("./")

git.status().then(e => console.log(e.files.length))

