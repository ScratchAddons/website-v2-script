// const { danger, message, warn, fail, markdown } = require("danger");
// const { danger } = require("danger");
import { message, warn, fail, markdown, arbitrary, generateText } from './src/emulator.js'
import { run as getChangedFiles } from './src/changed-files.js'
import fs from 'fs-extra'
import { matcher } from 'matcher'

const changedFiles = await getChangedFiles()

// No PR is too small to include a description of why you made a change
arbitrary(`
if (danger.github.pr.body.length < 10) {
	warn("Please include a description of your changes on the PR body.");
}
`)

if (matcher(changedFiles.changed, ['docs/policies/privacy/**'])) {
	warn("There are changes on the Privacy Policy. Further review by @ WorldLanguages is required.")
}

fs.outputFileSync('../dangerfile.js', generateText())