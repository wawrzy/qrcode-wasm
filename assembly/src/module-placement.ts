// import { Buffer } from './utils/buffer'
import { alignPatterns } from './utils/constants';
import { debug } from './utils/logger';
import { Matrix } from './utils/matrix';

function setFinderPatterns(matrix: Matrix): void {
	const fp1 = [0, 0];
	const fp2 = [(matrix.qrCodeVersion - 1) * 4 + 21 - 7, 0];
	const fp3 = [0, (matrix.qrCodeVersion - 1) * 4 + 21 - 7];

	// [Top-Left, Top-Right, Bottom-Left]
	const finderPatterns = [fp1, fp2, fp3];

	for (let i = 0; i < finderPatterns.length; i++) {
		const fp = finderPatterns[i];

		matrix.drawSquare(fp[0], fp[1], 7, 1, 1);
		// Additonaly we add separator around finder pattern
		matrix.drawSquare(fp[0] - 1, fp[1] - 1, 9, 0, 1);

		matrix.drawSquare(fp[0] + 2, fp[1] + 2, 3, 1, 1);
		matrix.put(fp[0] + 3, fp[1] + 3, 1, 1);
	}
}

function setAlignPatterns(matrix: Matrix): void {
	const positions = alignPatterns.get(matrix.qrCodeVersion);

	for (let i = 0; i < positions.length; i++) {
		for (let j = 0; j < positions.length; j++) {
			const x = positions[i] - 2;
			const y = positions[j] - 2;

			debug('(' + x.toString() + ', ' + y.toString() + ')');

			if (!matrix.squareOverlap(x, y, 5)) {
				matrix.drawSquare(x, y, 5, 1, 1);
				matrix.put(x + 2, y + 2, 1, 1);
			}
		}
	}
}

function setTimingPatterns(matrix: Matrix): void {
	for (let i = 6; i < matrix.matrixSize; i++) {
		matrix.put(i, 6, (i + 1) % 2, 1);
		matrix.put(6, i, (i + 1) % 2, 1);
	}
}

function setDarkModule(matrix: Matrix): void {
	matrix.put(8, 4 * matrix.qrCodeVersion + 9, 1, 1);
}

function setReservedFormatArea(matrix: Matrix): void {
	// Near top-left separator
	matrix.drawSquare(-2, -2, 11, 0, 1);
	// Near right side bottom-left separator
	matrix.drawSquare(matrix.matrixSize - 8, -2, 11, 0, 1);
	// Near bottom top-right separator
	matrix.drawSquare(-2, matrix.matrixSize - 8, 11, 0, 1);
}

function setReservedVersionArea(matrix: Matrix): void {
	// Rect 3*6 on top of bottom left separator
	matrix.drawSquare(0, matrix.matrixSize - 11, 3, 0, 1);
	matrix.put(1, matrix.matrixSize - 10, 0, 1);
	matrix.drawSquare(3, matrix.matrixSize - 11, 3, 0, 1);
	matrix.put(4, matrix.matrixSize - 10, 0, 1);

	// Rect 3*6 on left of top right separator
	matrix.drawSquare(matrix.matrixSize - 11, 0, 3, 0, 1);
	matrix.put(matrix.matrixSize - 10, 1, 0, 1);
	matrix.drawSquare(matrix.matrixSize - 11, 3, 3, 0, 1);
	matrix.put(matrix.matrixSize - 10, 4, 0, 1);
}

export function modulePlacement(matrix: Matrix): void {
	debug(matrix.qrCodeVersion.toString());

	setFinderPatterns(matrix);

	if (matrix.qrCodeVersion > 1) {
		setAlignPatterns(matrix);
	}

	setTimingPatterns(matrix);
	setDarkModule(matrix);

	setReservedFormatArea(matrix);

	if (matrix.qrCodeVersion > 6) {
		setReservedVersionArea(matrix);
	}
}
