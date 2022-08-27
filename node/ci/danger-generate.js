// const { danger, message, warn, fail, markdown } = require("danger");
// const { danger } = require("danger");
import { message, warn, fail, markdown, arbitrary, generateText } from '../src/danger/emulator.js'
import { run as getChangedFiles } from '../src/danger/changed-files.js'
import fs from 'fs-extra'
import { matcher } from 'matcher'
import { context } from "@actions/github"

const changedFiles = await getChangedFiles()

// No PR is too small to include a description of why you made a change
if (!(context.payload.pull_request.body && context.payload.pull_request.body.length > 10)) {
	warn("Please include a description of your changes on the PR body.")
}

// Attention required on privacy policy edits
if (matcher(changedFiles.changed, ['content/docs/policies/privacy/**']).length > 0) {
	warn("Changes made on the privacy policy. Further review by @ WorldLanguages is needed.")
}

fs.outputFileSync('../dangerfile.js', generateText())