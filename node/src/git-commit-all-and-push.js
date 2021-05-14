const simpleGit = require("simple-git").default

const git = simpleGit("./")

module.exports = (commitMessage, gitEmail, gitName) => {

	if (git.status().files.length === 0) {
		console.log("No files changed. Skipping.")
		console.log("::set-output name=commitSkipped::true")
		return
	}

	console.log("::set-output name=commitSkipped::false")
	
	console.log("Commiting all files...")
	console.log(`user: ${gitName} <${gitEmail}>`)
	console.log(`message: ${commitMessage}`)
	git.addConfig("user.email", gitEmail)
	git.addConfig("user.name", gitName)
	git.add(".")
	git.commit(commitMessage)

	console.log("Pushing...")
	git.push("origin", "master")

	console.log("Done!")
}