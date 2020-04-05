import {
	errorCorrectionCodeWords,
	generatorsPolynomial,
	antilogs,
} from './utils/constants'
import { debugArray, debug } from './utils/logger'

function sumAlpha(res: Array<i32>, val: Array<i32>): void {
	for (let i = 0; i < res.length; i++) {
		res[i] = (res[i] + val[i]) % 255
	}
}

function xor(res: Array<i32>, val: Array<i32>): void {
	for (let i = 0; i < Math.max(res.length, val.length); i++) {
		res[i] = (i >= res.length ? 0 : res[i]) ^ (i >= val.length ? 0 : val[i])
	}
}

function getAlphaFromInteger(val: i32): i32 {
	for (let i = 0; i < antilogs.length; i++) {
		if (antilogs[i] === val) {
			return i
		}
	}

	// Should never append
	return -1
}

function convertAlphaToInteger(array: Array<i32>): void {
	for (let i = 0; i < array.length; i++) {
		array[i] = antilogs[array[i]]
	}
}

function divisions(
	dataCodewords: Array<i32>,
	generatorPolynomial: Array<i32>,
	errorCodewords: Array<Array<i32>>
): void {
	debugArray(dataCodewords, 'dataCodewords = ')

	const steps = dataCodewords.length
	debug('nb steps = ' + steps.toString())

	const prevResult = new Array<i32>(0).concat(dataCodewords)

	debugArray(prevResult, 'start prevResult = ')
	for (let i = 0; i < steps; i++) {
		debug('Step = ' + (i + 1).toString())
		const tmpGenerator = new Array<i32>(0).concat(generatorPolynomial)

		sumAlpha(
			tmpGenerator,
			new Array<i32>(tmpGenerator.length).fill(
				getAlphaFromInteger(prevResult[0])
			)
		)
		debugArray(tmpGenerator, 'Sum alpha result  = ')

		convertAlphaToInteger(tmpGenerator)

		debugArray(tmpGenerator, 'tmpGenerator after convert to integer  = ')
		debugArray(prevResult, 'prevResult before xor  = ')

		xor(prevResult, tmpGenerator)

		debugArray(prevResult, 'prevResult after xor  = ')

		//  Discard lead terms 0
		while (prevResult[0] === 0) {
			prevResult.shift()
		}

		debugArray(prevResult, 'prevResult after shifting = ')
	}

	errorCodewords.push(prevResult)
}

export function generateErrorCodewords(
	encodedData: Array<i32>,
	errorCodewords: Array<Array<i32>>,
	indexErrorCorrectionCodeWords: i32
): void {
	const errorCorrectionCodeword =
		errorCorrectionCodeWords[indexErrorCorrectionCodeWords]

	const blocksG1 = errorCorrectionCodeword[1]
	const nbCodewordsG1 = errorCorrectionCodeword[2]
	const blocksG2 = errorCorrectionCodeword[3]
	const nbCodewordsG2 = errorCorrectionCodeword[4]

	const generatorPolynomial = generatorsPolynomial.get(
		errorCorrectionCodeword[0]
	)

	// Divisons on G1
	for (let i = 0; i < blocksG1; i += 1) {
		const tmp = encodedData.slice(
			i * nbCodewordsG1,
			i * nbCodewordsG1 + nbCodewordsG1
		)

		divisions(tmp, generatorPolynomial, errorCodewords)
	}

	// Divisons on G2
	const indexG1 = blocksG1 * nbCodewordsG1
	for (let i = 0; i < blocksG2; i += 1) {
		const tmp = encodedData.slice(
			i * nbCodewordsG2 + indexG1,
			i * nbCodewordsG2 + indexG1 + nbCodewordsG2
		)
		divisions(tmp, generatorPolynomial, errorCodewords)
	}

	// DEBUG
	errorCodewords.forEach((errorCodeword, index) => {
		debugArray(errorCodeword, 'Error codeword ' + index.toString() + ' : ')
	})
}
