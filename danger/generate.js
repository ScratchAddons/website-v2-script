// const { danger, message, warn, fail, markdown } = require("danger");
// const { danger } = require("danger");
import { message, warn, fail, markdown, arbitrary, generateText } from './danger-src/emulator.js'
import fs from 'fs-extra'

// No PR is too small to include a description of why you made a change
arbitrary(`
if (danger.github.pr.body.length < 10) {
	warn("Please include a description of your PR changes.");
}
`)

fs.outputFileSync('dangerfile.js', generateText())