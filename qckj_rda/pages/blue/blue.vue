<template>
	<view class="pages">
		<u-navbar title="连接设备" title-color="#FFFFFF" title-size="40" :is-fixed="true" back-icon-color="#FFFFFF"
			:is-back="true" :background="$tools.navbarBg()" />
		<view class="pages" :style="{height: bodyHeight}">
			<view class="pages-spinner">
				<!-- <yinrh-spinner type="drop" :width="713" :list="clsList" title="气表类别:" @drop="tapDropCls" />
				<view style="width: 100%;height: 10rpx;" />
				<yinrh-spinner type="drop" :width="713" :list="verList" title="气表版本:" @drop="tapDropVer"
					@error="tapErrorVer" ref="uVer" /> -->
				<!-- <view style="width: 100%;height: 10rpx;" /> -->
				<button class="search-nor" hover-class="search-sel" :disabled="searching" @tap="tapSearch">
					{{searching ? '搜索中...' : '搜索'}}
				</button>
			</view>
			<scroll-view class="pages" :style="{height: listHeight}" scroll-y>
				<view v-for="(item, index) in deviceList" :key="index">
					<view class="item" hover-class="item-hover" hover-stay-time="100" @tap="tapConnect(item)">
						<text class="item-title">{{byTitle(item)}}</text>
						<text class="item-label">{{byLabel(item)}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- Toast -->
		<u-toast ref="uToast" />
		<u-modal v-model="modalFlag" :content="modalMsg" :mask-close-able="true" :zoom="true" :show-title="false":show-confirm-button="true" :show-cancel-button="true" @confirm="openSettingsFunc" v-if="modalMsg=='未授权定位权限,是否跳转至设置开启定位权限'" />
		<u-modal v-model="modalFlag" :content="modalMsg" :mask-close-able="true" :zoom="true" :show-title="false" v-if="modalMsg!='未授权定位权限,是否跳转至设置开启定位权限'"/>
	</view>
</template>

<script>
	/**
	 * 蓝牙：选择模组型号、搜索、连接、MTU、监听特征值、Notify
	 * 选择蓝牙模组型号，是为了确定‘蓝牙设备主service的uuid’以及‘读/写的uuid’
	 */
	export default {
		data() {
			return {
				bodyHeight: '', // 页面body的高度
				listHeight: '', // 页面list的高度
				clsList: [], // 类别列表
				clsItem: {}, // 类别对象，当前选择的
				verList: [], // 版本列表
				verItem: {}, // 版本对象，当前选择的
				searching: false, // 搜索标识，true-搜索中


				deviceId: '', // 蓝牙设备ID，0-length为未连接，否则已连接
				deviceList: [], // 蓝牙设备列表
				modalFlag: false, // 弹窗标识，true-显示，false-隐藏
				modalMsg: '' // 弹窗内容
			}
		},
		onLoad(res) {
			this.deviceId = JSON.parse(res.params).deviceId;
			this.clsList = this.$const.list.ClsLB;
			this.bodyHeight = this.$tools.bodyHeight(0, 0);
			// 2022-03-17 注释掉上面的yinrh-spinner组件了
			let height = this.bodyHeight.replace('px', ''),
				upx = uni.upx2px(330-200); // 20+90+10+90+10+90+20
			this.listHeight = (Number(height) - upx) + 'px';
		},
		onUnload() {
			// this.$blue.stop(this.deviceId, null);
		},
		methods: {
			/**
			 * tap事件：搜索设备
			 */
			openSettingsFunc(){
				uni.openSetting({
					success(res) {
						console.log(res);
					}
			})},
			tapSearch() {
				let that = this;
				uni.getSetting({
					success(res) {
						if(res.authSetting["scope.userLocation"]){
							uni.getLocation({
								fail: (res) => {
									that.modalFlag=true;
									that.modalMsg = "定位失败";
								},	
								success: (res) => {
									that.$blue.search((data) => {
										that.searching = true;
										that.deviceList = [];
									}, (device) => {
										that.byDevice(device);
									}, (e) => {
										that.searching = false;
										that.modalFlag = true;
										that.modalMsg = e.message;
									}, (data) => {
										that.searching = false;
									});
								}
							});
						}else{
							that.modalFlag=true;
							that.modalMsg = "未授权定位权限,是否跳转至设置开启定位权限";
						}
					}
				})
			
			},
			/**
			 * 获取数据：发现设备
			 * @param {Object} device
			 */
			byDevice(device) {
				let id = this.deviceList.findIndex((d) => {
					return d.deviceId === device.deviceId;
				});
				if (id == -1) this.deviceList.push(device);
			},
			/**
			 * tap事件：连接设备
			 * @param {Object} item
			 */
			tapConnect(item) {
				uni.showLoading({
					mask: true,
					title: '连接中...'
				});
				this.$blue.connect({
					devIdOld: this.deviceId,
					devIdNew: item.deviceId
				}).then((data) => {
					this.deviceId = item.deviceId;
					uni.$emit('blue-connect', {
						deviceId: item.deviceId,
						name: this.byTitle(item)
					});
					uni.stopBluetoothDevicesDiscovery();
					uni.hideLoading();
					uni.navigateBack();
				}).catch((error) => {
					this.deviceId = error.deviceId;
					this.modalFlag = true;
					uni.hideLoading();
					this.modalMsg = error.message;
				});
			},




			/**
			 * 监听事件：Spinner之选择类别
			 * @param {Object} item
			 */
			tapDropCls(item) {
				this.$refs.uVer.tapLabel('');
				this.clsItem = item;
				this.verItem = {};
				this.verList = this.$const.list[item.type];
			},
			/**
			 * 监听事件：Spinner之选择版本
			 * @param {Object} item
			 */
			tapDropVer(item) {
				this.verItem = item;
				// this.$blue.initial(this.verItem);
			},
			/**
			 * 监听事件：Spinner之错误检测
			 */
			tapErrorVer() {
				this.$toast('请选择气表类别', 'error');
			},
			
			/**
			 * 获取数据：连接状态
			 * @param {Object} item
			 */
			byLabel(item) {
				let hasCon = this.deviceId === item.deviceId;
				return hasCon ? '已连接' : '';
			},
			/**
			 * 获取数据：设备名称
			 * @param {Object} item
			 */
			byTitle(item) {
				if (item.localName) return item.localName;
				return item.name ? item.name : item.deviceId;
			},
		}
	}
</script>

<style>
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
		padding: 20rpx;
		box-sizing: border-box;
	}

	.search-nor {
		width: 710rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 36rpx;
		border-radius: 45rpx;
		box-sizing: border-box;
		background-color: #48A5EB;
		margin-bottom: 10upx;
	}

	.search-nor::after {
		border: none;
	}

	.search-nor[disabled] {
		color: #FFFFFF !important;
		background-color: #D2CFCB !important;
	}

	.search-sel {
		width: 710rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 36rpx;
		border-radius: 45rpx;
		box-sizing: border-box;
		background-color: #D2CFCB;
	}

	.search-sel::after {
		border: none;
	}

	.item {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		width: 100vw;
		height: 90rpx;
		background-color: #FFFFFF;
		border-bottom: 2rpx solid #F4F4F4;
	}

	.item-hover {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		width: 100vw;
		height: 90rpx;
		background-color: #F4F4F4;
	}

	.item-label {
		width: 150rpx;
		height: 90rpx;
		text-align: right;
		line-height: 90rpx;
		padding-right: 32rpx;
		color: #48A5EB;
		font-size: 32rpx;
		box-sizing: border-box;
	}

	.item-title {
		width: 600rpx;
		height: 90rpx;
		text-align: left;
		line-height: 90rpx;
		padding-left: 32rpx;
		color: #333333;
		font-size: 32rpx;
		box-sizing: border-box;
	}
</style>
