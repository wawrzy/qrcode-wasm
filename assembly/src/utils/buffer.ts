export class Buffer<T extends number> {
	private buffer: Array<T>
	private bufferSize: i32 = 0

	constructor(size: i32 = 0) {
		this.buffer = new Array<T>(size)
		this.buffer.fill(0 as T)
	}

	get current(): Array<T> {
		return this.buffer
	}

	get size(): i32 {
		return this.bufferSize
	}

	/**
	 * 🧠🧠🧠
	 * A lot of blood has flowed to write these lines.
	 *
	 * Add bits (custom amount) to an array of bytes
	 *
	 * @param value value to add
	 * @param length ength of value in bits
	 */
	public push(value: T, length: i32): void {
		// Recursive operation when length > 8
		if (length > 8) {
			if (length % 8 > 0) {
				this.push((value >> (length - (length % 8))) as T, length % 8)
			}

			for (
				let steps = (Math.floor(length / 8) as i32) - 1;
				steps >= 0;
				steps -= 1
			) {
				const tmp = (value >> (steps * 8)) & 0b11111111

				this.push(tmp as T, 8)
			}

			return
		}

		const arrIndex = Math.floor(this.bufferSize / 8) as i32
		const availableBits = 8 - (this.bufferSize % 8)

		let valueToAdd = value

		if (length > availableBits) {
			valueToAdd = (valueToAdd >> (length - availableBits)) as T
			this.buffer[arrIndex] = (this.buffer[arrIndex] | valueToAdd) as T
		} else {
			valueToAdd = ((valueToAdd << (8 - length)) >> (8 - availableBits)) as T
			this.buffer[arrIndex] = (this.buffer[arrIndex] | valueToAdd) as T
		}

		if (length > availableBits) {
			this.buffer[arrIndex + 1] = (value << (8 - length)) as T

			const toShift = 8 - (length - availableBits)
			const mask = ((0b11111111 >> toShift) << toShift) >> availableBits

			this.buffer[arrIndex + 1] = (this.buffer[arrIndex + 1] & mask) as T
			this.buffer[arrIndex + 1] = (this.buffer[arrIndex + 1] <<
				availableBits) as T
		}

		this.bufferSize += length
	}
}
