import fs from "fs-extra"
import { globbySync } from "globby"
import OpenCC from "opencc-js"
import path from "path"
const cjkRegex = /([\u1100-\u11ff\u2e80-\u2e99\u2e9b-\u2ef3\u2f00-\u2fd5\u2ff0-\u303f\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fd-\u30ff\u3105-\u312e\u3131-\u318e\u31a0-\u31ba\u31f0-\u321e\u3260-\u327e\u32d0-\u32fe\u3300-\u3357\u3400-\u4db5\u4e00-\u9fea\ua960-\ua97c\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufe10-\ufe1f\ufe30-\ufe6f\uff00-\uffef]|[\ud840-\ud868\ud86a-\ud86c\ud86f-\ud872\ud874-\ud879][\udc00-\udfff]|\ud82c[\udc00-\udd1e]|\ud83c[\ude00]|\ud869[\udc00-\uded6\udf00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d\udc20-\udfff]|\ud873[\udc00-\udea1\udeb0-\udfff]|\ud87a[\udc00-\udfe0]|\ud87e[\udc00-\ude1d])+/g

const dict = {
	"zh_TW": "tw",
	"zh_CN": "cn",
	"zh_HK": "hk"
}

export default async (inLanguageDirPath, outLanguageDirPath, options = {}) => {
	
	const inLanguageCode = options?.inLanguageCode ?? path.basename(inLanguageDirPath)
	const outLanguageCode = options?.outLanguageCode ?? path.basename(outLanguageDirPath)

	console.log(`Generating Chinese variant of ${outLanguageCode} from ${inLanguageCode}...`)

	if (!inLanguageCode.startsWith("zh")) throw Error("Input is not Chinese.")
	if (!outLanguageCode.startsWith("zh")) throw Error("Output is not Chinese.")

	const converter = OpenCC.Converter({ from: dict[inLanguageCode], to: dict[outLanguageCode] })

	const files = globbySync(inLanguageDirPath + "**")

	// console.log(cjkRegex.global)

	files.forEach(file => {
		fs.outputFileSync(
			file.replace(inLanguageDirPath, outLanguageDirPath),
			fs.readFileSync(file, "utf-8").replace(cjkRegex, text => {
				// console.log(text, converter(text))
				return converter(text)
			})
		)
	})

	console.log("Generation done.")

}