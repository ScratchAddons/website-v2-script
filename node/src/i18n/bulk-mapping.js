const fs = require('fs-extra')
const globby = require('globby')

module.exports = (i18nPath, orgSlug, projId) => {
	let txConfig = fs.readFileSync(`${i18nPath}.tx/config`, "utf-8")

	const resourceFiles = globby.sync([`${i18nPath}en/html-content/**`, `${i18nPath}en/markdown/**`]).map(path => path.replace(i18nPath, ''))

	console.log(resourceFiles)

	resourceFiles.forEach(path => {
		if (txConfig.search(path) + 1) console.log("Found: " + path)
		else {
			console.log("Missing: " + path)
			const resourceId = path.split('.').slice(0, -1).join('.').replace('en/', '').replace(/[^a-z0-9-_]/g, '_')
			let resourceType
			if (path.toLowerCase().endsWith('.html')) {
				resourceType = 'HTML_FRAGMENT'
			} else if (path.toLowerCase().endsWith('.md')) {
				resourceType = 'GITHUBMARKDOWN'
			}
			console.log(resourceId)
			txConfig += [
				'',
				`[o:${orgSlug}:p:${projId}:r:${resourceId}]`,
				`file_filter = ${path.replace('en/', '<lang>/')}`,
				'minimum_perc = 100',
				`source_file = ${path}`,
				'source_lang = en',
				`type = ${resourceType}`,
				''
			].join('\n')
		}
	})

	fs.outputFileSync(`${i18nPath}.tx/config`, txConfig)

}