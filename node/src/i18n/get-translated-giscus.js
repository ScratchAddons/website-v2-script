import fs from "fs-extra"
import chalk from 'chalk-template';
import axios from "axios"

export default async (jsonPath, options = {}) => {

	const giscusi18n = await axios.get('https://raw.githubusercontent.com/giscus/giscus/main/i18n.js')
		.then(response => response.data)
		.then(data => JSON.parse(`{ "locales": ${data.match(/locales:\s*(\[.+?])/s)[1].replaceAll('\'', '"').replace(/,\s*?]/s, ']')}}`))

	console.log(chalk`Adding Giscus languages...`)
	fs.outputJSONSync(jsonPath, giscusi18n.locales)

}