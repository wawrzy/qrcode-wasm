import { DEBUG } from './config'
import {
	alphaNumericTable,
	characterCapacities,
	UpperLimits,
} from './constants'

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

@inline
function info(msg: string): void {
	if (DEBUG() === 1) {
		trace(msg)
	}
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

function getVersionCapacities(
	version: i32,
	encodingMode: EncodingMode,
	errorCorrectionLevel: ErrorLevel
): i32 {
	const errorIdx = errorCorrectionLevel - 1
	const encodingIdx = encodingMode - 1
	const versionIds = version - 1

	return characterCapacities[versionIds][errorIdx][encodingIdx]
}

// 🧠🧠🧠
function addToByteArray(
	array: Array<i32>, // buffer
	currentSize: i32, // number of bits allocated in buffer
	value: i32, // value to add
	length: i32 // bits size of value (maximum 8)
): i32 {
	const arrIndex = Math.floor(currentSize / 8) as i32
	const availableBits = 8 - (currentSize % 8)
	let valueToAdd = value

	if (length > availableBits) {
		valueToAdd = valueToAdd >> (length - availableBits)
		array[arrIndex] = array[arrIndex] | valueToAdd
	} else {
		valueToAdd = (valueToAdd << (8 - length)) >> (8 - availableBits)
		array[arrIndex] = array[arrIndex] | valueToAdd
	}

	if (length > availableBits) {
		array[arrIndex + 1] = value << (8 - length)

		const toShift = 8 - (length - availableBits)
		const mask = ((0b11111111 >> toShift) << toShift) >> availableBits

		array[arrIndex + 1] &= mask
		array[arrIndex + 1] <<= availableBits
	}

	return currentSize + length
}

export function main(message: string, errorCorrectionLevel: ErrorLevel): i32 {
	info('Message = ' + message)

	const encodingMode = getEncodingMode(message)
	info('encodingMode = ' + encodingMode.toString())
	info('errorCorrectionLevel = ' + errorCorrectionLevel.toString())

	const version = getVersion(message.length, encodingMode, errorCorrectionLevel)
	info('version = ' + version.toString())

	const buffer = new Array<i32>(
		getVersionCapacities(version, encodingMode, errorCorrectionLevel)
	).fill(0)

	// Testing
	addToByteArray(buffer, 0, 0b0001, 4)

	return buffer.length
}
