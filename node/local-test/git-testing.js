const simpleGit = require("simple-git").default

const git = simpleGit("./")

;(async () => {
	console.log((await git.branch()).current)
	const lastBranch = (await git.branch()).current
	await git.checkout("v1.9.0")
	console.log((await git.branch()).current)
	await git.checkout(lastBranch)
	console.log((await git.branch()).current)
})()