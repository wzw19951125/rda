// 定义常量

export default {
	bluetooth: {
		error: {
			10000: '未初始化蓝牙适配器',
			10001: '当前蓝牙适配器不可用',
			10002: '没有找到指定设备',
			10003: '连接失败',
			10004: '没有找到指定服务',
			10005: '没有找到指定特征值',
			10006: '当前连接已断开',
			10007: '当前特征值不支持此操作',
			10008: '其余所有系统上报的异常'
		}
	},
	list: {
		ClsLB: [{ // 气表类别
			name: 'C级表',
			type: 'ClsCJ'
		}, {
			name: 'D级表',
			type: 'ClsDJ'
		}, {
			name: '昆仑表',
			type: 'ClsKL'
		}],
		ClsCJ: [{ // C级表
			name: 'NB21',
			uuid: '',
			read: '',
			write: ''
		}, {
			name: 'NB22',
			uuid: '',
			read: '',
			write: ''
		}, {
			name: 'NB23',
			uuid: '',
			read: '',
			write: ''
		}],
		ClsDJ: [ // D级表
		],
		ClsKL: [{ // 昆仑表
			name: 'NBK21',
			uuid: '',
			read: '',
			write: ''
		}, {
			name: 'NBK22',
			uuid: '',
			read: '',
			write: ''
		}, {
			name: 'NBK23',
			uuid: '',
			read: '',
			write: ''
		}],
		
	},



}
