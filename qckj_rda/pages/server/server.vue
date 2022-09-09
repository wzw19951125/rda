<template>
	<view class="pages">
		<u-navbar title="地址配置" title-color="#FFFFFF" title-size="40" :is-fixed="true" back-icon-color="#FFFFFF"
			:is-back="true" :background="$tools.navbarBg()" />
		<view class="pages" :style="{height: heightAll}">
			<view style="width: 750rpx;height: 2rpx;" />
			<text class="text-value" :style="{'color':color('http://222.212.93.70:60094')}"
				@click="saveIp('http://222.212.93.70:60094')">http://222.212.93.70:60094\n牟建川</text>
			<view style="width: 750rpx;height: 2rpx;" />
			<text class="text-value" :style="{'color':color('http://172.16.108.31:60142')}"
				@click="saveIp('http://172.16.108.31:60142')">http://172.16.108.31:60142\n李丽平</text>
			<view style="width: 750rpx;height: 2rpx;" />
			<text class="text-value" :style="{'color':color('https://lysb7.qc91.cdqckj.com')}"
				@click="saveIp('https://lysb7.qc91.cdqckj.com')">http://lysb7.qc91.cdqckj.com\n杨忠平1</text>
			<view style="width: 750rpx;height: 2rpx;" />
			<text class="text-value" :style="{'color':color('http://222.212.93.70:51137')}"
				@click="saveIp('http://222.212.93.70:51137')">http://222.212.93.70:51137\n杨忠平2</text>
			<view style="width: 750rpx;height: 2rpx;" />
			<text class="text-value" :style="{'color':color('http://222.212.93.70:60133')}"
				@click="saveIp('http://222.212.93.70:60133')">http://222.212.93.70:60133\n外网环境</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				heightAll: '0px', // 页面body的高度
				ip: '', // 选中的地址
			}
		},
		onLoad() {
			this.heightAll = this.$tools.bodyHeight(0, 0);
			this.ip = uni.getStorageSync('server_ip_port');
		},
		methods: {
			saveIp(ip) {
				uni.setStorageSync('server_ip_port', ip);
				uni.navigateBack();
			},
			color(ip) {
				return this.ip === ip ? '#48A5EB' : '#555555';
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

	.text-value {
		background-color: #FFFFFF;
		width: 750rpx;
		height: 90rpx;
		line-height: 40rpx;
		text-align: left;
		font-size: 30rpx;
		padding-left: 20rpx;
		color: #555555;
		padding-top: 5rpx;
		padding-bottom: 5rpx;
		box-sizing: border-box;
	}
</style>
