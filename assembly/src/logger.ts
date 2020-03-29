import { DEBUG } from './config'

function decToBin(n: i32, res: string): string {
	const quotient = Math.floor(n / 2) as i32

	res = (n % 2).toString() + res

	return quotient === 0 ? res.padStart(8, '0') : decToBin(quotient, res)
}

@inline
export function debug(msg: string): void {
	if (DEBUG() === 1) {
		trace(msg)
	}
}

@inline
export function debugBuffer(array: Array<i32>): void {
	if (DEBUG() === 1) {
		array.forEach((byte: i32, index: i32) => {
			debug('Buffer IDX = ' + index.toString() + ' => ' + decToBin(byte, ''))
		})
	}
}
