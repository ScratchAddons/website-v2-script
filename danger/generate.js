// const { danger, message, warn, fail, markdown } = require("danger");
// const { danger } = require("danger");
const { message, warn, fail, markdown, arbitrary, generateText } = require('./danger-src/emulator')
const fs = require('fs-extra')

// No PR is too small to include a description of why you made a change
arbitrary(`
if (danger.github.pr.body.length < 10) {
	warn("Please include a description of your PR changes.");
}
`)

fs.outputFileSync('dangerfile.js', generateText())