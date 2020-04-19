export enum EncodingMode {
	Numeric = 1, // Numeric mode
	Alphanumeric = 2, // Alphanumeric mode
	Byte = 3, // Byte mode
	Invalid = -1, // Invalid
	// Kanji not yet supported
}

export enum ErrorLevel {
	L = 1, // 7% recovers
	M = 2, // 15% recovers
	Q = 3, // 25% recovers
	H = 4, // 30% recovers
}

// Max message size by encoding mode
export enum UpperLimits {
	Numeric = 7089,
	Alphanumeric = 4296,
	Byte = 2953,
	// Kanji not yet supported
}

export enum Error {
	Encoding = 10, // Message encoding not supported
	TooLong = 20, // Message too long (maximum size depends on encoding)
}
