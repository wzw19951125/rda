<template>
	<view class="pages">


		<u-navbar title="使用量" title-color="#FFFFFF" title-size="40" :is-fixed="true" back-icon-color="#FFFFFF"
			:is-back="true" :background="$tools.navbarBg()" />
		<view class="pages" :style="{height: bodyHeight}">
				<view class="function">
					<button style=" width:630rpx; height:90rpx;background-color: #007AFF;"
						@tap="hourusage">小时使用量</button>
					<button style=" width:630rpx; height:90rpx;background-color: #007AFF;">日使用量</button>
					<button style=" width:630rpx; height:90rpx;background-color: #007AFF;">月使用量</button>


				</view>
			
			


		</view>

	</view>
</template>

<script>
	export default {


		data() {
			return {
				bodyHeight: '', // 页面body的高度
				
			}
		},
		onLoad(res) {
					this.bodyHeight = this.$tools.bodyHeight(0, 0);
					let height = this.bodyHeight.replace('px', ''),
						upx = uni.upx2px(380); //20+90+30+90+30+90+30
					
				},
		methods: {
			/**
			 * 小时量查询
			 */
			hourusage() {
				this.$blue.readMid({
					dev: this.deviceId,
					sta: '',
					sec: this.openFlag,
					mid: this.input,
					ver: this.modelName
				});
			},


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

	.pages-spinner {
		width: 750rpx;
		height: auto;
		padding-left: 20rpx;
		padding-right: 20rpx;
		padding-top: 20rpx;
		box-sizing: border-box;
	}

	.function {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40rpx;

	}
	.function button{
		margin-bottom: 30rpx;
		text-align: center;
			line-height: 90rpx;
	}
</style>
