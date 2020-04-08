export class Matrix {
	private matrix: Array<i32> = []
	private reserved: Array<i8> = []

	private size: i32 = 0
	private version: i32 = 0 // QR Code version (needed for some placement)

	constructor(size: i32, version: i32) {
		this.matrix = new Array<i32>(size * size).fill(0)
		this.reserved = new Array<i8>(size * size).fill(0)
		this.size = size
		this.version = version
	}

	get current(): Array<i32> {
		return this.matrix
	}

	get matrixSize(): i32 {
		return this.size
	}

	get qrCodeVersion(): i32 {
		return this.version
	}

	public isReserved(x: i32, y: i32): i8 {
		return this.reserved[y * this.size + x]
	}

	public put(x: i32, y: i32, value: i32, reserved: i8 = 0): void {
		if (!this.isReserved(x, y)) {
			this.matrix[y * this.size + x] = value
		}

		if (reserved) {
			this.reserved[y * this.size + x] = 1
		}
	}

	public drawSquare(
		x: i32,
		y: i32,
		size: i32,
		value: i32,
		reserved: i8 = 0
	): void {
		const minY = y
		const maxY = y + size - 1
		const minX = x
		const maxX = x + size - 1

		while (y < maxY + 1) {
			for (let i = x; i < maxX - 1; i++) {
				if ([minY, maxY].includes(y) || [minX, maxX].includes(i)) {
					this.put(i, y, value, reserved)
				}
			}
			y++
		}
	}
}

export function exportMatrix(matrix: Matrix): void {
	// Set matrix size
	store<i32>(0 as u32, matrix.matrixSize)

	const vSize = 4 // In bytes
	const current = matrix.current

	for (let i: i32 = 0; i < matrix.matrixSize * matrix.matrixSize; i++) {
		store<i32>(((i + 1) * vSize) as i32, current[i])
	}
}
