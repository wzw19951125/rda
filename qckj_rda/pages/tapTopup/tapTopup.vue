<template>
	<view class="pages">
		<u-navbar title="充值缴费" title-color="#FFFFFF" title-size="40" :is-fixed="true" back-icon-color="#FFFFFF"
			:is-back="true" :background="$tools.navbarBg()" />
		<view class="pages" :style="{height: bodyHeight}">
			<view class="pages-spinner" style="padding-top: 10rpx;">
				<view class="pages input">
					<input v-model="input" class="input-mid" placeholder-class="input-mid mid-place"
						placeholder="请输入缴费编号" type="number" maxlength="10" />
					<view class="input-img">
						<image style="width: 80rpx;height: 50rpx;" mode="aspectFit" @tap="tapClean()"
							src="../../static/login_clean.png" v-if="input" />
					</view>
				</view>
				<view class="pages input">
					<input v-model="inputMoney" class="input-mid" placeholder-class="input-mid mid-place"
						placeholder="请输入缴费金额" type="number" maxlength="16" />
					<view class="input-img">
						<image style="width: 80rpx;height: 50rpx;" mode="aspectFit" @tap="tapMoneyclean()"
							src="../../static/login_clean.png" v-if="inputMoney" />
					</view>
				</view>


				<button type="primary" @click="tapOrder">确定</button>


			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bodyHeight: '', // 页面body的高度
				input: '', //输入编号
				inputMoney: '', //输入金额

			}
		},
		onLoad(res) {
			this.bodyHeight = this.$tools.bodyHeight(0, 0);
			let height = this.bodyHeight.replace('px', ''),
				upx = uni.upx2px(350);


		},
		methods: {
			tapClean() {
				this.input = '';
			},
			tapMoneyclean() {
				this.inputMoney = '';
			},
			//下单接口
			tapOrder() {
				let data = JSON.stringify({
					OPType: 5,
					PayCode: '00000018', //
					PreGas: '0',
					PreSave: '1',
					OtherMoney: '0',
					AllMoney: '2',
					TellerNumber: '0',
					PayType: '1',
					OrganCode: '',
					ChargeRate: '0'

				});
				let paycode = this.input;
				let presave = this.inputMoney;
				if (paycode === '' && presave !== '') {
					uni.showModal({
						title: '输入信息不完整',
						content: '请输入编号',
						showCancel: false,
						success: function(res) {
							console.log('点击确定');

						}

					})
				} else if (presave === '') {
					uni.showModal({
						title: '输入信息不完整',
						content: '请输入金额',
						showCancel: false,

					})
				} else if (paycode === '' && presave === '') {
					uni.showModal({
						title: '请输入充值信息',
						showCancel: false,

					})
				}
				// 输入PayCode、输入金额
				uni.request({
					url: 'http://172.16.108.83:11353/basic/remoteinterface/ServiceInterface.ashx?Data=' + data,
					method: 'GET', //请求方式  或GET，必须为大写
					success: res => {
						// res.statusCode === 200
						// data = res.data, data.ResultCode, 1-成功
						console.log(res);
						let that = this;
						let data = res.data;

						// console.log(res.statusCode);
						// console.log(data.ResultCode);
						if (data.ResultCode === 1 && res.statusCode === 200) {
							//data.money = this.inputMoney;
							// var Data = JSON.stringify(data);
							// uni.navigateTo({
							//        url: './orderPay?index=' +Data
							// 	})
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: String(Date.now()),
								nonceStr: 'A1B2C3D4E5',
								package: 'prepay_id=wx20180101abcdefg',
								signType: 'MD5',
								paySign: '',
								success: function(res) {
									console.log('success:' + JSON.stringify(res));
									uni.showModal({
										title: '支付成功'
									})
									setTimeout(() => {
										uni.navigateBack({})
									}, 100)


								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));

									uni.showModal({
										title: '支付失败' + res.errMsg,
										showCancel: false
									})
								}
							});



						} else if (data.ResultCode !== 1 ) {
							console.log(data.ResultCode);
							uni.showModal({
								tltle: '温馨提醒',
								content: data.ResultMsg,
								showCancel: false
							})
						}

					}


				})
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
		margin-bottom: 20rpx;
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

	.input-mid.mid-place {
		color: #888888;
	}

	.input-img {
		justify-content: center;
		align-items: center;
		display: flex;
		flex-direction: column;
		width: 120rpx;
		height: 90rpx;
		box-sizing: border-box;

	}
</style>
