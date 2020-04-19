/**
 * Convert an i32 numbo to string of bits
 * @param n
 * @param res
 * @param padStart Mininimal size of final string (add pad 0 if necessary)
 */
export function numberToBitsString(
	n: i32,
	res: string,
	padStart: i32 = 8
): string {
	const quotient = Math.floor(n / 2) as i32;

	res = (n % 2).toString() + res;

	return quotient === 0
		? res.padStart(padStart, '0')
		: numberToBitsString(quotient, res, padStart);
}
