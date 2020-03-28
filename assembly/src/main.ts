import { DEBUG } from './config'

@inline
function info(msg: string): void {
	if (DEBUG() === 1) {
		trace(msg)
	}
}

export function main(arr: string): i32 {
	info(arr)

	return 42
}
