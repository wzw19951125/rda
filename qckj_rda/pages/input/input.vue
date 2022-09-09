<template>
	<view class="pages">
	<u-navbar title="使用量" title-color="#FFFFFF" title-size="40" :is-fixed="true" back-icon-color="#FFFFFF"
		:is-back="true" :background="$tools.navbarBg()" />
		<view class="pages" :style="{height: bodyHeight}">
		<view class="pages-spinner" style="padding-top: 10rpx;">
			<view class="pages input">
				<input v-model="input" class="input-mid" placeholder-class="input-mid mid-place"
					placeholder="请输入金额" type="number" maxlength="16"  />
				<view class="input-img">
					<image style="width: 80rpx;height: 50rpx;" mode="aspectFit" @tap="tapClean()"
						src="../../static/login_clean.png" v-if="input" /></view>
						<view class="input-img" >
						<button style="width: 140rpx;height: 60rpx;" type="default" >确定</button></view>
				
			</view>
		</view>
			
		</view>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				bodyHeight: '', // 页面body的高度
				input:'',//搜索框输入
				
				
			}
		},
		onLoad(res) {
			this.bodyHeight = this.$tools.bodyHeight(0, 0);
			let height = this.bodyHeight.replace('px', ''),
				upx = uni.upx2px(350); //20+90+20+90+20+90+20
		
		},
		methods: {
			
		tapClean(){
			this.input='';
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
	.pages-spinner {
		width: 750rpx;
		height: auto;
		padding-left: 20rpx;
		padding-right: 20rpx;
		padding-top: 20rpx;
		box-sizing: border-box;
	}
	.pages.input {
		display: flex;
		flex-direction: row;
		height: 90rpx;
		width: 710rpx;
		border: 2rpx solid #C0C0C0;
		border-radius: 10rpx;
		background-color: #FFFFFF;
	}
	.input-mid {
		width: 440rpx;
		height: 90rpx;
		color: #333333;
		font-size: 34rpx;
		padding-left: 10rpx;
		border-radius: 10rpx;
		box-sizing: border-box;
	}
	
	.input-mid.mid-place {
		color: #888888;
	}
	.input-img {
		justify-content: center;
		align-items: center;
		display: flex;
		flex-direction:column;
		width: 120rpx;
		height: 90rpx;
		box-sizing: border-box;
		
	}
	.input-img button{
		text-align: center;
		line-height: 60rpx;
	}
</style>

 