// const { danger, message, warn, fail, markdown } = require("danger");
// const { danger } = require("danger");
import { message, warn, fail, markdown, arbitrary, generateText } from './src/emulator.js'
import { run as getChangedFiles } from './src/changed-files.js'
import fs from 'fs-extra'

const changedFiles = await getChangedFiles()

console.log('created', changedFiles.created)
console.log('updated', changedFiles.updated)
console.log('removed', changedFiles.removed)

// No PR is too small to include a description of why you made a change
arbitrary(`
if (danger.github.pr.body.length < 10) {
	warn("Please include a description of your PR changes.");
}
`)

fs.outputFileSync('../dangerfile.js', generateText())