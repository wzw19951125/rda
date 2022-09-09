<template>
	<view class="pages">
		<u-navbar title-color="#FFFFFF" :is-fixed="true" back-icon-color="#FFFFFF" :is-back="true"
			:background="$tools.navbarBg()">
			<view class="solt">
				<text @tap="openChooseWacth()" style="color: #FFFFFF;">{{blueType==0?'蓝牙水表':'蓝牙燃气表'}}</text>
				<uni-icons :type="openChooseFlag?'top':'bottom'" size="20" color="#FFFFFF;" @tap="openChooseWacth()">
				</uni-icons>
			</view>
		</u-navbar>
		<view class="pages" :style="{height: heightAll}">
			<!-- 功能区 -->
			<scroll-view class="pages" :style="{height: heightFun}" scroll-y="true">
				<!-- 连接设备：检验是否初始化 -->
				<view class="pages-spinner">
					<yinrh-spinner ref="uDevice" type="jump" :width="710" title="连接设备:" @jump="blueCheck" />
				</view>
				<!-- 输入表号 -->
				<view class="pages-spinner" style="padding-top: 10rpx;">
					<view class="pages input">
						<input v-model="meterId" class="input-mid" placeholder-class="input-mid mid-place"
							placeholder="请输入表号" type="number" maxlength="16" />
						<view class="input-img">
							<image style="width: 50rpx;height: 50rpx;" mode="aspectFit" @tap="cleanMeterId()"
								src="../../static/login_clean.png" v-if="meterId" />
						</view>
						<view class="input-img">
							<image style="width: 50rpx;height: 50rpx;" mode="aspectFit" @tap="scanMeterId()"
								src="../../static/index_scan.png" />
						</view>
					</view>
				</view>
				<!-- 按钮：充值 -->
				<rda-button :title="['充值','','']" :number="1" @click="rdaBtnOne" />
				<!-- 按钮：激活通信 -->
				<rda-button :title="[showButtonTitle(),'','']" :number="1" @click="setTimeMethod(rdaBtnTwo)" />
				<!-- <rda-button :title="['改表身号','','']" :number="1" @click="sendChangeID" /> -->
				<!-- 按钮：地址配置 -->
				<rda-button :title="['地址配置','','']" :number="1" @click="rdaBtnThr" />
				<!-- <rda-button :title="['每小时用量','','']" :number="1" @tap="rdaBtnFive" /> -->
			</scroll-view>
			<!-- 日志区 -->
			<view class="pages" :style="{height: heightLog}">
				<view class="pages logcat" style="flex-direction: row;border-bottom: 2rpx solid #C0C0C0;">
					<text class="logcat-title">操作日志</text>
					<view class="pages clean">
						<button class="logcat-clean" hover-class="logcat-clean-hover" @tap="logcatList = []">
							清除
						</button>
					</view>
				</view>
				<scroll-view class="pages logcat" :style="{height: heightLst}" :scroll-into-view="scrollInto"
					scroll-y="true">
					<view v-for="(item, index) in logcatList" :key="index">
						<rda-text :type="item.type" :flag="item.flag" :text="item.text" />
					</view>
					<view id="scroll-to-bottom" style="width: 750px;height: 1px;background-color: #FFFFFF;" />
				</scroll-view>
			</view>
		</view>



		<u-popup v-model="openChooseFlag" mode="top" border-radius="10">
			<!-- <view style=" width: 60vw; border-radius: 30px;"> -->
			<view :style="{height:statusHeight+'px'}">
				<u-navbar title-color="#FFFFFF" :is-fixed="true" back-icon-color="#FFFFFF" :is-back="true"
					:background="$tools.navbarBg()">
					<view class="solt">
						<text @tap="openChooseWacth()" style="color: #FFFFFF;">{{blueType==0?'蓝牙水表':'蓝牙燃气表'}}</text>
						<uni-icons :type="openChooseFlag?'top':'bottom'" size="20" color="#FFFFFF;"
							@tap="openChooseWacth()"></uni-icons>
					</view>
				</u-navbar>
			</view>
			<view @click="chooseBlueType(0) "
				style="padding: 10px; color: black; background: white;height: 60px;  width: 100vw; align-items: center; justify-content: space-between; display: flex; font-size: 20px;">
				<text> 蓝牙水表</text>
				<uni-icons type="checkmarkempty" size="20" color="black;" v-if="blueType==0"></uni-icons>
			</view>
			<view style="border: 1px solid #CEC9C9;">
			</view>
			<view @click="chooseBlueType(1)"
				style="padding: 10px; color: black; background: white;height: 60px;  width: 100vw; align-items: center; justify-content: space-between; display: flex; font-size: 20px;">
				<text> 蓝牙燃气表</text>
				<uni-icons type="checkmarkempty" size="20" color="black;" v-if="blueType==1"></uni-icons>
			</view>


			<!-- <button type="default" @click="chooseBlueType(0) ">蓝牙水表</button>
				<button type="default" @click="chooseBlueType(1)">蓝牙燃气表</button> -->
			<!-- </view> -->
		</u-popup>



		<u-popup v-model="visible" mode="bottom">
			<view class="button-row">
				<button type="default" class="button-style" @click="popCancel">取消</button>
				<button type="default" class="button-style" @click="popChoose" v-if="errorTimeFlag">确定</button>
			</view>
			<view class="picker-center">
				<picker-view indicator-style="indicatorStyle" :value="value" @change="bindChange" class="picker-view">
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in years" :key="index">{{item}}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in months" :key="index">{{item}}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in days" :key="index">{{item}}日</view>
					</picker-view-column>
					<picker-view-column>
					 <view class="picker-item" v-for="(item,index) in dayTime" :key="index" v-if="errorTimeFlag">
							{{item}}天数</view>
					</picker-view-column>
				</picker-view>
			</view>
		</u-popup>
		<u-toast ref="uToast" />
		<u-modal v-model="modalFlag" :content="modalMessage" mask-close-able :zoom="true" :show-title="false" :show-confirm-button="true" :show-cancel-button="true" @confirm="openSettingsFunc" v-if="modalMessage=='未授权蓝牙权限,是否跳转至设置开启蓝牙权限'"/>
		<u-modal v-model="modalFlag" :content="modalMessage" mask-close-able :zoom="true" :show-title="false" v-if="modalMessage!='未授权蓝牙权限,是否跳转至设置开启蓝牙权限'"/>
	</view>
</template>

<script>
	/**
	 * 首页
	 * 2021-07-26：
	 * 1、连接蓝牙设备，并判断主服务UUID，以及读写特征值
	 * 2、选择气表类型，用于区分与气表通信的协议
	 */
	import rdaButton from '../../components/view/rda-button.vue'
	import rdaText from '../../components/view/rda-text.vue'


	export default {
		components: {
			rdaButton,
			rdaText,

		},
		data() {
			let date = new Date()
			let years = []
			let year = date.getFullYear()
			let months = []
			let month = date.getMonth() + 1
			let days = []
			let day = date.getDate()
			let dayTime = [1, 2, 3]

			month = month < 10 ? "0" + month : month;
			day = day < 10 ? "0" + day : day;
			let res2 = year + '' + month + '' + day;



			for (let i = 2000; i <= date.getFullYear(); i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			for (let i = 1; i <= 31; i++) {
				days.push(i)
			}



			return {
				range: [],
				heightAll: '0px', // 页面body的高度
				heightFun: '0px', // 页面功能的高度
				heightLog: '0px', // 页面日志的高度
				heightLst: '0px', // 日志列表的高度
				heightPad: '0px', // 页面日志的间距
				itemWidth: '', // 按钮的宽度
				deviceId: '', // 蓝牙设备ID，0-length为未连接，否则已连接
				meterId: '', // 表号 11011300000015 1011001000004674 1011000000005430
				openFlag: 1, // 开户状态，0-未开户，1-已开户
				modelName: '17', // 协议框架版本
				modelList: [{
					name: '16'
				}, {
					name: '17'
				}], // 协议框架版本列表
				openList: [{
					name: '是',
					flag: 1
				}, {
					name: '否',
					flag: 0
				}], // 开户状态
				logcatList: [], // 日志列表
				scrollInto: '', // 日志跳转到最底部
				modalFlag: false, // 弹窗标识，true-显示，false-隐藏
				modalMessage: '', // 弹窗内容
				dateNum: '',
				stratDate: '',
				endDate: '',
				firstDate: '',
				lastDate: '',
				visible: false,
				value: [, , ],
				indicatorStyle: `height: 50px;`,
				years,
				months,
				days,
				dayTime,
				firstDateLong: '',
				logcatFirstTime: '',
				errorTimeFlag: false,
				openChooseFlag: false, // 打开是true 关闭false
				blueType: 0,
				statusHeight: 0, // 状态栏 + navbar(默认44px)高度 
				canClickButton: true
				// chooseTime,
			}
		},
		onLoad() {
			// this.years = Date.getFullYear();
			// this.month = date.getMonth() + 1;
			// this.day = date.getDate();
			this.heightAll = this.$tools.bodyHeight(0, 0);
			let temp = this.heightAll.replace('px', '');
			// heightFun + heightLog = heightAll
			this.heightLog = '300px';
			// heightLst + 100upx = 300px
			let upx100 = uni.upx2px(100);
			this.heightLst = (300 - upx100) + 'px';
			this.heightFun = (Number(temp) - 300) + 'px';
			uni.$on('blue-connect', (data) => {
				this.meterId = data.name;
				this.deviceId = data.deviceId;
				this.$refs.uDevice.tapLabel(data.name);
				this.NoticeConnection();
			});
			uni.$on('pay-success', (data) => {
				this.byLogcat('success', '成功');
			});
			this.$blue.type('meter_cj'); // C级表
			this.$blue.change({
				logcat: (data) => this.cbLogcat(data),
				report: (hex) => this.cbReport(hex),
			});
			let sw = uni.getSystemInfoSync().screenWidth;
			let upx = uni.upx2px(10);
			this.itemWidth = ((sw - upx) / 4 - upx) + 'px';

			this.GetStatusBarHeight();
			
			uni.authorize({
				scope:"scope.bluetooth",
				success(res) {
					console.log(res);
				},
				fail(res){
					console.log(res);
				}
			});
			
			
			uni.authorize({
				scope:"scope.userLocation",
				success(res) {
					console.log(res);
				},
				fail(res){
					console.log(res);
				}
			});
			
			// this.$blue.open(() => {
			// 	console.log("获取蓝牙权限成功");
			// }, (error) => {
			// 	console.log("获取蓝牙权限失败");
			// });
			
			// uni.getLocation({
			// 	fail: (res) => {
			// 		console.log("获取定位权限失败");
			// 	},	
			// 	success: (res) => {
			// 		console.log("获取定位权限成功");
			// 	}
			// });
		},
		onUnload() {
			uni.$off('pay-success');
			uni.$off('blue-connect');
		},
		methods: {
			openSettingsFunc(){
				uni.openSetting({
					success(res) {
						console.log(res);
					}
			})},
			GetStatusBarHeight() {
				let that = this;
				wx.getSystemInfo({
					success: function(res) {
						that.statusHeight = res.statusBarHeight + 44; //状态栏的高度+navbar高度
					},
				});
			},
			bindChange: function(e) {
				// let res2=JSON.stringify(e);

				const val = e.detail.value;
				// console.log(val);
				// console.log( this.years[val[0]]);
				let month = this.months[val[1]];
				let day = this.days[val[2]];
				let dayNum = val[3];
				console.log(this.dayTime[dayNum]);

				let lastResDay = String(this.years[val[0]]).substring(2, 4);
				var dateRes = new Date();
				console.log("--------------", dateRes.getFullYear());
				console.log("--------------", dateRes.getMonth() + 1);
				console.log("--------------", dateRes.getDate());

				console.log("+++++++++++++", this.years[val[0]]);
				console.log("+++++++++++++", this.months[val[1]]);
				console.log("+++++++++++++", this.days[val[2]]);

				let dayData = [];


				let yearVal = this.years[val[0]];
				let monthVal = this.months[val[1]];



				if ((yearVal % 4 == 0 && yearVal % 100 != 0) || yearVal % 400 == 0) {
					console.log("闰年");
					if (monthVal == 2) {
						console.log("闰年2月")
						for (let k = 1; k <= 29; k++) {
							console.log("闰年2月添加: ", k);
							dayData.push(k)
						}
					} else if (monthVal == 4 || monthVal == 6 || monthVal == 11 || monthVal == 9) {
						for (let k = 1; k <= 30; k++) {
							dayData.push(k)
						}
					} else {
						for (let k = 1; k <= 31; k++) {
							dayData.push(k)
						}
					}
				} else {
					console.log("平年");
					if (monthVal == 2) {
						console.log("平年2月")
						for (let k = 1; k <= 28; k++) {
							console.log("平年2月添加: ", k);
							dayData.push(k)
						}
					} else if (monthVal == 4 || monthVal == 6 || monthVal == 11 || monthVal == 9) {
						for (let k = 1; k <= 30; k++) {
							dayData.push(k)
						}
					} else {
						for (let k = 1; k <= 31; k++) {
							dayData.push(k)
						}
					}
				}

				if (yearVal == dateRes.getFullYear()) {
					console.log("dateRes.getMonth()+1: ", dateRes.getMonth() + 1);
					this.months = [];
					for (var i = 1; i <= dateRes.getMonth() + 1; i++) {
						this.months.push(i);
					}

					if (dateRes.getMonth() + 1 == monthVal) {
						dayData = [];

						for (var i = 1; i <= dateRes.getDate(); i++) {
							dayData.push(i);
						}
					}
				}

				// if(yearVal==dateRes.getFullYear()){
				// 	for(var i= 1;i<=dateRes.getMonth()+1;i++){
				// 		monthData.push(i);
				// 	}

				// 	if(dateRes.getMonth()+1 == this.months[val[1]] ){
				// 		for(var i= 1;i<=dateRes.getDate();i++){
				// 			dayData.push(i);
				// 		}
				// 	}else{
				// 		for (let i = 1; i <= 31; i++) {
				// 		    dayData.push(i)
				// 		}
				// 	}
				// }else{
				// 	for (let i = 1; i <= 12; i++) {
				// 	    monthData.push(i)
				// 	}
				// 	for (let i = 1; i <= 31; i++) {
				// 	    dayData.push(i)
				// 	}
				// }
				// console.log("数据打印monthData: ", monthData);
				console.log("数据打印dayData: ", dayData);
				// this.months = monthData;
				this.days = dayData;

				// if()


				// if(lastResDay==)
				this.logcatFirstTime = `${String(this.years[val[0]])}-${month}-${day}`
				month = month < 10 ? "0" + month : month;
				day = day < 10 ? "0" + day : day;

				this.startDate = `${lastResDay}${month}${day}`;
				this.firstDate = `${lastResDay}-${month}-${day}`;
				this.firstDateLong = `${String(this.years[val[0]])}-${month}-${day}`;

				// let res111 = new Date(`${this.years[val[0]]}`,`${this.years[val[0]]}`,`${this.days[val[2]]}`,)
				let monthsData = '';
				let daysData = '';
				if (this.months[val[1]] < 10) {
					monthsData = "0" + this.months[val[1]];
				} else {
					monthsData = String(this.months[val[1]]);
				}
				if (this.days[val[2]] < 10) {
					daysData = "0" + this.days[val[2]];
				} else {
					daysData = String(this.days[val[2]]);
				}

				let res222 = `${this.years[val[0]]}-${monthsData}-${daysData}T08:00`;



				let currentTime = new Date();


				let compare = this.judgeTime(res222.replace(/-|T|:/g, ''));


				if (compare == 0) {
					// this.byLogcat('failure', '选择日期=当前日期');
					this.dayTime = [1];
					this.errorTimeFlag = true;
				} else if (compare < 0) {
					// this.byLogcat('failure', '选择日期>当前日期');
					console.log('日期错误');
					this.dayTime = [''];
					this.errorTimeFlag = false;
				} else if (compare == 1) {
					this.dayTime = [1, 2];
					this.errorTimeFlag = true;
				} else if (compare == 2) {
					this.dayTime = [1, 2, 3];
					this.errorTimeFlag = true;
				} else {
					this.dayTime = [1, 2, 3];
					this.errorTimeFlag = true;
				}

				this.dateNum = '0' + String(this.dayTime[dayNum]);

				// console.log("yyyyyy: ",this.dateNum);
				// console.log(firstDateLong);
				// console.log(this.dayTime[dayNum]);
				this.lastDate = this.addDate(this.firstDateLong, parseInt(this.dayTime[dayNum]) - 1);

			},
			addDate(date, days) {
				var d = new Date(date);
				d.setDate(d.getDate() + days);
				var m = d.getMonth() + 1;
				return d.getFullYear() + '-' + m + '-' + d.getDate();
			},
			openChooseWacth() {
				this.openChooseFlag = !this.openChooseFlag;
				// this.$refs.popup.open('top');
			},
			chooseBlueType(type) {
				this.blueType = type;
				this.openChooseFlag = false;
			},

			// 判断是否为当天
			judgeTime(data) {
				console.log("判断");
				var date = data.toString();
				var year = date.substring(0, 4);
				var month = date.substring(4, 6);
				var day = date.substring(6, 8);
				var d1 = new Date(year + '/' + month + '/' + day);
				var dd = new Date();
				var y = dd.getFullYear();
				var m = dd.getMonth() + 1;
				var d = dd.getDate();
				var d2 = new Date(y + '/' + m + '/' + d);
				var iday = parseInt(d2 - d1) / 1000 / 60 / 60 / 24;
				return iday;
			},
			// 监听蓝牙连接状态
			NoticeConnection() {
				uni.onBLEConnectionStateChange((res) => {
					if (res.connected == false) {
						this.deviceId = '';
						this.$refs.uDevice.tapLabel('');
						this.meterId = '';
						uni.closeBluetoothAdapter();
					};
				});
			},
			// 回调：日志
			cbLogcat(data) {
				if (100 === this.logcatList.length)
					this.logcatList = [];
				this.logcatList.push(data);
				this.$nextTick(() => {
					this.scrollInto = 'scroll-to-bottom';
				});
				this.scrollInto = '';
			},
			// 回调：透传
			cbReport(hex) {
				if ('0130' === hex.substring(44, 48)) {
					this.byLogcat('success', '成功');
				} else {
					this.$http.report({
						meterId: this.meterId,
						value: hex
					}).then((cmd) => {
						// 延时发送指令
						setTimeout(() => {
							this.$blue.report({
								dev: this.deviceId,
								hex: cmd
							});
						}, 500);
					}).catch((error) => {
						this.$toast(error);
						this.byLogcat('failure', '失败');
					});
				}
			},
			// 输出：日志
			byLogcat(type, text) {
				this.$blue.logcat({
					type: type,
					text: text
				});
			},
			// 选择版本
			dropModel(item) {
				this.modelName = item.name;
			},
			// 是否开户
			dropOpen(item) {
				this.openFlag = item.flag;
			},
			// 清空表号
			cleanMeterId() {
				this.meterId = '';
			},
			showNavBarTitle() {
				if (this.blueType == 0) {
					return "蓝牙水表";
				} else if (this.blueType == 1) {
					return "蓝牙燃气表";
				} else {
					return "秦川表具";
				}
			},
			showButtonTitle() {
				if (this.blueType == 0) {
					return "同步指令";
				} else if (this.blueType == 1) {
					return "抄表";
				} else {
					return "秦川表具";
				}
			},

			// 扫一扫添加表号
			scanMeterId() {
				uni.scanCode({
					success: (res) => {
						this.meterId = res.result;
					},
					fail: (error) => {
						this.meterId = '';
						this.$toast('扫码失败', '');
					}
				});
			},
			// 查询应缴费用
			rdaBtnOne(index) {
				if (!this.meterId) {
					this.byLogcat('failure', '请输入表号');
				} else {
					this.byLogcat('command', '充值');
					this.$navigateTo({
						data: {
							meterId: this.meterId
						},
						path: '/pages/pay/customer'
					});
				}
			},
			// 激活通信，发送3004，开启透传
			rdaBtnTwo(index) {
				if (!this.deviceId) {
					this.byLogcat('failure', '请连接蓝牙设备');
					return;
				}
				if (!this.meterId) {
					this.byLogcat('failure', '请输入表身号');
					return;
				}
				if (!this.modelName) {
					this.byLogcat('failure', '请选择协议版本');
					return;
				}
				if (-1 === this.openFlag) {
					this.byLogcat('failure', '请选择开户状态');
					return;
				}
				console.log("++++++++++++++");
				console.log(this.$refs.uDevice.label);
				if (this.$refs.uDevice.label != this.meterId) {
					this.byLogcat('failure', '连接的蓝牙设备与表号不一致');
					return;
				}
				this.sendSyncCmd(); // 直接发送 3004 指令
			},
			rdaBtnThr(index) {
				this.$navigateTo({
					data: {
						meterId: this.meterId
					},
					path: '/pages/server/server'
				});
			},
			setTimeMethod(callback) {
				if (!this.canClickButton) {
					return;
				}
				this.canClickButton = false;
				setTimeout(() => {
					callback();

					this.canClickButton = true;
				}, 2000);
			},
			rdaBtnFour() {
				if (!this.deviceId) {
					this.byLogcat('failure', '请连接蓝牙设备');
					return;
				}
				if (!this.meterId) {
					this.byLogcat('failure', '请输入表身号');
					return;
				}
				if (!this.modelName) {
					this.byLogcat('failure', '请选择协议版本');
					return;
				}
				if (-1 === this.openFlag) {
					this.byLogcat('failure', '请选择开户状态');
					return;
				}

				this.sendReadHoursAction(); // 发送读每小时使用量日志
				// this.$navigateTo({
				// 	data:{
				// 		detailName : '使用量详情',
				// 	},
				// 	path:"/pages/detail/detail"
				// });
			},

			rdaBtnFive() {
				this.visible = true;
			},
			// 发送 3004 透传指令
			sendSyncCmd() {
				this.$blue.send({
					dev: this.deviceId,
					did: '0430',
					cmd: '',
					ctr: '84',
					txt: this.blueType == 0 ? '同步指令' : '抄表',
					idx: this.openFlag,
					mid: this.meterId,
					ver: this.modelName,
					ciphertext: true,
				});
			},
			// 修改表身号
			sendChangeID() {
				this.$blue.send({
					dev: this.deviceId,
					did: '1420',
					cmd: '1011001000007654',
					ctr: '85',
					txt: "修改表身号",
					mid: this.meterId,
					ver: this.modelName,
					idx: this.openFlag,
					ciphertext: false,
				});
			},
			// 读每小时使用量日志
			sendReadHoursAction() {
				console.log("kkkk:", this.dateNum + this.startDate);
				this.$blue.send({
					dev: this.deviceId,
					did: '0210',
					cmd: this.dateNum + this.startDate,
					ctr: '87',
					txt: `读每小时使用量----${this.logcatFirstTime}至${this.lastDate}`,
					idx: this.openFlag,
					mid: this.meterId,
					ver: this.modelName,
				});
			},
			// 格式化日期
			format(date) {
				let y = date.getFullYear(),
					m = date.getMonth() + 1,
					d = date.getDate(),
					h = date.getHours(),
					M = date.getMinutes(),
					s = date.getSeconds();
				y = y.toString().substring(2, 4);
				if (m < 10) m = '0' + m;
				if (d < 10) d = '0' + d;
				if (h < 10) h = '0' + h;
				if (M < 10) M = '0' + M;
				if (s < 10) s = '0' + s;
				return y + m + d + h + M + s;
			},
			// 初始化蓝牙设备
			blueCheck() {
				// console.log("00000000000000000");
				let that =this;
				uni.getSetting({
					success(res) {
						console.log(res);
						if(res.authSetting["scope.bluetooth"]){
							that.$blue.open(() => {
								that.$navigateTo({
									data: {
										deviceId: that.deviceId
									},
									path: '/pages/blue/blue'
								});
							}, (error) => {
								console.log(error);
								that.modalFlag = true;
								that.modalMessage = error.message;
							});
						}else{
							that.modalFlag = true;
							that.modalMessage = "未授权蓝牙权限,是否跳转至设置开启蓝牙权限";
						}
					}
				})
			},

			popCancel() {
				this.visible = false;
			},
			popChoose() {
				console.log(this.dateNum);
				if (this.dateNum == "0请选择正确") {
					this.byLogcat('failure', '日期选择错误')
					this.visible = false;
				} else {
					this.visible = false;
					console.log("正确时间");
					this.rdaBtnFour();
				}
				// this.rdaBtnFour();
			}
		}
	}
</script>

<style scoped lang="scss">
	.pages {
		justify-content: center;
		align-items: flex-start;
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		background-color: #F4F4F4;
	}

	.pages-spinner {
		width: 750rpx;
		height: auto;
		padding-left: 20rpx;
		padding-right: 20rpx;
		padding-top: 20rpx;
		box-sizing: border-box;
	}

	.pages.input {
		flex-direction: row;
		height: 90rpx;
		width: 710rpx;
		border: 2rpx solid #C0C0C0;
		border-radius: 10rpx;
		background-color: #FFFFFF;
	}

	.pages-chooseWatch {
		display: flex;
		align-items: center;

	}

	.input-mid {
		width: 540rpx;
		height: 90rpx;
		color: #333333;
		font-size: 34rpx;
		padding-left: 10rpx;
		border-radius: 10rpx;
		box-sizing: border-box;
	}

	.radio-mid {
		width: 180rpx;
		height: 82rpx;
		text-align: center;
		line-height: 82rpx;
		color: #333333;
		font-size: 34rpx;
		box-sizing: border-box;
		background-color: #F4F4F4;
	}



	.input-mid.mid-place {
		color: #888888;
	}

	.input-img {
		justify-content: center;
		align-items: center;
		display: flex;
		flex-direction: column;
		width: 80rpx;
		height: 90rpx;
		box-sizing: border-box;
	}

	.pages.logcat {
		width: 750rpx;
		background-color: #FFFFFF;
	}

	.logcat-title {
		width: 550rpx;
		height: 100rpx;
		padding-left: 20rpx;
		text-align: left;
		line-height: 100rpx;
		color: #333333;
		font-size: 34rpx;
		box-sizing: border-box;
	}

	.pages.clean {
		align-items: center;
		width: 200rpx;
		height: 100rpx;
		padding-right: 20rpx;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
		background-color: #FFFFFF;
	}

	.logcat-clean {
		width: 180rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 32rpx;
		border: 0 none;
		background-color: #48A5EB;
	}

	.logcat-clean::after {
		border: none;
	}

	.logcat-clean-hover {
		width: 160rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 32rpx;
		border: 0 none;
		background-color: #439CDB;
	}

	.logcat-clean-hover::after {
		border: none;
	}

	.logcat-command {
		justify-content: center;
		align-items: center;
		display: flex;
		flex-direction: row;
		width: 750rpx;
		height: 90rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-bottom: 2rpx solid #E4E7ED;
	}

	.logcat-command.line {
		border-bottom: 2rpx solid #C0C0C0;
	}

	.command-title {
		width: 120rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: left;
		padding-left: 20rpx;
		color: #555555;
		font-size: 32rpx;
		box-sizing: border-box;
	}

	.command-text {
		width: 630rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: left;
		padding-right: 20rpx;
		color: #333333;
		font-size: 32rpx;
		box-sizing: border-box;
	}

	.command-text.success {
		color: #48A5EB;
	}

	.command-text.failure {
		color: #FA3534;
	}

	.picker-view {
		width: 750rpx;
		height: 600rpx;
		margin-top: 20rpx;
	}

	.button-row {
		display: flex;
		// align-items: center;
		flex-direction: row;
		justify-content: space-between;
		width: 100vw;
		height: 90rpx;
		background-color: #FFFFFF;
		border-bottom: 2rpx solid #F4F4F4;
	}

	.button-style {
		// width:350rpx;
		height: 85rpx;
		line-height: 85rpx;
		text-align: center;
		color: #48A5EB;
		font-size: 34rpx;
		// border: 0 none;
		// border-radius: 10rpx;
		background-color: #FFFFFF;
		margin-left: 0rpx;
		margin-right: 0rpx;
		// border: none;
	}

	.button-style::after {
		border: none;
	}


	// .pages-date-picker{
	// 	position:fixed;
	// 	bottom: 20rpx ;

	// }
	.solt {
		padding-left: 200rpx;
		justify-content: center;
		display: flex;
		align-items: center;
		font-size: 40rpx;
		flex-direction: row;
		// color: white;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		// flex: 1;
		/* 如果您想让slot内容与导航栏左右有空隙 */
	}

	.picker-center {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
	}

	.picker-item {
		height: 50px;
		align-items: center;
		// justify-content: center;
		text-align: center;
	}

	.dropdown {
		width: 100vw;
		flex-direction: row;
		display: flex;
	}
</style>
