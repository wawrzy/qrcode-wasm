import { alphaNumericTable } from './utils/constants';
import { EncodingMode } from './utils/enums';
import { debug } from './utils/logger';
import { Buffer } from './utils/buffer';

/**
 * Add mode indicator according to encdoding mode
 * @param buffer
 * @param encodingMode
 */
function setModeIndicator(
	buffer: Buffer<i32>,
	encodingMode: EncodingMode
): void {
	const modeIndicators = [0b0001, 0b0010, 0b0100]; // [Numeric, Alpha num, Byte]

	buffer.push(modeIndicators[encodingMode - 1], 4);
}

function setCharacterCountIndicator(
	buffer: Buffer<i32>,
	messageLength: i32,
	encodingMode: EncodingMode,
	version: i32
): void {
	if (version <= 9) {
		const countIndicatorSizes = [10, 9, 8];

		buffer.push(messageLength, countIndicatorSizes[encodingMode - 1]);
	} else if (version <= 26) {
		const countIndicatorSizes = [12, 11, 16];

		buffer.push(messageLength, countIndicatorSizes[encodingMode - 1]);
	} else {
		const countIndicatorSizes = [14, 13, 16];

		buffer.push(messageLength, countIndicatorSizes[encodingMode - 1]);
	}
}

// https://www.thonky.com/qr-code-tutorial/alphanumeric-mode-encoding
function encodeAlphaNumeric(buffer: Buffer<i32>, message: string): void {
	for (let i = 0; i < message.length; i += 2) {
		if (i + 1 === message.length) {
			const value = alphaNumericTable.get(message.charCodeAt(i));

			buffer.push(value, 6);
		} else {
			const value =
				alphaNumericTable.get(message.charCodeAt(i)) * 45 +
				alphaNumericTable.get(message.charCodeAt(i + 1));

			buffer.push(value, 11);
		}
	}
}

function encodeNumeric(buffer: Buffer<i32>, message: string): void {
	for (let i = 0; i < message.length; i += 3) {
		if (i + 3 > message.length) {
			const finalGroup = parseInt(message.slice(i), 10) as i32;

			buffer.push(finalGroup, 3 * finalGroup.toString().length + 1);
		} else {
			const group = parseInt(message.slice(i, i + 3), 10) as i32;

			buffer.push(group, 3 * group.toString().length + 1);
		}
	}
}

function encodeByte(buffer: Buffer<i32>, message: string): void {
	for (let i = 0; i < message.length; i++) {
		buffer.push(message.charCodeAt(i), 8);
	}
}

export function dataEncoding(
	buffer: Buffer<i32>,
	message: string,
	encodingMode: EncodingMode,
	version: i32
): void {
	setModeIndicator(buffer, encodingMode);

	setCharacterCountIndicator(buffer, message.length, encodingMode, version);

	if (encodingMode === EncodingMode.Numeric) {
		encodeNumeric(buffer, message);
	} else if (encodingMode === EncodingMode.Alphanumeric) {
		encodeAlphaNumeric(buffer, message);
	} else if (encodingMode === EncodingMode.Byte) {
		encodeByte(buffer, message);
	}

	// Add pad bits to have a multiple of 8 size
	if (buffer.size % 8 > 0) {
		buffer.push(0, 8 - (buffer.size % 8));
	}

	// Fill remaining space with following bytes: 236, 17
	if (buffer.size / 8 !== buffer.current.length) {
		const remainingBytes = buffer.current.length - buffer.size / 8;

		for (let i = 0; i < remainingBytes; i++) {
			buffer.push(i % 2 === 0 ? 236 : 17, 8);
		}
	}

	debug('bufferSize = ' + buffer.size.toString());
}
