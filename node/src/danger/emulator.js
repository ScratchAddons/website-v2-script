const lines = []
const stringToArgument = arg => {
	if (typeof arg === "string") {
		return `\`${arg}\``
	} else return arg
}

/**
 * Highlights low-priority issues, but does not fail the build. Message is shown inside a HTML table.
 * @param message the String to output
 * @param file a file which this message should be attached to
 * @param line the line which this message should be attached to
 */
export const warn = (message, file, line) => {
	addDangerCodeLine('warn', message, file, line)
}

/**
 * Adds a message to the Danger table, the only difference between this and warn is the emoji which shows in the table.
 * @param message the String to output
 * @param file a file which this message should be attached to
 * @param line the line which this message should be attached to
 */
export const message = (message, file, line) => {
	addDangerCodeLine('message', message, file, line)
}

/**
 * Fails a build, outputting a specific reason for failing into a HTML table.
 * @param message the String to output
 * @param file a file which this message should be attached to
 * @param line the line which this message should be attached to
 */
export const fail = (message, file, line) => {
	addDangerCodeLine('fail', message, file, line)
}

/**
 * Adds raw markdown into the Danger comment, under the table
 * @param message the String to output
 * @param file a file which this message should be attached to
 * @param line the line which this message should be attached to
 */
export const markdown = (message, file, line) => {
	addDangerCodeLine('markdown', message, file, line)
}

/**
 * Adds a function.
 * @param {string} name Name of the function.
 * @param  {...any} args Arguments of the function.
 * @returns 
 */
const addDangerCodeLine = (name, ...args) => {
	while (args[args.length - 1] === undefined) {
		args.pop()
	}
	addLine(`${name}(${args.map(el => stringToArgument(el)).join(', ')})`)
}

/**
 * Adds aribitrary code to run on the Dangerfile.
 * @param {string} arbitrary Arbitrary code to run.
 */
export const arbitrary = (arbitrary) => {
	addLine(arbitrary)
}

/**
 * Adds a line to the dangerfile.js
 * @param {string} line A code line to add.
 */
const addLine = (line) => {
	lines.push(line)
}

/**
 * Generates a text of the dangerfile.js
 * @returns dangerfile.js file
 */
export const generateText = () => {
	return `const { danger, message, warn, fail, markdown } = require("danger");
${lines.join('\n')}`
}

