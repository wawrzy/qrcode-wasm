import {
	alphaNumericTable,
	characterCapacities,
	errorCorrectionCodeWords,
	UpperLimits,
} from './constants'
import { dataEncoding } from './encoder'
import { EncodingMode, ErrorLevel } from './enums'
import { debug, debugBuffer } from './logger'

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

// Minimal version = 1 / maximal = 40 / -1 Too large
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

// https://www.thonky.com/qr-code-tutorial/error-correction-table
function getRequiredCapacities(
	version: i32,
	errorCorrectionLevel: ErrorLevel
): i32 {
	const index = (version - 1) * 4 + (errorCorrectionLevel - 1)
	const codeWords = errorCorrectionCodeWords[index]

	return codeWords[1] * codeWords[2] + codeWords[3] * codeWords[4]
}

// TODO: Error management
// TODO: Automatically detect best errorCorrectionLevel
export function main(message: string, errorCorrectionLevel: ErrorLevel): i32 {
	debug('Message = ' + message)

	const encodingMode = getEncodingMode(message)
	debug('encodingMode = ' + encodingMode.toString())
	debug('errorCorrectionLevel = ' + errorCorrectionLevel.toString())

	const version = getVersion(message.length, encodingMode, errorCorrectionLevel)
	debug('version = ' + version.toString())

	const buffer = new Array<i32>(
		getRequiredCapacities(version, errorCorrectionLevel)
	).fill(0)

	debug('bufferLength = ' + buffer.length.toString())

	dataEncoding(buffer, message, encodingMode, version)

	debugBuffer(buffer)

	return buffer.length
}
