import {
	errorCorrectionCodeWords,
	remainingVersionBits,
} from './utils/constants';
import { debugArray } from './utils/logger';

function convertToBits(nb: i32, res: string): string {
	const quotient = Math.floor(nb / 2) as i32;

	res = (nb % 2).toString() + res;

	return quotient === 0 ? res.padStart(8, '0') : convertToBits(quotient, res);
}

/**
 * The final message is converted to 8-bit binary.
 * @param finalDecMessage
 * @param finalMessage
 */
function convertMessageToBits(
	finalDecMessage: Array<i32>,
	finalMessage: Array<i32>
): void {
	for (let i = 0; i < finalDecMessage.length; i++) {
		const strBits = convertToBits(finalDecMessage[i], '');

		for (let j = 0; j < strBits.length; j++) {
			finalMessage.push(parseInt(strBits.slice(j, j + 1), 10) as i32);
		}
	}
}

/**
 * Structure final message (and covert it to bits):
 * 	[G1B1C1, G1B2C1, G2B1C1, ..., ERC1, ERC2, ... ]
 *
 * @param finalMessage
 * @param encodedData
 * @param errorCodewords
 * @param indexErrorCorrectionCodeWords
 */
export function structureMessage(
	finalMessage: Array<i32>,
	encodedData: Array<i32>,
	errorCodewords: Array<Array<i32>>,
	indexErrorCorrectionCodeWords: i32,
	version: i32
): void {
	const errorCorrectionCodeword =
		errorCorrectionCodeWords[indexErrorCorrectionCodeWords];

	const blocksG1 = errorCorrectionCodeword[1];
	const nbCodewordsG1 = errorCorrectionCodeword[2];
	const blocksG2 = errorCorrectionCodeword[3];
	const nbCodewordsG2 = errorCorrectionCodeword[4];

	let step = 0;

	const finalDecMessage = new Array<i32>(0);

	while (finalDecMessage.length !== encodedData.length) {
		for (let i = 0; i < blocksG1 + blocksG2; i++) {
			if (i < blocksG1 && step < nbCodewordsG1) {
				finalDecMessage.push(encodedData[i * nbCodewordsG1 + step]);
			} else if (i >= blocksG1 && step < nbCodewordsG2) {
				const idxG1 = blocksG1 * nbCodewordsG1;
				finalDecMessage.push(
					encodedData[idxG1 + (i - blocksG1) * nbCodewordsG2 + step]
				);
			}
		}
		step += 1;
	}

	for (step = 0; step < errorCorrectionCodeword[0]; step++) {
		for (let i = 0; i < errorCodewords.length; i++) {
			finalDecMessage.push(errorCodewords[i][step]);
		}
	}

	debugArray(finalDecMessage, 'finalDecMessage = ');

	convertMessageToBits(finalDecMessage, finalMessage);

	// For some QR versions, the final binary message is not long enough to fill the required number of bits
	// So we fill remaing space with 0 bits
	const remaingBits = remainingVersionBits.get(version);
	for (let i = 0; i < remaingBits; i++) {
		finalMessage.push(0);
	}

	debugArray(finalMessage, 'finalMessage = ');
}
