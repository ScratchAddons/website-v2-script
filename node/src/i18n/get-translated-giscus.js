const fs = require("fs-extra")
const chalk = require("chalk")
const axios = require("axios").default

module.exports = async (jsonPath, options = {}) => {

	const giscusi18n = await axios.get('https://raw.githubusercontent.com/giscus/giscus/main/i18n.json', {
		responseType: 'json'
	})
		.then(response => response.data)

	console.log(chalk`Adding Giscus languages...`)
	fs.outputJSONSync(jsonPath, giscusi18n.locales)

}