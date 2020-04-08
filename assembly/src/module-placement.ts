// import { Buffer } from './utils/buffer'
import { Matrix } from './utils/matrix'

function setFinderPatterns(matrix: Matrix): void {
	const fp1 = [0, 0]
	const fp2 = [(matrix.qrCodeVersion - 1) * 4 + 21 - 7, 0]
	const fp3 = [0, (matrix.qrCodeVersion - 1) * 4 + 21 - 7]

	// Finder pattern 1
	matrix.drawSquare(fp1[0], fp1[0], 7, 1, 1)
	matrix.drawSquare(fp1[0] + 2, fp1[0] + 2, 3, 1, 1)
	matrix.put(fp1[0] + 3, fp1[0] + 3, 1, 1)
}

export function modulePlacement(matrix: Matrix): void {
	setFinderPatterns(matrix)
}
