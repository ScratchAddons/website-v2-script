const { danger, message, warn, fail, markdown } = require("danger");
// const { danger } = require("danger");
// import { message, warn, fail, markdown } from './danger-src/emulator'

// No PR is too small to include a description of why you made a change
if (danger.github.pr.body.length < 10) {
	warn("Please include a description of your PR changes.");
}
