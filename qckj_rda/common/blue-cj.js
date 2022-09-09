// C级表：帧格式（BCD码采用大端，其余采用小端）

import blueCom from './blue-com.js'

// 错误码
const ERROR = {
	'0000': '成功',
	'0100': '数据对象 ID 不正确',
	'0200': '日期非法',
	'0300': '协议代码不支持',
	'0400': '协议框架版本不支持',
	'0500': 'MAC认证错误',
	'0600': '应用协议版本不支持',
	'0700': '写参数值非法',
	'0800': '表号非法'
}

// 秘钥，0-A阶段，1-B阶段
const KEY = [
	'25472468183694455410000000000000',
	'01301051646353000000000000000000'
];

// 上线消息序号，充返回的数据中获取
var UpMsgId = '00000000';

// 秘钥索引值，-1-不加密，0-未开户，1-已开户
var keyIdx = -1;

// 数据处理的标识，did + ctr
var dataFlag = '';

// 回调接口
var CallBack = {};

// 临时保存帧数据的数组
var readHex = ['', '', '', '', '', ''];
// 临时保存帧数据的总长度
var readLen = 0;
// 临时保存帧数据的索引值
var readIdx = 0;



/**
 * AES加密
 * @param {String} data 数据域，明文
 * @param {Number} secret 秘钥索引值
 */
const encrpty = function(data) {
	if (-1 === keyIdx) return data;
	return blueCom.aesEN(data, KEY[keyIdx]);
}

/**
 * AES解密
 * @param {String} data 数据域，密文
 */
const decrpty = function(data) {
	if (-1 === keyIdx) return data;
	return blueCom.aesDE(data, KEY[0]);
}

/**
 * 日志返回的text值
 * @param {String} errCode 错误码
 * @param {String} defMsg 默认值
 */
const message = function(errCode, defMsg) {
	let has = ERROR.hasOwnProperty(errCode);
	return has ? ERROR[errCode] : defMsg;
}

/**
 * 帧结构
 * @param {Object} params c、did、d、pfv、mid
 */
const frame = function(params) {
	let udcdd =
		UpMsgId + // 上行消息序号，4字节
		'00000000' + // 下行消息序号，4字节
		params.c + // 控制域，1字节
		params.did + // 控制对象ID，2字节，小端
		params.d; // 数据域，MAC/AES等处理
	// CRC16检验码，2字节，小端】
	let array = blueCom.crc16(udcdd),
		crc16 = array[1] + array[0];
	// 帧长度，2字节，小端
	let total = 16 + udcdd.length / 2,
		len = blueCom.frLen(total, 4),
		frLen = len.substring(2, 4);
	frLen += len.substring(0, 2);
	// 表号补零
	let mid = blueCom.fill(params.mid, 16);

	return '68' + // 帧头，1字节
		'10' + // 协议版本，1字节
		params.pfv + // 协议框架版本，1字节
		frLen + // 帧长度，2字节，小端
		mid + // 表号，8字节，BCD码
		udcdd + // 
		crc16 + // CRC校验码，2字节，小端
		'16'; // 帧尾，1字节
}

/**
 * 设置监听的回调方法
 * @param {Object} callBack
 */
const change = function(callBack) {
	CallBack = callBack;
}

/**
 * 日志
 * @param {Object} params
 */
const logcat = function(params) {
	blueCom.cbFunc(CallBack.logcat, {
		text: params.text,
		type: params.type,
		flag: params.flag,
	});
}

/**
 * notify 特征值读取的数据
 * @param {Object} data
 */
const read = function(data) {
	let hex = blueCom.ab2hex(data.value),
		end = hex.length - 6;
	console.log('READ: ' + hex);
	if (0 === hex.length) return;
	// 数据对象ID，2字节，小端
	let did = hex.substring(44, 48);
	// 数据域
	let res = hex.substring(48, end),
		error = ''; // 错误码数据结果
		

		
	if ('010085' === dataFlag) { // 阀门控制
		// 上行消息序号
		UpMsgId = res.substring(0, 8);
		// 错误码
		error = res.substring(8, 12);
		// 日志信息回调
		blueCom.cbFunc(CallBack.logcat, {
			type: 'normal',
			flag: '0000' === error,
			text: message(error, '')
		});
	} else if ('142084' === dataFlag) { // 读表号
		// 上行消息序号
		UpMsgId = res.substring(0, 8);
		end = res.length;
		// 表号或错误码
		error = res.substring(8, end);
		// 日志信息回调
		blueCom.cbFunc(CallBack.logcat, {
			type: 'params',
			flag: 4 !== error.length,
			text: message(error, error)
		});
	} else if ('043084' === dataFlag) { // 激活
		let isStart = hex.startsWith('681017');
		if (isStart) {
			// 获取数据长度
			let dataLen = hex.substring(6, 10),
				len1 = dataLen.substring(2, 4),
				len2 = dataLen.substring(0, 2);
			readLen = parseInt(len1 + len2, 16);
			readIdx = 0;
			readHex = ['', '', '', '', '', ''];
		}
		readHex[readIdx++] = hex;
		let totalHex = '';
		readHex.forEach((item, index) => {
			totalHex += item;
		});
		console.log('totalHex: ' + `${totalHex}`);
		
		if (readLen * 2 !== totalHex.length) return;
		if (!totalHex.endsWith('16')) return;
		blueCom.cbFunc(CallBack.report, totalHex);



		// let is68 = hex.startsWith('68'), // 68开头
		// 	is16 = hex.endsWith('16'); // 16结尾
		// if (is68 && is16) { // 完整的帧数据
		// 	readHex = ['', '', ''];
		// 	blueCom.cbFunc(CallBack.report, hex);
		// 	return;
		// }
		// if (is68 && !is16) {
		// 	readHex[0] = hex;
		// } else if (!is68 && is16) {
		// 	readHex[2] = hex;
		// } else {
		// 	readHex[1] = hex;
		// }

		// // 获取数据长度
		// let dataLen = readHex[0].substring(6, 10);
		// // 处理小端法得数据长度，得到正确10进制的数据长度
		// let resLen = ["", ""];
		// resLen[0] = dataLen.substring(2, 4);
		// resLen[1] = dataLen.substring(0, 2);
		// let resLenData = resLen[0] + resLen[1];
		// let FinalLen = parseInt(resLenData, 16);
		// // 比较组装后的字符串长度和获取的数据长度
		// let FinalData = readHex[0] + readHex[1] + readHex[2];
		// let successLen = FinalData.length == FinalLen * 2;
		// console.log(FinalData.length);
		// console.log(FinalLen);

		// console.log(successLen);

		// if (successLen) {
		// 	let tmp = FinalData;
		// 	readHex = ['', '', ''];
		// 	blueCom.cbFunc(CallBack.report, tmp);
		// }
	} else if ('report' === dataFlag) { // 透传
		let isStart = hex.startsWith('681017');
		if (isStart) {
			// 获取数据长度
			let dataLen = hex.substring(6, 10),
				len1 = dataLen.substring(2, 4),
				len2 = dataLen.substring(0, 2);
			readLen = parseInt(len1 + len2, 16);
			readIdx = 0;
			readHex = ['', '', '', '', '', ''];
		}
		readHex[readIdx++] = hex;
		let totalHex = '';
		readHex.forEach((item, index) => {
			totalHex += item;
		});
		console.log('totalHex: ' + `${totalHex}`);
		
		if (readLen * 2 !== totalHex.length) return;
		if (!totalHex.endsWith('16')) return;
		blueCom.cbFunc(CallBack.report, totalHex);
		
	} else if ('021087' === dataFlag) {
		let is68 = hex.startsWith('68'), // 68开头
			is16 = hex.endsWith('16'); // 16结尾
		if (is68 && is16) { // 完整的帧数据
			readHex = ['', ''];
			let is68 = hex.startsWith('68'),
				is16 = hex.endsWith('16');
			if (is68 && is16) {
				console.log("完整的数据1");
				let resDataList = decrpty(res);
				let lastDataList = [];
				for (var j = 16; j < resDataList.length; j += 8) {
					let resData = resDataList.substring(j, j + 8);
					let tempData = [];
					for (var i = 0; i < resData.length; i += 2) {
						tempData.push(resData.substring(i, i + 2));
					}
					tempData = tempData.reverse();
					let stringData = tempData.join('');
					let lastData = parseInt(stringData, 16) / 1000;
					lastDataList.push(lastData);
				}
				let dayNum = resDataList.substring(9, 10);
				console.log(dayNum);
				let fistYear = resDataList.substring(10, 12);
				let fistMoth = resDataList.substring(12, 14);
				let fistDay = resDataList.substring(14, 16);
				// fistMoth = fistMoth < 10 ? "0"+fistMoth:fistMoth;
				// fistDay = fistDay < 10 ? "0"+fistDay:fistDay;
				let firstTime = "20" + fistYear + "-" + fistMoth + "-" + fistDay;
				for (var i in lastDataList) {
					logcat({
						type: "normal-none",
						text: `${firstTime} ` + i + "时" + ": " + lastDataList[i]
					});
				}
			}
			return;
		} else {
			if (is68 && !is16) {
				readHex[0] = hex;
			} else if (!is68 && is16) {
				readHex[2] = hex;
			} else {
				readHex[1] = hex;
			}

			// 获取数据长度
			let dataLen = readHex[0].substring(6, 10);
			// 处理小端法得数据长度，得到正确10进制的数据长度
			let resLen = ["", ""];
			resLen[0] = dataLen.substring(2, 4);
			resLen[1] = dataLen.substring(0, 2);
			let resLenData = resLen[0] + resLen[1];
			let FinalLen = parseInt(resLenData, 16);
			// 比较组装后的字符串长度和获取的数据长度
			let FinalData = readHex[0] + readHex[1] + readHex[2];
			let successLen = FinalData.length == FinalLen * 2;

			if (successLen) {
				let tmp = FinalData;
				readHex = ['', ''];
				console.log(`hour used: ${tmp}`);
				// blueCom.cbFunc(CallBack.report, tmp);
				let is68 = tmp.startsWith('68'),
					is16 = tmp.endsWith('16');
				if (is68 && is16) {
					let endData = tmp.length - 6;
					let did = tmp.substring(44, 48);
					// 数据域
					let res = tmp.substring(48, endData);
					console.log("完整的数据2: " + res);
					let resDataList = decrpty(res);


					// let dayNum = resDataList.substring(9,10);
					// let fistYear = resDataList.substring(10,12);
					// let fistMoth = resDataList.substring(13,14);
					// let fistDay = resDataList.substring(15,16);
					// fistMoth = fistMoth < 10 ? "0"+fistMoth:fistMoth;
					// fistDay = fistDay < 10 ? "0"+fistDay:fistDay;
					// let firstTime = fistYear+"-"+fistMoth+"-"+fistDay;
					// let dateTime = `查询时间${}`;
					// console.log("wzw_tmp "+dateTime);

					// let res =tmp.substring(48, endData);
					// console.log("完整的数据2: "+res);
					// let resDataList= decrpty(res);
					// console.log("wzw_tmp "+resDataList);

					let dayNum = resDataList.substring(9, 10);

					let fistYear = resDataList.substring(10, 12);
					let fistMoth = resDataList.substring(12, 14);
					let fistDay = resDataList.substring(14, 16);

					fistMoth = fistMoth < 10 ? "0" + fistMoth : fistMoth;
					fistDay = fistDay < 10 ? "0" + fistDay : fistDay;
					let firstTime = fistYear + "-" + fistMoth + "-" + fistDay;
					let firstTimeLong = '20' + fistYear + "-" + fistMoth + "-" + fistDay;


					let dateTimeList = [];

					for (var i = 0; i < parseInt(dayNum); i++) {

						let res = addDate(firstTimeLong, parseInt(i));
						dateTimeList.push(res);
					}



					let lastDataList = [];
					for (var j = 16; j < resDataList.length; j += 8) {
						let resData = resDataList.substring(j, j + 8);
						let tempData = [];
						for (var i = 0; i < resData.length; i += 2) {
							tempData.push(resData.substring(i, i + 2));
						}
						tempData = tempData.reverse();
						let stringData = tempData.join('');
						let lastData = parseInt(stringData, 16) / 1000;
						lastDataList.push(lastData);
					}

					let count = 0;

					for (var i = 0; i < lastDataList.length / 24; i++) {
						for (var j = 0; j < 24; j++) {
							if (i == 0) {
								count = 0;
							} else {
								count = 24 * i;
							}

							logcat({
								type: "normal-none",
								text: `${dateTimeList[i]}` + " " + String(j) + "时" + ": " + lastDataList[j +
									count]
							});
						}
						// let nextTime = parseInt(i)+1;
						// if(i=="0"){
						// 	logcat({type:"normal",text:`${firstTime}: `+nextTime+"时"+": "+lastDataList[i],flag:"success"}); 
						// }else{
						// 	logcat({type:"normal-none",text:"20-03-25 "+nextTime+"时"+": "+lastDataList[i]}); 
						// }
					}

					// for(var i = 0;i<lastDataList.length/;i++){

					// }
					// 	// logcat({type:"success",text:"111111111111111111111111111111111115555555555555555555555"});
				}
			}
		}
	}
}



/**
 * 发送蓝牙指令
 * @param {Object} params 参数
 * params.dev：Hex 连接的蓝牙设备ID
 * params.cmd：Hex 指令内容，00-开发，01-关阀，210817132345-设置时钟
 * params.mid：Hex 表号
 * params.ver：Hex 协议框架版本，16/17
 * params.idx：Int AES加解密秘钥索引值，-1-不加解密，0-未开户，1-已开户
 * params.ctr：Hex 控制字，84-读数据，85-写数据，87-读记录
 * params.did：Hex 数据对象ID，小端
 * params.txt：Str 指令名称，用于日志输出
 */
const send = function(params) {
	dataFlag = params.did + params.ctr;
	let data = '00000000' + params.cmd;
	keyIdx = params.idx; // 秘钥索引值
	blueCom.cbFunc(CallBack.logcat, {
		type: 'command',
		text: params.txt
	});

	if (params.ciphertext) {
		data = encrpty(data);
	}

	let buffer = frame({
		did: params.did,
		c: params.ctr,
		d: data,
		pfv: params.ver,
		mid: params.mid
	}).toUpperCase();
	console.log('SEND: ' + buffer);
	return {
		deviceId: params.dev,
		buffer: blueCom.hex2ab(buffer)
	};
}

/**
 * 透传指令
 * @param {Object} params 
 */
const report = function(params) {
	console.log('SEND: ' + params.hex);
	dataFlag = 'report'; // 透传功能标识
	return {
		deviceId: params.dev,
		buffer: blueCom.hex2ab(params.hex)
	};
}

const addArrayBuffer = function concatenate(...arrays) {
	let totalLength = 0;
	for (let arr of arrays) {
		totalLength += arr.length;
	}
	let result = new Uint8Array(totalLength);
	let offset = 0;
	for (let arr of arrays) {
		result.set(arr, offset);
		offset += arr.length;
	}
	return result;
}

const addDate = function(date, days) {
	var d = new Date(date);
	d.setDate(d.getDate() + days);
	var m = d.getMonth() + 1;
	return d.getFullYear() + '-' + m + '-' + d.getDate();
}

export default {
	change,
	read,
	send,
	logcat,
	report
}
