import fs from "fs/promises"
import simpleGit from "simple-git"

const git = simpleGit("./")

export default async (commitMessage, gitEmail, gitName) => {

	if ((await git.status()).files.length === 0) {
		console.log("No files changed. Skipping.")
		fs.writeFile(process.env.GITHUB_OUTPUT, 'has_new_commit=false')
		return
	}

	fs.writeFile(process.env.GITHUB_OUTPUT, 'has_new_commit=true')
	
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
