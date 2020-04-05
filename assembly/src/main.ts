import {
	alphaNumericTable,
	characterCapacities,
	errorCorrectionCodeWords,
} from './utils/constants'
import { dataEncoding } from './encoder'
import { EncodingMode, ErrorLevel, UpperLimits } from './utils/enums'
import { debug, debugBuffer } from './utils/logger'
import { generateErrorCodewords } from './error-correction'
import { structureMessage } from './structure-message'

/**
 * Get best encoding mode of the message according to char code values and message length
 * @param message
 */
function getEncodingMode(message: string): EncodingMode {
	let encodingMode: i32 = EncodingMode.Numeric

	for (let i = 0; i < message.length; i++) {
		const charCode = message.charCodeAt(i)

		if (charCode < 48 || charCode > 57) {
			if (message.length <= UpperLimits.Alphanumeric) {
				encodingMode = EncodingMode.Alphanumeric
			} else {
				return message.length > UpperLimits.Byte
					? EncodingMode.Invalid
					: EncodingMode.Byte
			}
		}

		if (!alphaNumericTable.has(charCode)) {
			return message.length > UpperLimits.Byte
				? EncodingMode.Invalid
				: EncodingMode.Byte
		}
	}

	if (
		encodingMode === EncodingMode.Numeric &&
		message.length > UpperLimits.Numeric
	) {
		return message.length > UpperLimits.Byte
			? EncodingMode.Invalid
			: EncodingMode.Byte
	}

	return encodingMode
}

/**
 * Get best qr code version according to: message length, encoding mode and error correction level
 * Minimal version = 1 / maximal = 40 / -1 Too large
 * @param msgLength
 * @param encodingMode
 * @param errorCorrectionLevel
 */
function getVersion(
	msgLength: i32,
	encodingMode: EncodingMode,
	errorCorrectionLevel: ErrorLevel
): i32 {
	const errorIdx = errorCorrectionLevel - 1
	const encodingIdx = encodingMode - 1

	for (let i = 0; i < characterCapacities.length; i++) {
		const size = characterCapacities[i][errorIdx][encodingIdx]

		if (msgLength <= size) {
			return i + 1
		}
	}

	return -1
}

/**
 * Get errorCorrectionCodeWords array index according to version and error correction level
 * @param version
 * @param errorCorrectionLevel
 */
function getIndexErrorCorrectionCodeWords(
	version: i32,
	errorCorrectionLevel: ErrorLevel
): i32 {
	return (version - 1) * 4 + (errorCorrectionLevel - 1)
}

/**
 * Get required capacities for encoded data (in bytes)
 * Reference: https://www.thonky.com/qr-code-tutorial/error-correction-table
 * @param version
 * @param errorCorrectionLevel
 */
function getRequiredCapacities(
	version: i32,
	errorCorrectionLevel: ErrorLevel
): i32 {
	const codeWords =
		errorCorrectionCodeWords[
			getIndexErrorCorrectionCodeWords(version, errorCorrectionLevel)
		]

	return codeWords[1] * codeWords[2] + codeWords[3] * codeWords[4]
}

// TODO: Error management
// TODO: Automatically detect best errorCorrectionLevel
export function main(message: string, errorCorrectionLevel: ErrorLevel): i32 {
	debug('Message = ' + message)

	// Initialization

	const encodingMode = getEncodingMode(message)
	debug('encodingMode = ' + encodingMode.toString())
	debug('errorCorrectionLevel = ' + errorCorrectionLevel.toString())

	const version = getVersion(message.length, encodingMode, errorCorrectionLevel)
	debug('version = ' + version.toString())

	// Encoding

	const encodedData = new Array<i32>(
		getRequiredCapacities(version, errorCorrectionLevel)
	).fill(0)

	debug('encodedDataLength = ' + encodedData.length.toString())

	dataEncoding(encodedData, message, encodingMode, version)
	debugBuffer(encodedData)

	// Error correction

	const errorCodewords = new Array<Array<i32>>(0)

	generateErrorCodewords(
		encodedData,
		errorCodewords,
		getIndexErrorCorrectionCodeWords(version, errorCorrectionLevel)
	)

	// Structure final message (merge encoded data and error correction codewords)

	const finalMessage = new Array<i32>(0)

	structureMessage(
		finalMessage,
		encodedData,
		errorCodewords,
		getIndexErrorCorrectionCodeWords(version, errorCorrectionLevel)
	)

	return encodedData.length
}
