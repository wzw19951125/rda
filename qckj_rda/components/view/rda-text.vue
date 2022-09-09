<template>
	<view class="pages">
		<view v-if="'success' === type" class="logcat">
			<text class="title">提示 :</text>
			<text class="text success">{{text}}</text>
		</view>
		<view v-if="'failure' === type" class="logcat">
			<text class="title">提示 :</text>
			<text class="text failure">{{text}}</text>
		</view>
		<view v-if="'command' === type" class="logcat">
			<text class="title">操作 :</text>
			<text class="text">{{text}}</text>
		</view>
		<view v-if="'normal' === type" class="logcat line">
			<text class="title">结果 :</text>
			<text :class="'text ' + byTextCls(flag)">{{text}}</text>
		</view>
		<view v-if="'normal-none' === type" class="logcat line">
			<text class="title">      </text>
			<text class="text success">{{text}}</text>
		</view>
		<view v-if="'params' === type" class="logcat line">
			<text class="title">结果 :</text>
			<text :class="'text ' + byTextCls(flag)">{{text}}</text>
		</view>
		<view v-if="'records' === type" class="logcat line">
			<text class="title">结果 :</text>
			<text :class="'text ' + byTextCls(flag)">{{text}}</text>
		</view>
	</view>
</template>

<script>
	/**
	 * 日志输出的样式
	 * @property {String} type 类型
	 * @property {Boolean} flag 标识
	 * @property {String} text 内容
	 */
	export default {
		name: 'rda-text',
		props: {
			type: {
				type: String,
				default: 'success'
			},
			flag: {
				type: Boolean,
				default: false
			},
			text: {
				type: String,
				default: ''
			}
		},
		methods: {
			// 成功或失败时不同的class
			byTextCls(flag) {
				return flag ? 'success' : ' failure';
			},
		}
	}
</script>

<style scoped lang="scss">
	.pages {
		justify-content: center;
		align-items: center;
		display: flex;
		flex-direction: column;
		width: 750rpx;
		height: auto;
		box-sizing: border-box;
	}

	.logcat {
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

	.logcat.line {
		border-bottom: 2rpx solid #C0C0C0;
	}

	.title {
		width: 120rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: left;
		padding-left: 20rpx;
		color: #555555;
		font-size: 32rpx;
		box-sizing: border-box;
	}

	.text {
		width: 630rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: left;
		padding-right: 20rpx;
		color: #333333;
		font-size: 32rpx;
		box-sizing: border-box;
	}

	.text.success {
		color: #48A5EB;
	}

	.text.failure {
		color: #FA3534;
	}
</style>
