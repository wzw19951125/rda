<template>
	<view class="pages">
		<u-navbar title="用户信息" title-color="#FFFFFF" title-size="40" :is-fixed="true" back-icon-color="#FFF"
			:is-back="true" :background="$tools.navbarBg()" />
		<scroll-view class="pages" :style="{height: heightAll}" scroll-y="true">
			<view class="pages row">
				<text class="text-title">缴费编号</text>
				<text class="text-value">{{payable.PayCode}}</text>
			</view>
			<view class="pages row">
				<text class="text-title">客户名称</text>
				<text class="text-value">{{payable.Name}}</text>
			</view>
			<view class="pages row">
				<text class="text-title">用水地址</text>
				<text class="text-value">{{payable.Add}}</text>
			</view>
			<view class="pages row">
				<text class="text-title">表身号</text>
				<text class="text-value">{{payable.RealMeterID}}</text>
			</view>
			<view class="pages row">
				<text class="text-title">账户余额</text>
				<text class="text-value blue">{{formatMoney('Ye')}}</text>
			</view>
			<view class="pages row">
				<text class="text-title">欠费金额</text>
				<text class="text-value red">{{formatMoney('AllMoney')}}</text>
			</view>
			<view style="width: 750rpx;height: 20rpx;" />
			<view class="pages row" v-if="1 === payable.GasOrMoney">
				<text class="text-title">充值金额</text>
				<input class="text-input" placeholder-class="text-input place" type="digit" maxlength="10"
					placeholder="请输入充值金额" v-model="payNumber" />
			</view>
			<view class="pages row" v-if="0 === payable.GasOrMoney">
				<text class="text-title">购气金额</text>
				<input class="text-input" placeholder-class="text-input place" type="digit" maxlength="10"
					placeholder="请输入购气金额" v-model="payNumber" />
			</view>
			<view class="pages" style="height: auto;padding: 20rpx;">
				<button class="button-commit" hover-class="button-commit-hover" @tap="requestPay()">充值</button>
			</view>
		</scroll-view>
		<u-toast ref="uToast" />
		<!-- <view class="pages" style="height: 140rpx;padding: 20rpx;">
			<button class="button-commit" hover-class="button-commit-hover" @tap="requestPay()">充值</button>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				heightAll: '0px', // 页面body的高度
				meterId: '', // 表号
				payable: {}, // 应缴费用
				payNumber: '', // 充值/购气金额
			}
		},
		onLoad(params) {
			this.meterId = JSON.parse(params.params).meterId;
			setTimeout(() => this.requestInfo(), 200);
			let height = 0; // uni.upx2px(140);
			this.heightAll = this.$tools.bodyHeight(height, 0);
		},
		methods: {
			// 查询客户信息
			requestInfo() {
				this.$http.info({
					meterId: this.meterId
				}).then((res) => {
					this.payable = res;
				}).catch((error) => {
					this.$toast(error);
				});
			},
			// 支付
			requestPay() {
				let money = Number(this.payNumber);
				this.$http.pay({
					PayCode: this.payable.PayCode, // 缴费编号
					PreGas: 0, // 充值气量
					PreSave: money, // 充值金额
					OtherMoney: 0, // 其他金额
					AllMoney: money, // 总金额
					OrganCode: this.payable.OrganCode
				}).then((res) => {
					let res11 = JSON.stringify(res);
					// 7.0生成3.0可执行的日结算指令
					this.$http.query(res).then((res) => {
						uni.$emit('pay-success', res);
						uni.navigateBack();
					}).catch((error) => {
						this.$toast(error);
					});
				}).catch((error) => {
					this.$toast(error);
				});
			},
			// 处理金额
			formatMoney(key) {
				let has = this.payable.hasOwnProperty(key);
				return has ? (this.payable[key] + ' 元') : '';
			}
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

	.button-commit {
		width: 710rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 36rpx;
		border: 0 none;
		border-radius: 50rpx;
		background-color: #48A5EB;
	}

	.button-commit::after {
		border: none;
	}

	.button-commit[disabled] {
		color: #FFFFFF !important;
		background-color: #D2CFCB !important;
	}

	.button-commit-hover {
		width: 710rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 50rpx;
		border: 0 none;
		border-radius: 50rpx;
		background-color: #439CDB;
	}

	.button-commit-hover::after {
		border: none;
	}

	.pages.row {
		align-items: center;
		flex-direction: row;
		height: 90rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-bottom: solid 2rpx #E4E7ED;
	}

	.text-title {
		width: 200rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: left;
		font-size: 34rpx;
		color: #888888;
		padding-left: 30rpx;
		box-sizing: border-box;
	}

	.text-value {
		width: 550rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: right;
		font-size: 34rpx;
		color: #000000;
		padding-right: 30rpx;
		box-sizing: border-box;
	}

	.text-value.blue {
		color: #48A5EB;
	}

	.text-value.red {
		color: #FA3534;
	}

	.text-input {
		width: 550rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: right;
		font-size: 34rpx;
		color: #000000;
		padding-right: 30rpx;
		box-sizing: border-box;
	}

	.text-input.place {
		color: #555555;
	}
</style>
