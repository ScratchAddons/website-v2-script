const lines = []

/**
 * Highlights low-priority issues, but does not fail the build. Message is shown inside a HTML table.
 * @param message the String to output
 * @param file a file which this message should be attached to
 * @param line the line which this message should be attached to
 */
export const warn = (message, file, line) => {
	lines.push(`warn(${message}, ${file}, ${line})`)
}

/**
 * Adds a message to the Danger table, the only difference between this and warn is the emoji which shows in the table.
 * @param message the String to output
 * @param file a file which this message should be attached to
 * @param line the line which this message should be attached to
 */
export const message = (message, file, line) => {
	lines.push(`message(${message}, ${file}, ${line})`)
}

/**
 * Fails a build, outputting a specific reason for failing into a HTML table.
 * @param message the String to output
 * @param file a file which this message should be attached to
 * @param line the line which this message should be attached to
 */
export const fail = (message, file, line) => {
	lines.push(`fail(${message}, ${file}, ${line})`)
}

/**
 * Adds raw markdown into the Danger comment, under the table
 * @param message the String to output
 * @param file a file which this message should be attached to
 * @param line the line which this message should be attached to
 */
export const markdown = (message, file, line) => {
	lines.push(`message(${message}, ${file}, ${line})`)
}