import { debug, debugArray } from './utils/logger';
import { Matrix } from './utils/matrix';
import { deepCopy } from './utils/array';

// 8 type of masks
// https://www.thonky.com/qr-code-tutorial/mask-patterns
function mask(type: i8, x: i32, y: i32): i32 {
	if (type === 0) {
		return (x + y) % 2;
	} else if (type === 1) {
		return y % 2;
	} else if (type === 2) {
		return x % 3;
	} else if (type === 3) {
		return (x + y) % 3;
	} else if (type === 4) {
		return (((Math.floor(y / 2) as i32) + Math.floor(x / 3)) as i32) % 2;
	} else if (type === 5) {
		return ((x * y) % 2) + ((x * y) % 3);
	} else if (type === 6) {
		return (((x * y) % 2) + ((x * y) % 3)) % 2;
	}

	return (((y + x) % 2) + ((y * x) % 3)) % 2;
}

function applyMask(maskType: i8, matrix: Matrix): void {
	for (let y = 0; y < matrix.matrixSize; y++) {
		for (let x = 0; x < matrix.matrixSize; x++) {
			if (!matrix.isReserved(x, y) && mask(maskType, x, y) === 0) {
				matrix.swap(x, y);
			}
		}
	}
}

// https://www.thonky.com/qr-code-tutorial/data-masking
function computePenalityScore(matrix: Matrix): i32 {
	const penalityScore = 0;

	// #1
	// #2
	// #3
	// #4

	return penalityScore;
}

export function dataMasking(matrix: Matrix): void {
	const NB_MASKS = 8;
	const penalityScores = new Array<i32>();

	for (let i: i8 = 0; i < NB_MASKS; i++) {
		const matrixMasked = new Matrix(
			matrix.matrixSize,
			matrix.qrCodeVersion,
			matrix
		);

		applyMask(i, matrixMasked);

		penalityScores.push(computePenalityScore(matrixMasked));
	}

	debugArray(penalityScores, 'Penality scores = ');
}
