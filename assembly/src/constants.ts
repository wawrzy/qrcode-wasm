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

// Max message size by encoding mode
enum UpperLimits {
	Numeric = 7089,
	Alphanumeric = 4296,
	Byte = 2953,
}

export { alphaNumericTable, characterCapacities, UpperLimits }
