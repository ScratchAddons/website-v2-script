import fs from "fs-extra"
import axios from "axios"

export default async (jsonPath, options = {}) => {

	const giscusi18n = await axios.get('https://raw.githubusercontent.com/giscus/giscus/main/i18n.js')
		.then(response => response.data)
		.then(data => JSON.parse(`{ "locales": ${data.match(/locales:\s*(\[.+?])/s)[1].replaceAll('\'', '"').replace(/,\s*?]/s, ']')}}`))

	console.log(`Adding Giscus languages...`)
	fs.outputJSONSync(jsonPath, giscusi18n.locales)

}