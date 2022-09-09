// 蓝牙相关的公共类：数据处理

// AES-ECB-128加解密，采用PKCS7Padding不起算法
import CryptoJS from 'crypto-js'

/**
 * ArrayBuffer 转 16 进制 String
 * @param {ArrayBuffer} ab
 * @return {String} 16进制字符串
 */
const ab2hex = function(ab) {
	return Array.prototype.map.call(new Uint8Array(ab), (b) => {
		return ('00' + b.toString(16)).slice(-2)
	}).join('');
}

/**
 * 16 进制 String 转 ArrayBuffer
 * @param {String} hex 16进制字符串
 * @return {ArrayBuffer}
 */
const hex2ab = function(hex) {
	return new Uint8Array(hex.match(/[\da-f]{2}/gi).map((h) => {
		return parseInt(h, 16);
	})).buffer;
}

/**
 * 将 String 转换成 bytes
 * @param {String} string 16进制字符串
 * @return {bytes} 数组
 */
const string2bytes = function(string) {
	let bytes = [];
	for (let i = 0; i < string.length; i = i + 2) {
		let temp1 = string.substring(i, i + 1);
		let temp2 = string.substring(i + 1, i + 2);
		let byte1 = parseInt(temp1, 16);
		let byte2 = parseInt(temp2, 16);
		bytes.push(int2byte((byte1 << 4) ^ byte2));
	}
	return bytes;
}

/**
 * 将 Number 转换成 byte
 * @param {Number} number
 * @return {byte}
 */
const int2byte = function(number) {
	let b = number & 0xFF;
	return b < 128 ? b : ((b % 128) - 128);
}

/**
 * 将 Number 转成 char 后，再转成 Number
 * @param {Number} number
 * @return {Number}
 */
const int2char2int = function(number) {
	let temp = String.fromCharCode(number);
	return temp.charCodeAt(temp);
}

/**
 * CRC16校验
 * @param {String} string
 * @return {Array} hex类型的数组
 */
const crc16 = function(string) {
	let crc16 = 0;
	string2bytes(string).forEach((buffer) => {
		crc16 = int2char2int((crc16 >> 8) | (crc16 << 8));
		crc16 ^= (buffer & 0xFF);
		crc16 ^= int2char2int((crc16 & 0xFF) >> 4);
		crc16 ^= int2char2int((crc16 << 8) << 4);
		crc16 ^= int2char2int(((crc16 & 0xFF) << 4) << 1);
	});
	return [frLen(crc16 / 256, 2), frLen(crc16 % 256, 2)];
}

/**
 * AES加密
 * @param {String} data 明文，待加密数据
 * @param {String} keys 秘钥，加密的钥匙
 * @return {String} 16进制字符串
 */
const aesEN = function(data, keys) {
	let src = CryptoJS.enc.Hex.parse(data),
		key = CryptoJS.enc.Hex.parse(keys);
	return CryptoJS.AES.encrypt(src, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	}).ciphertext.toString();
}

/**
 * AES解密
 * @param {String} data 密文，待加密数据
 * @param {String} keys 秘钥，加密的钥匙
 * @return {String} 16进制字符串
 */
const aesDE = function(data, keys) {
	let src = CryptoJS.format.Hex.parse(data),
		key = CryptoJS.enc.Hex.parse(keys);
	let res = CryptoJS.AES.decrypt(src, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return CryptoJS.enc.Hex.stringify(res);
}

/**
 * 帧长度（不足 length 的，前面补 0）
 * @param {Number} number 数字
 * @param {Number} length 位长度
 */
const frLen = function(number, length) {
	let temp = number.toString(16),
		hex = temp.split('.')[0];
	return fill(hex, length);
}

/**
 * 补零
 * @param {String} value 需要补零的字符串
 * @param {Number} length 补零后的总长度
 */
const fill = function(value, length) {
	let total = length - value.length;
	let zero = '';
	for (let i = 0; i < total; i++) {
		zero += '0';
	}
	return zero + value;
}

/**
 * 日志
 * @param {Function} callback 
 * @param {Object} result 
 * result.type：日志类型，success-成功，failure-失败，command-操作，normal-常规，params-读参数，records-读记录
 * result.text：日志内容
 * result.flag：日志标识，true-成功，false-失败，type为success/failure/command时，无效
 */
const cbFunc = function(callback, result) {
	if (typeof callback === 'function') {
		callback(result);
	}
}

export default {
	crc16,
	aesEN,
	aesDE,
	fill,
	frLen,
	hex2ab,
	ab2hex,
	cbFunc
}
