import {
	alphaNumericTable,
	characterCapacities,
	UpperLimits,
} from './constants'
import { debug, debugBuffer } from './logger'
import { addToByteArray } from './utils'

enum EncodingMode {
	Numeric = 1, // Numeric mode
	Alphanumeric = 2, // Alphanumeric mode
	Byte = 3, // Byte mode
	Invalid = -1, // Invalid
	// Kanji not yet supported
}

enum ErrorLevel {
	L = 1, // 7% recovers
	M = 2, // 15% recovers
	Q = 3, // 25% recovers
	H = 4, // 30% recovers
}

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

// FIXME: Get correct value from https://www.thonky.com/qr-code-tutorial/error-correction-table
function getRequiredCapacities(
	version: i32,
	encodingMode: EncodingMode,
	errorCorrectionLevel: ErrorLevel
): i32 {
	const errorIdx = errorCorrectionLevel - 1
	const encodingIdx = encodingMode - 1
	const versionIds = version - 1

	return characterCapacities[versionIds][errorIdx][encodingIdx]
}

function setModeIndicator(buffer: Array<i32>, encodingMode: EncodingMode): i32 {
	const modeIndicators = [0b0001, 0b0010, 0b0100]

	return addToByteArray(buffer, 0, modeIndicators[encodingMode - 1], 4)
}

function setCharacterCountIndicator(
	buffer: Array<i32>,
	messageLength: i32,
	encodingMode: EncodingMode,
	version: i32,
	bufferSize: i32
): i32 {
	if (version <= 9) {
		const countIndicatorSizes = [10, 9, 8]

		return addToByteArray(
			buffer,
			bufferSize,
			messageLength,
			countIndicatorSizes[encodingMode - 1]
		)
	} else if (version <= 26) {
		const countIndicatorSizes = [12, 11, 16]

		return addToByteArray(
			buffer,
			bufferSize,
			messageLength,
			countIndicatorSizes[encodingMode - 1]
		)
	} else {
		const countIndicatorSizes = [14, 13, 16]

		return addToByteArray(
			buffer,
			bufferSize,
			messageLength,
			countIndicatorSizes[encodingMode - 1]
		)
	}
}

// https://www.thonky.com/qr-code-tutorial/alphanumeric-mode-encoding
function encodeAlphaNumeric(
	buffer: Array<i32>,
	message: string,
	bufferSize: i32
): i32 {
	let currentBufferSize = bufferSize

	for (let i = 0; i < message.length; i += 2) {
		if (i + 1 === message.length) {
			const value = alphaNumericTable.get(message.charCodeAt(i))
			return addToByteArray(buffer, currentBufferSize, value, 6)
		} else {
			const value =
				alphaNumericTable.get(message.charCodeAt(i)) * 45 +
				alphaNumericTable.get(message.charCodeAt(i + 1))
			currentBufferSize = addToByteArray(buffer, currentBufferSize, value, 11)
		}
	}

	return currentBufferSize
}

function dataEncoding(
	buffer: Array<i32>,
	message: string,
	encodingMode: EncodingMode,
	version: i32
): void {
	let bufferSize = setModeIndicator(buffer, encodingMode)

	bufferSize = setCharacterCountIndicator(
		buffer,
		message.length,
		encodingMode,
		version,
		bufferSize
	)

	// TODO: Add other encoding mode
	bufferSize = encodeAlphaNumeric(buffer, message, bufferSize)

	// Add pad bits to have a multiple of 8 size
	if (bufferSize % 8 > 0) {
		bufferSize = addToByteArray(buffer, bufferSize, 0, 8 - (bufferSize % 8))
	}

	// TODO: Fill remaining space with [236, 17]
	debug('bufferSize = ' + bufferSize.toString())
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
		getRequiredCapacities(version, encodingMode, errorCorrectionLevel)
	).fill(0)

	dataEncoding(buffer, message, encodingMode, version)

	debugBuffer(buffer)

	return buffer.length
}
