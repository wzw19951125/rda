<template>
	<view class="pages">
		<u-navbar title="订单信息" title-color="#FFFFFF" title-size="40" :is-fixed="true" back-icon-color="#FFFFFF"
			:is-back="true" :background="$tools.navbarBg()" />
		<view class="pages" :style="{height: bodyHeight}">
			<view class="pages-spinner">
				<view class="text">
			       <text >订单号：{{data.QueryStamp}}</text></view>
				<view class="text" style="padding-bottom: 40rpx;padding-left: 80rpx;">
					<text>缴费金额:</text>
					<text>￥{{data.money}}</text>
				</view>
				<button class="tapPay" type="primary" @tap="tapWxpay">确认支付</button>

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
				data: {

				} //上个页面传过来的参数
			}
		},
		onLoad(params) {
			this.bodyHeight = this.$tools.bodyHeight(0, 0);
			let height = this.bodyHeight.replace('px', ''),
				upx = uni.upx2px(150);
			this.data = JSON.parse(params.index);
		},

		methods: {
			//确认支付
			tapWxpay() {
				let paycode = this.data.ResultCode;
				if (paycode === 1 ) {
					uni.requestPayment({
					    provider: 'wxpay',
					    timeStamp: String(Date.now()),
					    nonceStr: 'A1B2C3D4E5',
					    package: 'prepay_id=wxe67454b3cfc146c5',
					    signType: 'MD5',
					    paySign: '',
						
		          success: (res) =>{
					        console.log('success:' + JSON.stringify(res));
							uni.showModal({
								title:'充值成功',
								
							})
							// uni.request({
							// url:'http://222.212.93.70:60012/qnms/V1_0_0/account/login',
							// method:'POST',
							// data:{	
							// 	licence:'Const.Libs.LICENCE',
							// 	tokenTime:'1440'
								
							// },
							// 	success: (res) => {
							// 		console.log(res.data);
									
							// 	}
							// })
							
					    },
					    fail: function (res) {
					        console.log('fail:' + JSON.stringify(err));
							uni.showModal({
								title:'充值失败'+res.errMsg
							})
					    }
					});
					
					}

				 else if (paycode !== 1) {
					uni.showToast({
						title: this.data.ResultMsg,

					})
				}




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


	.text {
		font-size: 40rpx;
		padding-bottom: 40rpx;


	}
	.tapPay {
		width: 80%;
		border-radius: 40rpx;
		color: #007AFF;
		margin-top: 50rpx;

	}
</style>
