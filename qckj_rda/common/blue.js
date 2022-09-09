// 蓝牙工具类

import blueCJ from './blue-cj.js'

// 错误提示 Key-Value 键值对
var BLUE_ERROR = {
	10000: '未初始化蓝牙适配器',
	10001: '当前蓝牙适配器不可用',
	10002: '没有找到指定设备',
	10003: '连接失败',
	10004: '没有找到指定服务',
	10005: '没有找到指定特征值',
	10006: '当前连接已断开',
	10007: '当前特征值不支持此操作',
	10008: '其余所有系统上报的异常',
	1500104: ''
};

// 主服务UUID以及read和write特征值
var BLUE_CHAR = {};

// 设备的所有服务列表
var BLUE_LIST = [];

// 设备所有服务遍历时的索引值
var BLUE_IDX = 0;

// 是否已停止搜索，true-是，false-否
var BLUE_STOP = false;

// 协议类型
var BLUE_TYPE = '';

var readData = [];

/**
 * 失败的回调方法
 * @param {Object} error
 * @param {String} deviceId
 * @param {function} failure 返回Object类型的{deviceId:'',message:''}对象
 */
const FAIL = function(error, deviceId, failure) {
	console.log(error);
	failure({
		deviceId: deviceId,
		message: BLUE_ERROR[error.errCode]
	});
}

/**
 * 设置协议类型
 * @param {String} type
 * 		C级表：meter_cj
 */
const type = function(type) {
	BLUE_TYPE = type;
}

/**
 * 初始化
 * @param {function} success 成功
 * @param {function} failure 失败
 */
const open = function(success, failure) {
	uni.openBluetoothAdapter({
		success: (data) => success(),
		fail: (error) => FAIL(error, '', failure)
	});
}

/**
 * 搜索（搜索 1 分钟后，停止搜索）
 * @param {function} prepare 准备
 * @param {function} success 成功
 * @param {function} failure 失败
 * @param {function} timeout 结束
 */
const search = function(prepare, success, failure, timeout) {
	uni.startBluetoothDevicesDiscovery({
		fail: (error) => FAIL(error, '', failure),
		success: (res) => found(success)
	});
	prepare({}); // 准备搜索的回调
	BLUE_STOP = false; // 正在搜索
	setTimeout(() => finish(timeout), 1000 * 60);
	
}

/**
 * 监听寻找到新设备的事件（私有方法）
 * @param {function} success 成功
 */
const found = function(success) {
	uni.onBluetoothDeviceFound((res) => {
		let dev = res.devices[0];
		if (dev.name) success(dev);
	});
}

/**
 * setTimeout()方法执行的方法（私有方法）
 * @param {function} timeout 结束
 */
const finish = function(timeout) {
	if (BLUE_STOP) return; // 已停止
	timeout({}); // 结束搜索的回调
	BLUE_STOP = true;
	// 停止搜寻附近的蓝牙外围设备
	uni.stopBluetoothDevicesDiscovery();
}

/**
 * 连接设备
 * 1、未连接，直接连接；
 * 2、已连接，先断再连；
 * @param {Object} devIds 设备ID（devIdOld：已连接的，devIdNew：将要连接的）
 * @param {function} success 成功
 * @param {function} failure 失败
 */
const connect = function(devIds) {
	return new Promise((resolve, reject) => {
		uni.stopBluetoothDevicesDiscovery();
		BLUE_STOP = true;
		let devIdOld = devIds.devIdOld,
			devIdNew = devIds.devIdNew;
		if (0 === devIdOld.length) {
			create(devIdNew, (data) => {
				mtu(devIdNew, resolve, reject);
			}, reject);
		} else {
			close(devIdOld, devIdNew, (data) => {
				mtu(devIdNew, resolve, reject);
			}, reject);
		}
	});
}

/**
 * 创建低功耗蓝牙连接（私有方法）
 * @param {String} devIdNew 设备ID
 * @param {function} success 成功
 * @param {function} failure 失败
 */
const create = function(devIdNew, success, failure) {
	uni.createBLEConnection({
		deviceId: devIdNew,
		success: (data) => success(data),
		fail: (error) => FAIL(error, '', failure)
	});
}

/**
 * 先断开在连接低功耗蓝牙（私有方法）
 * @param {String} devIdOld 设备ID
 * @param {String} devIdNew 设备ID
 * @param {function} success 成功
 * @param {function} failure 失败
 */
const close = function(devIdOld, devIdNew, success, failure) {
	uni.closeBLEConnection({
		deviceId: devIdOld,
		success: (data) => {
			create(devIdNew, success, failure);
		},
		fail: (error) => FAIL(error, devIdOld, failure)
	});
}

/**
 * 设置传送单元（私有方法）
 * @param {Object} devIdNew 设备ID
 * @param {function} success 成功
 * @param {function} failure 失败
 */
const mtu = function(devIdNew, success, failure) {
	if ('ios' === uni.getSystemInfoSync().platform) {
		setTimeout((data) => {
			services(devIdNew, success, failure);
		}, 1000);
		return;
	}
	uni.setBLEMTU({
		deviceId: devIdNew,
		mtu: 220,
		success: (data) => {
			setTimeout((data) => {
				services(devIdNew, success, failure);
			}, 1000);
		},
		fail: (error) => FAIL(error, devIdNew, failure)
	});
}

/**
 * 获取设备的所有服务（私有方法）
 * 服务会有多个，根据服务再获取特征值，确定read、notify、write的特征值
 * @param {String} devIdNew 设备ID
 * @param {function} success 成功
 * @param {function} failure 失败
 */
const services = function(devIdNew, success, failure) {
	uni.getBLEDeviceServices({
		deviceId: devIdNew,
		success: (res) => {
			BLUE_LIST = res.services; // 设备的所有服务
			BLUE_IDX = 0; // 复位索引值
			iterate(devIdNew, success, failure);
		},
		fail: (error) => FAIL(error, devIdNew, failure)
	});
}

/**
 * 迭代循环获取服务以及特征值（私有方法）
 * @param {String} devIdNew 设备ID
 * @param {function} success 成功
 * @param {function} failure 失败
 */
const iterate = function(devIdNew, success, failure) {
	if (BLUE_IDX >= BLUE_LIST.length) { // 无指定服务
		FAIL({
			errCode: 10004
		}, devIdNew, failure);
		return;
	}
	let service = BLUE_LIST[BLUE_IDX++]; // 获取服务对象
	BLUE_CHAR = {}; // 复位主服务UUID及特征值
	if (!service.isPrimary) { // 非主服务，继续迭代
		iterate(devIdNew, success, failure);
		return;
	}
	charact(service.uuid, devIdNew, success, failure);
}

/**
 * 获取设备主服务UUID值，以及read、write、notify特征值（私有方法）
 * @param {String} serviceId 主服务UUID
 * @param {Object} devIdNew 设备ID
 * @param {function} success 成功
 * @param {function} failure 失败
 */
const charact = function(serviceId, devIdNew, success, failure) {
	uni.getBLEDeviceCharacteristics({
		serviceId: serviceId,
		deviceId: devIdNew,
		success: (res) => {
			res.characteristics.forEach((item) => {
				let prop = item.properties;
				if (prop.notify && prop.read) {
					BLUE_CHAR.read = item.uuid;
				}
				if (prop.write) {
					BLUE_CHAR.write = item.uuid;
				}
			});
			BLUE_CHAR.uuid = serviceId;
			let u = BLUE_CHAR.hasOwnProperty('uuid');
			let r = BLUE_CHAR.hasOwnProperty('read');
			let w = BLUE_CHAR.hasOwnProperty('write');
			if (u && r && w) { // 获取到UUID和特征值
				notify(devIdNew, success, failure);
			} else { // 获取特征值失败，继续迭代
				iterate(devIdNew, success, failure);
			}
		},
		fail: (err) => iterate(devIdNew, success, failure)
	});
}

/**
 * 激活notify（私有方法）
 * onBLECharacteristicValueChange
 * notifyBLECharacteristicValueChange
 * @param {Object} devIdNew 设备ID
 * @param {function} success 成功
 * @param {function} failure 失败
 */
const notify = function(devIdNew, success, failure) {
	uni.onBLECharacteristicValueChange((result) => {
		switch (BLUE_TYPE) {
			case 'meter_cj': // C级表
				blueCJ.read(result);
				break;
		}
	});
	uni.notifyBLECharacteristicValueChange({
		characteristicId: BLUE_CHAR.read,
		serviceId: BLUE_CHAR.uuid,
		deviceId: devIdNew,
		state: true,
		success: (data) => success(data),
		fail: (error) => FAIL(error, devIdNew, failure)
	});
}

/**
 * 监听特征值变化的回调
 * @param {Object} devIdNew 设备ID
 * @param {function} success 成功
 */
const change = function(call) {
	switch (BLUE_TYPE) {
		case 'meter_cj': // C级表
			blueCJ.change(call);
			break;
	}
}

/**
 * 日志
 * @param {Object} params
 */
const logcat = function(params) {
	switch (BLUE_TYPE) {
		case 'meter_cj': // C级表
			blueCJ.logcat(params);
			break;
	}
}

/**
 * 发送数据（私有方法）
 * @param {Object} params {deviceId:'设备ID',buffer:'ArrayBuffer'}
 */
const write = function(params) {
	setTimeout(() => {
		uni.writeBLECharacteristicValue({
			serviceId: BLUE_CHAR.uuid,
			deviceId: params.deviceId,
			value: params.buffer,
			characteristicId: BLUE_CHAR.write
		});
	}, 300);
}

/**
 * 发送蓝牙指令
 * @param {Object} params 参数，具体参数请查看对应表的js文件
 * this.$blue.send({
 * 		dev: this.deviceId,
 * 		did: '0100',
 * 		cmd: '01',
 * 		ctr: '85',
 * 		txt: '关阀',
 * 		idx: this.openFlag,
 * 		mid: this.input,
 * 		ver: this.modelName
 * 	});
 */
const send = function(params) {
	switch (BLUE_TYPE) {
		case 'meter_cj': // C级表
			write(blueCJ.send(params));
			break;
	}
}

/**
 * 上报数据
 * @param {Object} params 
 */
const report = function(params) {
	switch (BLUE_TYPE) {
		case 'meter_cj': // C级表
			write(blueCJ.report(params));
			break;
	}
}




/**
 * 读表号
 * @param {Object} params
 */
const readMid = function(params) {}
//****************
/**
 * 剩余金额
 * @param {Object} params
 */
const readMoney = function(params) {}
/**
 * 预结算
 * @param {Object} params
 */
const Settlemoney = function(params) {}
//***************
/**
 * 使用量查询
 * @param {Object} params
 */
const usage = function(params) {}

export default {
	open,
	search,
	connect,
	type,
	change,
	send,
	logcat,
	report,


	readMid,
	readMoney,
	Settlemoney,
	usage

}
