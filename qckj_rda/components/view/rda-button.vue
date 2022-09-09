<template>
	<view class="pages">
		<view class="button" v-if="1 === number">
			<button class="button-commit" hover-class="button-commit-hover" @tap="click(0)">{{title[0]}}</button>
			<view style="width: 486rpx;height: 90rpx;" />
		</view>
		<view class="button" v-if="2 === number">
			<button class="button-commit" hover-class="button-commit-hover" @tap="click(0)">{{title[0]}}</button>
			<view style="width: 19rpx;height: 90rpx;" />
			<button class="button-commit" hover-class="button-commit-hover" @tap="click(1)">{{title[1]}}</button>
			<view style="width: 243rpx;height: 90rpx;" />
		</view>
		<view class="button" v-if="3 === number">
			<button class="button-commit" hover-class="button-commit-hover" @tap="click(0)">{{title[0]}}</button>
			<view style="width: 19rpx;height: 90rpx;" />
			<button class="button-commit" hover-class="button-commit-hover" @tap="click(1)">{{title[1]}}</button>
			<view style="width: 19rpx;height: 90rpx;" />
			<button class="button-commit" hover-class="button-commit-hover" @tap="click(2)">{{title[2]}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'rda-button',
		props: {
			number: {
				type: Number,
				default: 3
			},
			title: {
				default: Array,
				default: () => {
					return ['', '', ''];
				}
			}
		},
		methods: {
			click(index) {
				this.$emit('click', index);
			}
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

	.button {
		justify-content: center;
		align-items: center;
		display: flex;
		flex-direction: row;
		width: 750rpx;
		height: auto;
		padding-top: 15rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		box-sizing: border-box;
	}

	.button-commit {
		width: 224rpx;
		height: 85rpx;
		line-height: 85rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 34rpx;
		border: 0 none;
		border-radius: 10rpx;
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
		width: 224rpx;
		height: 85rpx;
		line-height: 85rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 34rpx;
		border: 0 none;
		border-radius: 10rpx;
		background-color: #439CDB;
	}

	.button-commit-hover::after {
		border: none;
	}
</style>
