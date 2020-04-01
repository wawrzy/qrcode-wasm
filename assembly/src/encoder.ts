import { alphaNumericTable } from './utils/constants'
import { EncodingMode } from './utils/enums'
import { debug } from './utils/logger'
import { addToByteArray } from './utils/utils'

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

function encodeNumeric(
	buffer: Array<i32>,
	message: string,
	bufferSize: i32
): i32 {
	let currentBufferSize = bufferSize

	for (let i = 0; i < message.length; i += 3) {
		if (i + 3 > message.length) {
			const finalGroup = parseInt(message.slice(i), 10) as i32
			return addToByteArray(
				buffer,
				currentBufferSize,
				finalGroup,
				3 * finalGroup.toString().length + 1
			)
		} else {
			const group = parseInt(message.slice(i, i + 3), 10) as i32
			currentBufferSize = addToByteArray(
				buffer,
				currentBufferSize,
				group,
				3 * group.toString().length + 1
			)
		}
	}

	return currentBufferSize
}

function encodeByte(buffer: Array<i32>, message: string, bufferSize: i32): i32 {
	let currentBufferSize = bufferSize

	for (let i = 0; i < message.length; i++) {
		currentBufferSize = addToByteArray(
			buffer,
			currentBufferSize,
			message.charCodeAt(i),
			8
		)
	}

	return currentBufferSize
}

export function dataEncoding(
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
	if (encodingMode === EncodingMode.Numeric) {
		bufferSize = encodeNumeric(buffer, message, bufferSize)
	} else if (encodingMode === EncodingMode.Alphanumeric) {
		bufferSize = encodeAlphaNumeric(buffer, message, bufferSize)
	} else if (encodingMode === EncodingMode.Byte) {
		bufferSize = encodeByte(buffer, message, bufferSize)
	}

	// Add pad bits to have a multiple of 8 size
	if (bufferSize % 8 > 0) {
		bufferSize = addToByteArray(buffer, bufferSize, 0, 8 - (bufferSize % 8))
	}

	if (bufferSize / 8 !== buffer.length) {
		const remainingBytes = buffer.length - bufferSize / 8

		for (let i = 0; i < remainingBytes; i++) {
			bufferSize = addToByteArray(buffer, bufferSize, i % 2 === 0 ? 236 : 17, 8)
		}
	}

	debug('bufferSize = ' + buffer.length.toString())
}
