import { DEBUG } from './config'
import { alphaNumericTable, characterCapacities } from './constants'

@inline
function info(msg: string): void {
	if (DEBUG() === 1) {
		trace(msg)
	}
}

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
			encodingMode = EncodingMode.Alphanumeric
		}
		if (!alphaNumericTable.has(charCode)) {
			return EncodingMode.Byte
		}
	}

	return message.length === 0 ? EncodingMode.Invalid : encodingMode
}

// Minimal version = 1 / maximal = 40
function getVersion(
	msgLength: i32,
	encodingMode: EncodingMode,
	errorCorrectionLevel: ErrorLevel
): i8 {
	const errorIdx = errorCorrectionLevel - 1
	const encodingIdx = encodingMode - 1

	for (let i = 0; i < characterCapacities.length; i++) {
		const size = characterCapacities[i][errorIdx][encodingIdx]

		if (msgLength <= size) {
			return (i + 1) as i8
		}
	}

	return -1
}

export function main(message: string, errorCorrectionLevel: ErrorLevel): i32 {
	info('Message = ' + message)

	const encodingMode = getEncodingMode(message)
	info('encodingMode = ' + encodingMode.toString())
	info('errorCorrectionLevel = ' + errorCorrectionLevel.toString())

	const version = getVersion(message.length, encodingMode, errorCorrectionLevel)
	info('version = ' + version.toString())

	return 1
}
