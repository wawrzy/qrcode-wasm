import { DEBUG } from '../config';
import { numberToBitsString } from './number';

@inline
export function debug(msg: string): void {
	if (DEBUG() === 1) {
		trace(msg);
	}
}

@inline
export function debugBuffer(array: Array<i32>): void {
	if (DEBUG() === 1) {
		array.forEach((byte: i32, index: i32) => {
			debug(
				'Buffer IDX = ' +
					index.toString() +
					' => ' +
					numberToBitsString(byte, '')
			);
		});
	}
}

@inline
export function debugArray(array: Array<i32>, msg: string = ''): void {
	if (DEBUG() === 1) {
		debug(
			msg +
				'Array length = ' +
				array.length.toString() +
				' => ' +
				array.join(', ')
		);
	}
}
