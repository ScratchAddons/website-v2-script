import fs from "fs-extra"
import chalk from "chalk"
import axios from "axios"

export default async (jsonPath, options = {}) => {

	const giscusi18n = await axios.get('https://raw.githubusercontent.com/giscus/giscus/main/i18n.json').then(response => response.data)

	console.log(chalk`Adding Giscus languages...`)
	fs.outputJSONSync(jsonPath, giscusi18n.locales)

}