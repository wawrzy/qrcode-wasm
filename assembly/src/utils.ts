// 🧠🧠🧠
export function addToByteArray(
	array: Array<i32>, // buffer
	currentSize: i32, // number of bits allocated in buffer
	value: i32, // value to add
	length: i32 // length of value in bits
): i32 {
	// Recursive operation when length > 8
	if (length > 8) {
		let size = currentSize

		if (length % 8 > 0) {
			size = addToByteArray(
				array,
				currentSize,
				value >> (length - (length % 8)),
				length % 8
			)
		}

		let steps = (Math.floor(length / 8) as i32) - 1

		while (steps >= 0) {
			let tmp = value >> (steps * 8)
			tmp &= 0b11111111

			size = addToByteArray(array, size, tmp, 8)
			steps -= 1
		}

		return size
	}

	const arrIndex = Math.floor(currentSize / 8) as i32
	const availableBits = 8 - (currentSize % 8)
	let valueToAdd = value

	if (length > availableBits) {
		valueToAdd = valueToAdd >> (length - availableBits)
		array[arrIndex] = array[arrIndex] | valueToAdd
	} else {
		valueToAdd = (valueToAdd << (8 - length)) >> (8 - availableBits)
		array[arrIndex] = array[arrIndex] | valueToAdd
	}

	if (length > availableBits) {
		array[arrIndex + 1] = value << (8 - length)

		const toShift = 8 - (length - availableBits)
		const mask = ((0b11111111 >> toShift) << toShift) >> availableBits

		array[arrIndex + 1] &= mask
		array[arrIndex + 1] <<= availableBits
	}

	return currentSize + length
}
