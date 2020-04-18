import { Matrix } from './utils/matrix';
import { ErrorLevel } from './utils/enums';
import { numberToBitsString } from './utils/number';
import { formatInformation, versionInformation } from './utils/constants';

enum Direction {
	VerticalTop = 0, // Bottom to Top
	VerticalBottom = 0, // Top to Bottom
	Horizontal = 1, // Left to Right
}

function addStringToMatrix(
	matrix: Matrix,
	x: i32,
	y: i32,
	value: string,
	direction: Direction
): void {
	let count = 0;

	while (count < value.length) {
		if (x !== 6 && y !== 6) {
			const val = value.charCodeAt(count) === 48 ? 0 : 1;
			matrix.forcePut(x, y, val);
			count++;
		}

		if (direction === Direction.Horizontal) {
			x++;
		} else {
			y = direction === Direction.VerticalTop ? y - 1 : y + 1;
		}
	}
}

function addFormat(
	matrix: Matrix,
	mask: i8,
	errorCorrectionLevel: ErrorLevel
): void {
	const pos = (errorCorrectionLevel - 1) * 8 + (mask as i32);
	const formatString = numberToBitsString(formatInformation[pos], '', 15);

	addStringToMatrix(
		matrix,
		0,
		8,
		formatString.slice(0, 8),
		Direction.Horizontal
	);
	addStringToMatrix(
		matrix,
		8,
		8,
		formatString.slice(7, 16),
		Direction.VerticalTop
	);
	addStringToMatrix(
		matrix,
		matrix.matrixSize - 8,
		8,
		formatString.slice(7, 16),
		Direction.Horizontal
	);
	addStringToMatrix(
		matrix,
		8,
		matrix.matrixSize - 1,
		formatString.slice(0, 7),
		Direction.VerticalTop
	);
}

function addVersion(matrix: Matrix): void {
	const versionString = numberToBitsString(versionInformation[7 - 7], '', 18)
		.split('')
		.reverse()
		.join('');

	for (let i = 0; i < 6; i++) {
		const line = versionString.slice(i * 3, i * 3 + 3);

		addStringToMatrix(
			matrix,
			i,
			matrix.matrixSize - 11,
			line,
			Direction.VerticalBottom
		);

		addStringToMatrix(
			matrix,
			matrix.matrixSize - 11,
			i,
			line,
			Direction.Horizontal
		);
	}
}

export function formatAndVersion(
	matrix: Matrix,
	mask: i8,
	errorCorrectionLevel: ErrorLevel
): void {
	addFormat(matrix, mask, errorCorrectionLevel);

	if (matrix.qrCodeVersion >= 7) {
		addVersion(matrix);
	}
}
