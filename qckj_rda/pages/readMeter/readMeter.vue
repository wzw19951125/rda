<template>
	<view class="pages">
		<u-navbar title="抄表" title-color="#FFFFFF" title-size="40" :is-fixed="true" back-icon-color="#FFFFFF"
			:is-back="true" :background="$tools.navbarBg()" />
		<view class="pages" :style="{height: bodyHeight}">
			<view class="fun">
				<view class="function">
					<button style=" width:320rpx; height:90rpx;background-color: #007AFF;"
						@tap="tapReadMid">读表号</button>
					<button style=" width:320rpx; height:90rpx;background-color: #007AFF;"
						@click="goto('/pages/readMeter/usage')">使用量</button>
				</view>
				<view class="function">
					<navigator url="../input/input">
						<button style=" width:320rpx; height:90rpx;background-color: #007AFF;"
							@tap="tapReadmoney">剩余金额</button>
					</navigator>
					<button style=" width:320rpx; height:90rpx;background-color: #007AFF;">抄表日期</button>

				</view>
				<view class="function">
					<button style=" width:320rpx; height:90rpx;background-color: #007AFF;"
						@tap="tapsettlemoney">预结算</button>

				</view>
			</view>




		</view>

	</view>
</template>

<script>
	export default {
		components: {},

		data() {
			return {
				bodyHeight: '', // 页面body的高度
				openFlag: 0, // 开户状态
				deviceId: '', // 蓝牙设备ID，0-length为未连接，否则已连接
				input: '',
				modelList: [{
					name: '16'
				}, {
					name: '17'
				}], // 协议框架版本列表
				modelName: '', // 协议框架版本
			}
		},
		onLoad(res) {
			this.bodyHeight = this.$tools.bodyHeight(0, 0);
			let height = this.bodyHeight.replace('px', ''),
				upx = uni.upx2px(350); //20+90+20+90+20+90+20

		},
		methods: {
			goto(url) {
				uni.navigateTo({
					url: '../../pages/readMeter/usage'
				})
			},
			/**
			 * 读表号
			 */
			tapReadMid() {
				this.$blue.readMid({
					dev: this.deviceId,
					sta: '',
					sec: this.openFlag,
					mid: this.input,
					ver: this.modelName
				});
			},
			/**
			 * 剩余金额
			 */
			tapReadmoney() {
				this.$blue.Readmoney({
					dev: this.deviceId,
					sta: '',
					sec: this.openFlag,
					mid: this.input,
					ver: this.modelName
				});
			},
			/**
			 * 预结算
			 */
			tapsettlemoney() {
				this.$blue.Settlemoney({
					dev: this.deviceId,
					sta: '',
					sec: this.openFlag,
					mid: this.input,
					ver: this.modelName
				});

			}

		}


	}
</script>

<style>
	.pages {
		justify-content: flex-start;
		align-items: flex-start;
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		background-color: #F4F4F4;
	}
.fun{
	display: flex;
	flex-direction:column;
    align-items: center;

	
}
	
	.function {
		display: flex;
		flex-direction: row;
		margin-top: 20rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.function button {
		text-align: center;
		line-height: 90rpx;
		margin-left: 20rpx;
	}
</style>
