import { debug } from './utils/logger';
import { Matrix } from './utils/matrix';

enum Direction {
	Vertical = 0,
	Horizontal = 0,
}

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

/**
 * If there are five consecutive modules of the same color, add 3 to the penalty.
 * If there are more modules of the same color after the first five, add 1
 *
 * @param matrix
 */
function computeConsecutives(matrix: Matrix, direction: Direction): i32 {
	let penalityScore = 0;

	for (let y = 0; y < matrix.matrixSize; y++) {
		let prev =
			direction === Direction.Horizontal
				? matrix.value(y, 0)
				: matrix.value(0, y);
		let count = 0;

		for (let x = 0; x < matrix.matrixSize; x++) {
			const value =
				direction === Direction.Horizontal
					? matrix.value(x, y)
					: matrix.value(y, x);

			count = prev !== value ? count : count + 1;

			if (prev !== value || x + 1 === matrix.matrixSize) {
				const toAdd = count < 5 ? 0 : count - 5 + 3;
				penalityScore += toAdd;

				count = 1;
			}

			prev = value;
		}
	}

	return penalityScore;
}

/**
 * 3 penality score for every 2x2 block of the same color in the QR code
 * @param matrix
 */
function computeSquares(matrix: Matrix): i32 {
	let penalityScore = 0;

	for (let y = 0; y < matrix.matrixSize - 1; y++) {
		for (let x = 0; x < matrix.matrixSize - 1; x++) {
			const square = [
				matrix.value(x, y),
				matrix.value(x + 1, y),
				matrix.value(x, y + 1),
				matrix.value(x + 1, y + 1),
			];

			if (square.filter((v, __, array) => v === array[0]).length === 4) {
				penalityScore += 3;
			}
		}
	}

	return penalityScore;
}

/**
 * Add 40 penality for every pattern looks like finder patterns
 * @param matrix
 * @param direction
 */
function computeSimilarFinderPatterns(
	matrix: Matrix,
	direction: Direction
): i32 {
	let penalityScore = 0;

	const pattern1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
	const pattern2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
	const pattern_length = 11;

	for (let y = 0; y < matrix.matrixSize; y++) {
		for (let x = 0; x < matrix.matrixSize - pattern_length; x++) {
			let countPattern1 = 0;
			let countPattern2 = 0;

			for (let i = 0; i < pattern_length; i++) {
				const value =
					direction === Direction.Horizontal
						? matrix.value(x + i, y)
						: matrix.value(x, y + i);

				countPattern1 =
					value === pattern1[i] ? countPattern1 + 1 : countPattern1;
				countPattern2 =
					value === pattern2[i] ? countPattern2 + 1 : countPattern2;
			}

			let toAdd = 0;
			toAdd = countPattern1 === pattern_length ? toAdd + 40 : toAdd;
			toAdd = countPattern2 === pattern_length ? toAdd + 40 : toAdd;

			penalityScore += toAdd;
		}
	}

	return penalityScore;
}

/**
 * Penality = dark modules ratio * 10
 * @param matrix
 */
function computeDarkModuleRatio(matrix: Matrix): i32 {
	let nbDark = 0;

	for (let y = 0; y < matrix.matrixSize; y++) {
		for (let x = 0; x < matrix.matrixSize; x++) {
			if (matrix.value(x, y) === 1) {
				nbDark += 1;
			}
		}
	}

	const percentDark = (nbDark / (matrix.matrixSize * matrix.matrixSize)) * 100;
	const prevMultipleFive = Math.floor(percentDark / 5) * 5;
	const nextMultipleFive = Math.ceil(percentDark / 5) * 5;

	return (
		(Math.min(
			Math.abs(prevMultipleFive - 50) / 5,
			Math.abs(nextMultipleFive - 50) / 5
		) as i32) * 10
	);
}

// https://www.thonky.com/qr-code-tutorial/data-masking
function computePenalityScore(matrix: Matrix): i32 {
	let penalityScore = 0;

	// #1
	penalityScore += computeConsecutives(matrix, Direction.Horizontal);
	penalityScore += computeConsecutives(matrix, Direction.Vertical);

	// #2
	penalityScore += computeSquares(matrix);

	// #3
	penalityScore += computeSimilarFinderPatterns(matrix, Direction.Horizontal);
	penalityScore += computeSimilarFinderPatterns(matrix, Direction.Vertical);

	// #4
	penalityScore += computeDarkModuleRatio(matrix);

	return penalityScore;
}

export function dataMasking(matrix: Matrix): void {
	const NB_MASKS = 8;
	let bestPenalityScore = Infinity;
	let bestMask = 0;

	for (let i: i8 = 0; i < NB_MASKS; i++) {
		const matrixMasked = new Matrix(
			matrix.matrixSize,
			matrix.qrCodeVersion,
			matrix
		);

		applyMask(i, matrixMasked);

		const penalityScore = computePenalityScore(matrixMasked);

		debug('Mask = ' + i.toString() + ' penality = ' + penalityScore.toString());

		if (penalityScore < bestPenalityScore) {
			bestPenalityScore = penalityScore;
			bestMask = i;
		}
	}

	debug('Best mask = ' + bestMask.toString());

	applyMask(bestMask as i8, matrix);
}
