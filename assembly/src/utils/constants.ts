// https://www.thonky.com/qr-code-tutorial/alphanumeric-table
const alphaNumericTable = new Map<i32, i32>()

alphaNumericTable.set(48, 0) // 0
alphaNumericTable.set(49, 1) // 1
alphaNumericTable.set(50, 2) // 2
alphaNumericTable.set(51, 3) // 3
alphaNumericTable.set(52, 4) // 4
alphaNumericTable.set(53, 5) // 5
alphaNumericTable.set(54, 6) // 6
alphaNumericTable.set(55, 7) // 7
alphaNumericTable.set(56, 8) // 8
alphaNumericTable.set(57, 9) // 9
alphaNumericTable.set(65, 10) // A
alphaNumericTable.set(66, 11) // B
alphaNumericTable.set(67, 12) // C
alphaNumericTable.set(68, 13) // D
alphaNumericTable.set(69, 14) // E
alphaNumericTable.set(70, 15) // F
alphaNumericTable.set(71, 16) // G
alphaNumericTable.set(72, 17) // H
alphaNumericTable.set(73, 18) // I
alphaNumericTable.set(74, 19) // J
alphaNumericTable.set(75, 20) // K
alphaNumericTable.set(76, 21) // L
alphaNumericTable.set(77, 22) // M
alphaNumericTable.set(78, 23) // N
alphaNumericTable.set(79, 24) // O
alphaNumericTable.set(80, 25) // P
alphaNumericTable.set(81, 26) // Q
alphaNumericTable.set(82, 27) // R
alphaNumericTable.set(83, 28) // S
alphaNumericTable.set(84, 29) // T
alphaNumericTable.set(85, 30) // U
alphaNumericTable.set(86, 31) // V
alphaNumericTable.set(87, 32) // W
alphaNumericTable.set(88, 33) // X
alphaNumericTable.set(89, 34) // Y
alphaNumericTable.set(90, 35) // Z
alphaNumericTable.set(32, 36) // Space
alphaNumericTable.set(36, 37) // $
alphaNumericTable.set(37, 38) // %
alphaNumericTable.set(42, 39) // *
alphaNumericTable.set(43, 40) // +
alphaNumericTable.set(45, 41) // -
alphaNumericTable.set(46, 42) // .
alphaNumericTable.set(47, 43) // /
alphaNumericTable.set(58, 44) // :

// https://www.thonky.com/qr-code-tutorial/character-capacities
// [
//  [ v1
//    [ Error L - Numeric, Error L - AlphaNumeric,  Error L - Byte ],
//    [ Error M - Numeric, Error M - AlphaNumeric,  Error M - Byte ]
//    ...
//  ],
//  ...
// ]
const characterCapacities = [
	[
		[41, 25, 17],
		[34, 20, 14],
		[27, 16, 11],
		[17, 10, 7],
	],
	[
		[77, 47, 32],
		[63, 38, 26],
		[48, 29, 20],
		[34, 20, 14],
	],
	[
		[127, 77, 53],
		[101, 61, 42],
		[77, 47, 32],
		[58, 35, 24],
	],
	[
		[187, 114, 78],
		[149, 90, 62],
		[111, 67, 46],
		[82, 50, 34],
	],
	[
		[255, 154, 106],
		[202, 122, 84],
		[144, 87, 60],
		[106, 64, 44],
	],
	[
		[322, 195, 134],
		[255, 154, 106],
		[178, 108, 74],
		[139, 84, 58],
	],
	[
		[370, 224, 154],
		[293, 178, 122],
		[207, 125, 86],
		[154, 93, 64],
	],
	[
		[461, 279, 192],
		[365, 221, 152],
		[259, 157, 108],
		[202, 122, 84],
	],
	[
		[552, 335, 230],
		[432, 262, 180],
		[312, 189, 130],
		[235, 143, 98],
	],
	[
		[652, 395, 271],
		[513, 311, 213],
		[364, 221, 151],
		[288, 174, 119],
	],
	[
		[772, 468, 321],
		[604, 366, 251],
		[427, 259, 177],
		[331, 200, 137],
	],
	[
		[883, 535, 367],
		[691, 419, 287],
		[489, 296, 203],
		[374, 227, 155],
	],
	[
		[1022, 619, 425],
		[796, 483, 331],
		[580, 352, 241],
		[427, 259, 177],
	],
	[
		[1101, 667, 458],
		[871, 528, 362],
		[621, 376, 258],
		[468, 283, 194],
	],
	[
		[1250, 758, 520],
		[991, 600, 412],
		[703, 426, 292],
		[530, 321, 220],
	],
	[
		[1408, 854, 586],
		[1082, 656, 450],
		[775, 470, 322],
		[602, 365, 250],
	],
	[
		[1548, 938, 644],
		[1212, 734, 504],
		[876, 531, 364],
		[674, 408, 280],
	],
	[
		[1725, 1046, 718],
		[1346, 816, 560],
		[948, 574, 394],
		[746, 452, 310],
	],
	[
		[1903, 1153, 792],
		[1500, 909, 624],
		[1063, 644, 442],
		[813, 493, 338],
	],
	[
		[2061, 1249, 858],
		[1600, 970, 666],
		[1159, 702, 482],
		[919, 557, 382],
	],
	[
		[2232, 1352, 929],
		[1708, 1035, 711],
		[1224, 742, 509],
		[969, 587, 403],
	],
	[
		[2409, 1460, 1003],
		[1872, 1134, 779],
		[1358, 823, 565],
		[1056, 640, 439],
	],
	[
		[2620, 1588, 1091],
		[2059, 1248, 857],
		[1468, 890, 611],
		[1108, 672, 461],
	],
	[
		[2812, 1704, 1171],
		[2188, 1326, 911],
		[1588, 963, 661],
		[1228, 744, 511],
	],
	[
		[3057, 1853, 1273],
		[2395, 1451, 997],
		[1718, 1041, 715],
		[1286, 779, 535],
	],
	[
		[3283, 1990, 1367],
		[2544, 1542, 1059],
		[1804, 1094, 751],
		[1425, 864, 593],
	],
	[
		[3517, 2132, 1465],
		[2701, 1637, 1125],
		[1933, 1172, 805],
		[1501, 910, 625],
	],
	[
		[3669, 2223, 1528],
		[2857, 1732, 1190],
		[2085, 1263, 868],
		[1581, 958, 658],
	],
	[
		[3909, 2369, 1628],
		[3035, 1839, 1264],
		[2181, 1322, 908],
		[1677, 1016, 698],
	],
	[
		[4158, 2520, 1732],
		[3289, 1994, 1370],
		[2358, 1429, 982],
		[1782, 1080, 742],
	],
	[
		[4417, 2677, 1840],
		[3486, 2113, 1452],
		[2473, 1499, 1030],
		[1897, 1150, 790],
	],
	[
		[4686, 2840, 1952],
		[3693, 2238, 1538],
		[2670, 1618, 1112],
		[2022, 1226, 842],
	],
	[
		[4965, 3009, 2068],
		[3909, 2369, 1628],
		[2805, 1700, 1168],
		[2157, 1307, 898],
	],
	[
		[5253, 3183, 2188],
		[4134, 2506, 1722],
		[2949, 1787, 1228],
		[2301, 1394, 958],
	],
	[
		[5529, 3351, 2303],
		[4343, 2632, 1809],
		[3081, 1867, 1283],
		[2361, 1431, 983],
	],
	[
		[5836, 3537, 2431],
		[4588, 2780, 1911],
		[3244, 1966, 1351],
		[2524, 1530, 1051],
	],
	[
		[6153, 3729, 2563],
		[4775, 2894, 1989],
		[3417, 2071, 1423],
		[2625, 1591, 1093],
	],
	[
		[6479, 3927, 2699],
		[5039, 3054, 2099],
		[3599, 2181, 1499],
		[2735, 1658, 1139],
	],
	[
		[6743, 4087, 2809],
		[5313, 3220, 2213],
		[3791, 2298, 1579],
		[2927, 1774, 1219],
	],
	[
		[7089, 4296, 2953],
		[5596, 3391, 2331],
		[3993, 2420, 1663],
		[3057, 1852, 1273],
	],
]

// [EC Codewords Per Block, Number of Blocks in Group 1, Number of Data Codewords in Each of Group 1's Blocks, NBG2, NDG2]
const errorCorrectionCodeWords = [
	[7, 1, 19, 0, 0],
	[10, 1, 16, 0, 0],
	[13, 1, 13, 0, 0],
	[17, 1, 9, 0, 0],
	[10, 1, 34, 0, 0],
	[16, 1, 28, 0, 0],
	[22, 1, 22, 0, 0],
	[28, 1, 16, 0, 0],
	[15, 1, 55, 0, 0],
	[26, 1, 44, 0, 0],
	[18, 2, 17, 0, 0],
	[22, 2, 13, 0, 0],
	[20, 1, 80, 0, 0],
	[18, 2, 32, 0, 0],
	[26, 2, 24, 0, 0],
	[16, 4, 9, 0, 0],
	[26, 1, 108, 0, 0],
	[24, 2, 43, 0, 0],
	[18, 2, 15, 2, 16],
	[22, 2, 11, 2, 12],
	[18, 2, 68, 0, 0],
	[16, 4, 27, 0, 0],
	[24, 4, 19, 0, 0],
	[28, 4, 15, 0, 0],
	[20, 2, 78, 0, 0],
	[18, 4, 31, 0, 0],
	[18, 2, 14, 4, 15],
	[26, 4, 13, 1, 14],
	[24, 2, 97, 0, 0],
	[22, 2, 38, 2, 39],
	[22, 4, 18, 2, 19],
	[26, 4, 14, 2, 15],
	[30, 2, 116, 0, 0],
	[22, 3, 36, 2, 37],
	[20, 4, 16, 4, 17],
	[24, 4, 12, 4, 13],
	[18, 2, 68, 2, 69],
	[26, 4, 43, 1, 44],
	[24, 6, 19, 2, 20],
	[28, 6, 15, 2, 16],
	[20, 4, 81, 0, 0],
	[30, 1, 50, 4, 51],
	[28, 4, 22, 4, 23],
	[24, 3, 12, 8, 13],
	[24, 2, 92, 2, 93],
	[22, 6, 36, 2, 37],
	[26, 4, 20, 6, 21],
	[28, 7, 14, 4, 15],
	[26, 4, 107, 0, 0],
	[22, 8, 37, 1, 38],
	[24, 8, 20, 4, 21],
	[22, 12, 11, 4, 12],
	[30, 3, 115, 1, 116],
	[24, 4, 40, 5, 41],
	[20, 11, 16, 5, 17],
	[24, 11, 12, 5, 13],
	[22, 5, 87, 1, 88],
	[24, 5, 41, 5, 42],
	[30, 5, 24, 7, 25],
	[24, 11, 12, 7, 13],
	[24, 5, 98, 1, 99],
	[28, 7, 45, 3, 46],
	[24, 15, 19, 2, 20],
	[30, 3, 15, 13, 16],
	[28, 1, 107, 5, 108],
	[28, 10, 46, 1, 47],
	[28, 1, 22, 15, 23],
	[28, 2, 14, 17, 15],
	[30, 5, 120, 1, 121],
	[26, 9, 43, 4, 44],
	[28, 17, 22, 1, 23],
	[28, 2, 14, 19, 15],
	[28, 3, 113, 4, 114],
	[26, 3, 44, 11, 45],
	[26, 17, 21, 4, 22],
	[26, 9, 13, 16, 14],
	[28, 3, 107, 5, 108],
	[26, 3, 41, 13, 42],
	[30, 15, 24, 5, 25],
	[28, 15, 15, 10, 16],
	[28, 4, 116, 4, 117],
	[26, 17, 42, 0, 0],
	[28, 17, 22, 6, 23],
	[30, 19, 16, 6, 17],
	[28, 2, 111, 7, 112],
	[28, 17, 46, 0, 0],
	[30, 7, 24, 16, 25],
	[24, 34, 13, 0, 0],
	[30, 4, 121, 5, 122],
	[28, 4, 47, 14, 48],
	[30, 11, 24, 14, 25],
	[30, 16, 15, 14, 16],
	[30, 6, 117, 4, 118],
	[28, 6, 45, 14, 46],
	[30, 11, 24, 16, 25],
	[30, 30, 16, 2, 17],
	[26, 8, 106, 4, 107],
	[28, 8, 47, 13, 48],
	[30, 7, 24, 22, 25],
	[30, 22, 15, 13, 16],
	[28, 10, 114, 2, 115],
	[28, 19, 46, 4, 47],
	[28, 28, 22, 6, 23],
	[30, 33, 16, 4, 17],
	[30, 8, 122, 4, 123],
	[28, 22, 45, 3, 46],
	[30, 8, 23, 26, 24],
	[30, 12, 15, 28, 16],
	[30, 3, 117, 10, 118],
	[28, 3, 45, 23, 46],
	[30, 4, 24, 31, 25],
	[30, 11, 15, 31, 16],
	[30, 7, 116, 7, 117],
	[28, 21, 45, 7, 46],
	[30, 1, 23, 37, 24],
	[30, 19, 15, 26, 16],
	[30, 5, 115, 10, 116],
	[28, 19, 47, 10, 48],
	[30, 15, 24, 25, 25],
	[30, 23, 15, 25, 16],
	[30, 13, 115, 3, 116],
	[28, 2, 46, 29, 47],
	[30, 42, 24, 1, 25],
	[30, 23, 15, 28, 16],
	[30, 17, 115, 0, 0],
	[28, 10, 46, 23, 47],
	[30, 10, 24, 35, 25],
	[30, 19, 15, 35, 16],
	[30, 17, 115, 1, 116],
	[28, 14, 46, 21, 47],
	[30, 29, 24, 19, 25],
	[30, 11, 15, 46, 16],
	[30, 13, 115, 6, 116],
	[28, 14, 46, 23, 47],
	[30, 44, 24, 7, 25],
	[30, 59, 16, 1, 17],
	[30, 12, 121, 7, 122],
	[28, 12, 47, 26, 48],
	[30, 39, 24, 14, 25],
	[30, 22, 15, 41, 16],
	[30, 6, 121, 14, 122],
	[28, 6, 47, 34, 48],
	[30, 46, 24, 10, 25],
	[30, 2, 15, 64, 16],
	[30, 17, 122, 4, 123],
	[28, 29, 46, 14, 47],
	[30, 49, 24, 10, 25],
	[30, 24, 15, 46, 16],
	[30, 4, 122, 18, 123],
	[28, 13, 46, 32, 47],
	[30, 48, 24, 14, 25],
	[30, 42, 15, 32, 16],
	[30, 20, 117, 4, 118],
	[28, 40, 47, 7, 48],
	[30, 43, 24, 22, 25],
	[30, 10, 15, 67, 16],
	[30, 19, 118, 6, 119],
	[28, 18, 47, 31, 48],
	[30, 34, 24, 34, 25],
	[30, 20, 15, 61, 16],
]

const generatorsPolynomial = new Map<i32, Array<i32>>()

generatorsPolynomial.set(7, [0, 87, 229, 146, 149, 238, 102, 21])
generatorsPolynomial.set(10, [0, 251, 67, 46, 61, 118, 70, 64, 94, 32, 45])
generatorsPolynomial.set(13, [0, 74, 152, 176, 100, 86, 100, 106, 104, 130, 218, 206, 140, 78])
generatorsPolynomial.set(15, [0, 8, 183, 61, 91, 202, 37, 51, 58, 58, 237, 140, 124, 5, 99, 105])
generatorsPolynomial.set(16, [0, 120, 104, 107, 109, 102, 161, 76, 3, 91, 191, 147, 169, 182, 194, 225, 120])
generatorsPolynomial.set(17, [0, 43, 139, 206, 78, 43, 239, 123, 206, 214, 147, 24, 99, 150, 39, 243, 163, 136])
generatorsPolynomial.set(18, [0, 215, 234, 158, 94, 184, 97, 118, 170, 79, 187, 152, 148, 252, 179, 5, 98, 96, 153])
generatorsPolynomial.set(20, [0, 17, 60, 79, 50, 61, 163, 26, 187, 202, 180, 221, 225, 83, 239, 156, 164, 212, 212, 188, 190])
generatorsPolynomial.set(22, [0, 210, 171, 247, 242, 93, 230, 14, 109, 221, 53, 200, 74, 8, 172, 98, 80, 219, 134, 160, 105, 165, 231])
generatorsPolynomial.set(24, [0, 229, 121, 135, 48, 211, 117, 251, 126, 159, 180, 169, 152, 192, 226, 228, 218, 111, 0, 117, 232, 87, 96, 227, 21])
generatorsPolynomial.set(26, [0, 173, 125, 158, 2, 103, 182, 118, 17, 145, 201, 111, 28, 165, 53, 161, 21, 245, 142, 13, 102, 48, 227, 153, 145, 218, 70])
generatorsPolynomial.set(28, [0, 168, 223, 200, 104, 224, 234, 108, 180, 110, 190, 195, 147, 205, 27, 232, 201, 21, 43, 245, 87, 42, 195, 212, 119, 242, 37, 9, 123])
generatorsPolynomial.set(30, [0, 41, 173, 145, 152, 216, 31, 179, 182, 50, 48, 110, 86, 239, 96, 222, 125, 42, 173, 226, 193, 224, 130, 156, 37, 251, 216, 238, 40, 192, 180])


// index = exponent of a -> value = integer
const antilogs = [1, 2, 4, 8, 16, 32, 64, 128, 29, 58, 116, 232, 205, 135, 19, 38, 76, 152, 45, 90, 180, 117, 234, 201, 143, 3, 6, 12, 24, 48, 96, 192, 157, 39, 78, 156, 37, 74, 148, 53, 106, 212, 181, 119, 238, 193, 159, 35, 70, 140, 5, 10, 20, 40, 80, 160, 93, 186, 105, 210, 185, 111, 222, 161, 95, 190, 97, 194, 153, 47, 94, 188, 101, 202, 137, 15, 30, 60, 120, 240, 253, 231, 211, 187, 107, 214, 177, 127, 254, 225, 223, 163, 91, 182, 113, 226, 217, 175, 67, 134, 17, 34, 68, 136, 13, 26, 52, 104, 208, 189, 103, 206, 129, 31, 62, 124, 248, 237, 199, 147, 59, 118, 236, 197, 151, 51, 102, 204, 133, 23, 46, 92, 184, 109, 218, 169, 79, 158, 33, 66, 132, 21, 42, 84, 168, 77, 154, 41, 82, 164, 85, 170, 73, 146, 57, 114, 228, 213, 183, 115, 230, 209, 191, 99, 198, 145, 63, 126, 252, 229, 215, 179, 123, 246, 241, 255, 227, 219, 171, 75, 150, 49, 98, 196, 149, 55, 110, 220, 165, 87, 174, 65, 130, 25, 50, 100, 200, 141, 7, 14, 28, 56, 112, 224, 221, 167, 83, 166, 81, 162, 89, 178, 121, 242, 249, 239, 195, 155, 43, 86, 172, 69, 138, 9, 18, 36, 72, 144, 61, 122, 244, 245, 247, 243, 251, 235, 203, 139, 11, 22, 44, 88, 176, 125, 250, 233, 207, 131, 27, 54, 108, 216, 173, 71, 142, 1];

export { alphaNumericTable, characterCapacities, errorCorrectionCodeWords, generatorsPolynomial, antilogs }
