/**
 * Copy src array to dest array
 * @param src
 * @param dest
 */
export function deepCopy<T>(src: Array<T>, dest: Array<T>): void {
	for (let i = 0; i < src.length; i++) {
		dest[i] = src[i];
	}
}
