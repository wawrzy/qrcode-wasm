import { debug } from './logger';
import { deepCopy } from './array';

export class Matrix {
	private matrix: Array<i32> = [];
	private reserved: Array<i8> = [];

	private size: i32 = 0;
	private version: i32 = 0; // QR Code version (needed for some calcul)

	constructor(size: i32, version: i32, matrix: Matrix | null = null) {
		this.matrix = new Array<i32>(size * size).fill(0);
		this.reserved = new Array<i8>(size * size).fill(0);
		this.size = size;
		this.version = version;

		if (matrix) {
			deepCopy<i32>(matrix.current, this.matrix);
			deepCopy<i8>(matrix.currentReserved, this.reserved);
		}
	}

	get current(): Array<i32> {
		return this.matrix;
	}

	get currentReserved(): Array<i8> {
		return this.reserved;
	}

	get matrixSize(): i32 {
		return this.size;
	}

	get qrCodeVersion(): i32 {
		return this.version;
	}

	public value(x: i32, y: i32): i32 {
		return this.matrix[y * this.size + x];
	}

	public isReserved(x: i32, y: i32): boolean {
		return !!this.reserved[y * this.size + x];
	}

	public invalidCoord(x: i32, y: i32): boolean {
		return x >= this.size || x < 0 || y >= this.size || y < 0;
	}

	public swap(x: i32, y: i32): void {
		const pos = y * this.size + x;

		this.matrix[pos] = this.matrix[pos] === 0 ? 1 : 0;
	}

	public put(x: i32, y: i32, value: i32, reserved: i8 = 0): void {
		if (!this.invalidCoord(x, y) && !this.isReserved(x, y)) {
			this.matrix[y * this.size + x] = value;

			if (reserved) {
				this.reserved[y * this.size + x] = 1;
			}
		}
	}

	public drawSquare(
		x: i32,
		y: i32,
		size: i32,
		value: i32,
		reserved: i8 = 0
	): void {
		const minY = y;
		const maxY = y + size - 1;
		const minX = x;
		const maxX = x + size - 1;

		while (y < maxY + 1) {
			for (let i = x; i < maxX + 1; i++) {
				if ([minY, maxY].includes(y) || [minX, maxX].includes(i)) {
					this.put(i, y, value, reserved);
				}
			}
			y++;
		}
	}

	/**
	 * Check if a square overlap a resvered area
	 * @param x
	 * @param y
	 * @param size square size
	 */
	public squareOverlap(x: i32, y: i32, size: i32): boolean {
		for (let i = y; i < y + size; i++) {
			for (let j = x; j < x + size; j++) {
				if (this.isReserved(j, i)) {
					return true;
				}
			}
		}

		return false;
	}
}

/**
 * Export matrix to memory [Matrix Size, data...]
 * @param matrix
 */
export function exportMatrix(matrix: Matrix): void {
	// Store matrix size
	store<i32>(0 as u32, matrix.matrixSize);

	const vSize = 4; // In bytes
	const current = matrix.current;

	for (let i: i32 = 0; i < matrix.matrixSize * matrix.matrixSize; i++) {
		store<i32>(((i + 1) * vSize) as i32, current[i]);
	}
}
