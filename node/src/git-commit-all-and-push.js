const simpleGit = require("simple-git").default

const git = simpleGit("./")

module.exports = async (commitMessage, gitEmail, gitName) => {

	if (await git.status().files.length === 0) {
		console.log("No files changed. Skipping.")
		console.log("::set-output name=commitSkipped::true")
		return
	}

	console.log("::set-output name=commitSkipped::false")
	
	console.log("Commiting all files...")
	console.log(`user: ${gitName} <${gitEmail}>`)
	console.log(`message: ${commitMessage}`)
	await git.addConfig("user.email", gitEmail)
	await git.addConfig("user.name", gitName)
	await git.add(".")
	await git.commit(commitMessage)

	console.log("Pushing...")
	await git.push("origin", "master")

	console.log("Done!")
}