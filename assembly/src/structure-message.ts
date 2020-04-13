import { errorCorrectionCodeWords } from './utils/constants';
import { debugArray } from './utils/logger';

/**
 * Structure final message:
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
	indexErrorCorrectionCodeWords: i32
): void {
	const errorCorrectionCodeword =
		errorCorrectionCodeWords[indexErrorCorrectionCodeWords];

	const blocksG1 = errorCorrectionCodeword[1];
	const nbCodewordsG1 = errorCorrectionCodeword[2];
	const blocksG2 = errorCorrectionCodeword[3];
	const nbCodewordsG2 = errorCorrectionCodeword[4];

	let step = 0;

	while (finalMessage.length !== encodedData.length) {
		for (let i = 0; i < blocksG1 + blocksG2; i++) {
			if (i < blocksG1 && step < nbCodewordsG1) {
				finalMessage.push(encodedData[i * nbCodewordsG1 + step]);
			} else if (i >= blocksG1 && step < nbCodewordsG2) {
				const idxG1 = blocksG1 * nbCodewordsG1;
				finalMessage.push(
					encodedData[idxG1 + (i - blocksG1) * nbCodewordsG2 + step]
				);
			}
		}
		step += 1;
	}

	for (step = 0; step < errorCorrectionCodeword[0]; step++) {
		for (let i = 0; i < errorCodewords.length; i++) {
			finalMessage.push(errorCodewords[i][step]);
		}
	}

	debugArray(finalMessage, 'finalMessage = ');
}
