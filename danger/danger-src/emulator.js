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
	lines.push(`warn(${stringToArgument(message)}, ${stringToArgument(file)}, ${stringToArgument(line)})`)
}

/**
 * Adds a message to the Danger table, the only difference between this and warn is the emoji which shows in the table.
 * @param message the String to output
 * @param file a file which this message should be attached to
 * @param line the line which this message should be attached to
 */
export const message = (message, file, line) => {
	lines.push(`message(${stringToArgument(message)}, ${stringToArgument(file)}, ${stringToArgument(line)})`)
}

/**
 * Fails a build, outputting a specific reason for failing into a HTML table.
 * @param message the String to output
 * @param file a file which this message should be attached to
 * @param line the line which this message should be attached to
 */
export const fail = (message, file, line) => {
	lines.push(`fail(${stringToArgument(message)}, ${stringToArgument(file)}, ${stringToArgument(line)})`)
}

/**
 * Adds raw markdown into the Danger comment, under the table
 * @param message the String to output
 * @param file a file which this message should be attached to
 * @param line the line which this message should be attached to
 */
export const markdown = (message, file, line) => {
	lines.push(`message(${stringToArgument(message)}, ${stringToArgument(file)}, ${stringToArgument(line)})`)
}

/**
 * Adds aribitrary code to run on the Dangerfile
 * @param {string} arbitrary Arbitrary code to run
 */
export const arbitrary = (arbitrary) => {
	lines.push(arbitrary)
}

/**
 * Generates a text to be saved as dangerfile.js
 * @returns dangerfile.js file
 */
export const generateText = () => {
	return `const { danger, message, warn, fail, markdown } = require("danger");
${lines.join('\n')}`
}

