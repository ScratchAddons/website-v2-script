import { globbySync } from "globby"
import chalkT from 'chalk-template';
import chalk from "chalk"
import fs from "fs-extra"

export default (folderPath, globPatterns) => {
	const filesToRemove = globbySync(globPatterns.map(pattern => {
		if (pattern.startsWith("!"))
			return "!" + folderPath + pattern.slice("1")
		return folderPath + pattern
	}))
	console.log(filesToRemove)
	filesToRemove.forEach(file => {
		console.log(chalkT`Removing {inverse ${file}}...`)
		fs.removeSync(file)
	})
}